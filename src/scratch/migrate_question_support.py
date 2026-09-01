"""Materialize the canonical support/provenance/quality shape in the bank.

This is intentionally deterministic: it never changes statements, options or
official answers. It only derives presentation metadata from the existing
readingText and the source PDF pages.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
BANK = ROOT / "src" / "data" / "questionBank.ts"

PDFS = {
    "pdf_1_fonetica": "1. Fonética e Fonologia.pdf",
    "pdf_2_acentuacao": "2. Acentuação.pdf",
    "pdf_3_formacao": "3. Estrutura e Formação de Palavras.pdf",
    "pdf_4_classes_var": "4. Classes de Palavras Variaveis.pdf",
    "pdf_5_classes_invar": "5. Classes de Palavras invariáveis.pdf",
    "pdf_6_pronomes": "6. Pronomes.pdf",
    "pdf_7": "7. Verbos.pdf",
}

LABEL_RE = re.compile(r"^(?:TEXTO|Texto)\s+(?:[IVX]+|\d+)$", re.I)
SOURCE_RE = re.compile(
    r"^(?:Fonte|Dispon[ií]vel|Acesso|Adaptado)\b|^\(?https?://|"
    r"\b(?:Dispon[ií]vel|Acesso em|Texto adaptado|Texto Adaptado|"
    r"Editora|Itatiaia|Rocco|Saraiva|Companhia das Letras|Record|Moderna|"
    r"Phonogram|Philips)\b|^\([A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][^\n]{0,220}\b(?:19|20)\d{2}\b[^\n]*\)$",
    re.I,
)
INSTRUCTION_RE = re.compile(
    r"^(?:Leia|Leia-se|Observe|Observ[eé]|Considere|Assinale|Marque|Julgue|"
    r"Indique|Responda|Analise|Aponte)\b",
    re.I,
)


def clean_markup(value: str) -> str:
    return re.sub(r"</?(?:u|b|strong)>|\*\*", "", value, flags=re.I).strip()


def byline(value: str) -> bool:
    plain = clean_markup(value)
    words = plain.split()
    if not 2 <= len(words) <= 8 or re.search(r"[.!?:;(),\"\d]", plain):
        return False
    if re.match(r"^(?:A|O|As|Os|Um|Uma)\s", plain):
        return False
    connectors = {"a", "e", "da", "das", "de", "do", "dos", "em", "na", "no"}
    return all(word.lower() in connectors or i == 0 or word[:1].isupper() for i, word in enumerate(words))


def title(value: str) -> bool:
    plain = clean_markup(value)
    return bool(
        plain
        and len(plain) <= 140
        and not re.search(r"[.!?:;]$", plain)
        and not re.match(r"^\d{1,2}\s*[§º°]", plain)
        and not INSTRUCTION_RE.match(plain)
        and not SOURCE_RE.match(plain)
    )


def body_block(value: str) -> str:
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in value.splitlines() if line.strip()]
    if len(lines) <= 1:
        return lines[0] if lines else ""
    structured = any(
        re.match(r"^(?:[—–-]\s+|\d{1,2}\s*[§º°]|[IVX]{1,4}\s*[-–—:.])", line, re.I)
        for line in lines
    )
    verse = len(lines) >= 3 and all(len(line) <= 92 and not re.search(r"[.!?;:]$", line) for line in lines)
    return "\n".join(lines) if structured or verse else " ".join(lines)


def split_inline_source(block: str) -> tuple[str, str] | None:
    match = re.search(
        r"(?:\n\s*|\s+)(?=\(?(?:Dispon[ií]vel|Fonte:|Acesso em:?)\b|"
        r"[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][^\n]{1,100}\bTexto Adaptado\b)",
        block,
        re.I,
    )
    if match and match.start() > 0:
        return block[: match.start()].strip(), block[match.start() :].strip()
    citation = re.search(r"\s+(\([A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][^()\n]{0,220}\b(?:19|20)\d{2}\b[^()\n]*\))$", block)
    if citation and citation.start() > 0:
        return block[: citation.start()].strip(), citation.group(1).strip()
    return None


def parse_support(raw: str | None) -> dict | None:
    if not raw or not raw.strip():
        return None
    blocks: list[str] = []
    for block in re.split(r"\n\s*\n+", raw.replace("\r\n", "\n").strip()):
        block = "\n".join(re.sub(r"[ \t]+", " ", line).strip() for line in block.splitlines() if line.strip()).strip()
        if not block:
            continue
        lines = block.splitlines()
        if lines and LABEL_RE.fullmatch(clean_markup(lines[0])) and len(lines) > 1:
            blocks.append(lines[0])
            blocks.append("\n".join(lines[1:]).strip())
            continue
        split = split_inline_source(block)
        blocks.extend(split if split else [block])

    support: dict = {"paragraphs": []}
    index = 0
    if blocks and LABEL_RE.fullmatch(clean_markup(blocks[0])):
        support["label"] = clean_markup(blocks[0]).replace("Texto", "TEXTO", 1)
        index = 1
        if index < len(blocks) and re.fullmatch(r"(?:I|II|III|IV|V|VI|VII|VIII|IX|X)", clean_markup(blocks[index]), re.I):
            index += 1
    if index < len(blocks) and title(blocks[index]):
        support["title"] = clean_markup(blocks[index])
        index += 1
    if index < len(blocks) and byline(blocks[index]):
        support["author"] = clean_markup(blocks[index])
        index += 1
    remaining = blocks[index:]
    if remaining and SOURCE_RE.search(clean_markup(remaining[-1])):
        support["source"] = clean_markup(remaining.pop())
    support["paragraphs"] = [body_block(block) for block in remaining if body_block(block)]
    for field in ("label", "title", "author", "source"):
        if support.get(field):
            support[field] = re.sub(r"\s+", " ", clean_markup(support[field])).strip()
    return support if any(support.get(key) for key in ("label", "title", "author", "source", "paragraphs")) else None


def question_page_map(list_id: str) -> tuple[str, dict[int, int], int | None]:
    filename = PDFS[list_id]
    pages = [page.extract_text() or "" for page in PdfReader(ROOT / "lists" / filename).pages]
    result: dict[int, int] = {}
    for number in range(1, 200):
        for page_number, text in enumerate(pages, 1):
            if re.search(rf"(?i)(?:quest(?:ão|ao)\s+{number}\b|^\s*{number}\s*[.)-]\s+)", text, re.M):
                result[number] = page_number
                break
    answer_page = next(
        (page_number for page_number, text in enumerate(pages, 1) if re.search(r"(?:RESPOSTAS|GABARITO|GABARITOS)", text, re.I)),
        None,
    )
    return filename, result, answer_page


def quality(question: dict, support: dict | None) -> dict:
    warnings: list[str] = []
    all_text = "\n".join(
        [question.get("statement", ""), json.dumps(support or {}, ensure_ascii=False)]
        + [option.get("text", "") for option in question.get("options", [])]
    )
    if len(question.get("options", [])) not in (4, 5):
        warnings.append("Quantidade de alternativas diferente de 4 ou 5.")
    if sum(bool(option.get("correct")) for option in question.get("options", [])) != 1:
        warnings.append("Deve existir exatamente uma alternativa correta.")
    if not any(option.get("letter") == question.get("correctLetter") and option.get("correct") for option in question.get("options", [])):
        warnings.append("Gabarito e alternativa marcada não coincidem.")
    if re.search(r"[�¢€†]", all_text):
        warnings.append("Caractere corrompido detectado.")
    if all_text.count("**") % 2 or all_text.count("<u>") != all_text.count("</u>"):
        warnings.append("Marcação de destaque desbalanceada.")
    if support and re.search(r"</?(?:u|b|strong)>|\*\*", support.get("title", ""), re.I):
        warnings.append("Título contém marcação visual decorativa.")
    if re.search(r"\b(?:sublinhad[oa]s?|grif[oa]s?|destacad[oa]s?|em negrito)\b", question.get("statement", ""), re.I) and not re.search(r"<u>.+?</u>|\*\*.+?\*\*", all_text, re.S):
        warnings.append("O enunciado exige destaque visual sem alvo identificado.")
    return {"status": "warning" if warnings else "verified", "warnings": warnings}


def main() -> None:
    text = BANK.read_text(encoding="utf-8")
    marker = text.index("export const QUESTION_BANK")
    payload_start = text.index(" = ", marker) + 3
    questions = json.loads(text[payload_start:].rstrip().removesuffix(";"))
    maps = {list_id: question_page_map(list_id) for list_id in PDFS}
    for question in questions:
        support = parse_support(question.get("readingText"))
        if support is None:
            question.pop("support", None)
        else:
            question["support"] = support
        filename, pages, answer_page = maps[question["listId"]]
        question["provenance"] = {
            "pdf": filename,
            "questionPage": pages.get(int(question["questionNumber"])),
            "answerPage": answer_page,
        }
        question["quality"] = quality(question, support)
    BANK.write_text(text[:payload_start] + json.dumps(questions, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"migrated {len(questions)} questions with support metadata")
    print(f"warnings: {sum(q['quality']['status'] == 'warning' for q in questions)}")
    print(f"missing question pages: {sum(not q['provenance'].get('questionPage') for q in questions)}")


if __name__ == "__main__":
    main()
