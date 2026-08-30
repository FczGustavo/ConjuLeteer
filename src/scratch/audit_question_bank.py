"""Deterministic audit of questionBank.ts against the official PDF answer keys."""

from __future__ import annotations

import json
import re
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[2]
BANK_PATH = ROOT / "src" / "data" / "questionBank.ts"
PDF_DIR = ROOT / "lists"

PDFS = [
    ("pdf_1_fonetica", "1. Fonética e Fonologia.pdf", "Respostas"),
    ("pdf_2_acentuacao", "2. Acentuação.pdf", "Respostas"),
    ("pdf_3_formacao", "3. Estrutura e Formação de Palavras.pdf", "Respostas"),
    ("pdf_4_classes_var", "4. Classes de Palavras Variaveis.pdf", "Respostas"),
    ("pdf_5_classes_invar", "5. Classes de Palavras invariáveis.pdf", "Respostas"),
    ("pdf_6_pronomes", "6. Pronomes.pdf", "Respostas"),
    ("pdf_7", "7. Verbos.pdf", "Respostas"),
    ("pdf_16", "16. Modos Verbais I  - [✅].pdf", "GABARITO"),
    ("pdf_17", "17.  Modos Verbais II  - [✅].pdf", "GABARITO"),
]

EXPECTED_LIST_COUNTS = {
    "pdf_7": 92,
    "pdf_16": 30,
    "pdf_17": 30,
}


def load_bank() -> list[dict]:
    source = BANK_PATH.read_text(encoding="utf-8")
    declaration = source.index("export const QUESTION_BANK")
    payload = source.index(" = ", declaration) + 3
    return json.loads(source[payload:].rstrip().removesuffix(";"))


def official_answers(filename: str, marker: str) -> dict[int, str]:
    reader = PdfReader(PDF_DIR / filename)
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    marker_pos = text.upper().rfind(marker.upper())
    if marker_pos < 0:
        raise ValueError(f"Bloco oficial '{marker}' ausente em {filename}")
    return {
        int(number): letter
        for number, letter in re.findall(
            r"(\d{1,3})\s*[\)\.\-]?\s*([A-E])\b", text[marker_pos:]
        )
    }


def main() -> int:
    questions = load_bank()
    issues: list[str] = []

    if len(questions) != 591:
        issues.append(f"Quantidade inesperada: {len(questions)} (esperado: 591)")
    if len({question["id"] for question in questions}) != len(questions):
        issues.append("Existem IDs duplicados")

    for list_id, filename, marker in PDFS:
        answers = official_answers(filename, marker)
        subset = [question for question in questions if question["listId"] == list_id]
        expected_count = EXPECTED_LIST_COUNTS.get(list_id)
        if expected_count is not None and len(subset) != expected_count:
            issues.append(f"{list_id}: quantidade inesperada ({len(subset)}; esperado: {expected_count})")
        expected_numbers = set(answers)
        actual_numbers = {question["questionNumber"] for question in subset}
        if actual_numbers != expected_numbers:
            missing = sorted(expected_numbers - actual_numbers)
            extra = sorted(actual_numbers - expected_numbers)
            issues.append(
                f"{list_id}: conjunto de questões divergente (faltantes={missing}, extras={extra})"
            )
        for question in subset:
            number = question["questionNumber"]
            expected = answers.get(number)
            if expected != question["correctLetter"]:
                issues.append(
                    f"{question['id']}: banco {question['correctLetter']} / PDF {expected}"
                )

    for question in questions:
        options = question.get("options", [])
        marked = [option["letter"] for option in options if option.get("correct")]
        letters = [option["letter"] for option in options]
        if len(options) not in (4, 5):
            issues.append(f"{question['id']}: {len(options)} alternativas")
        if len(set(letters)) != len(letters):
            issues.append(f"{question['id']}: letras de alternativas duplicadas")
        if marked != [question["correctLetter"]]:
            issues.append(
                f"{question['id']}: marcadas {marked}, correta {question['correctLetter']}"
            )
        if not question.get("statement", "").strip():
            issues.append(f"{question['id']}: enunciado vazio")
        if any(not option.get("text", "").strip() for option in options):
            issues.append(f"{question['id']}: alternativa vazia")
        if any(re.fullmatch(r"(?:Opção|Alternativa) [A-E]", option["text"], re.I) for option in options):
            issues.append(f"{question['id']}: alternativa placeholder")

        combined_text = " ".join(
            [question.get("readingText", ""), question.get("statement", "")]
            + [option.get("text", "") for option in options]
        )
        if any(marker in combined_text for marker in ("�", "¢", "€", "†", "--- PAGE")):
            issues.append(f"{question['id']}: caractere ou marcador corrompido")
        if "****" in combined_text or re.search(r"\*\*[-–—:;,.!?]\*\*", combined_text):
            issues.append(f"{question['id']}: marcador de negrito solto em pontuação")
        if re.search(r"\bocéu\b", combined_text, re.IGNORECASE):
            issues.append(f"{question['id']}: palavra extraída como 'océu' sem separação")
        known_text_corruptions = (
            "ensaios: losóficos", "de: nitivo", "Filoso: a", "influu",
            "influumbências", "fundamentaispara", "seestabelece",
            "empurrandoo", "ooficial", ": nanciava", ": nanciamento",
            "bene-ciava", "corpori-cada", "de-nia", "descon-ança",
            "descon-ar", "diversi-cadas", "especí-cas", "garra-nha",
            "-gurando", "inde-níveis", "-lmes", "-lósofo", "-nalidade",
            "-sionomia", "pernas -nas", "eu -co", "difinitivamente",
            "influênciadores", "previlégios", "herbâceas", "serumano",
            "Cuminense", "Balltico", "Saíamina", "home oace", "home opce",
            "Poresta", "avi daé", "aqu ese", "flordes", "monoxido",
            "retribuido",
        )
        if any(marker.lower() in combined_text.lower() for marker in known_text_corruptions):
            issues.append(f"{question['id']}: corrupção textual conhecida")
        if re.search(r"\(\*{3,}\.\s*\d", combined_text):
            issues.append(f"{question['id']}: referência de linha corrompida")
        if re.search(r"\d+§(?=[A-Za-zÀ-ÿ])", combined_text):
            issues.append(f"{question['id']}: marcador de parágrafo sem separação")
        for field_name, field_value in (
            ("readingText", question.get("readingText", "")),
            ("statement", question.get("statement", "")),
            *[(f"alternativa {option['letter']}", option.get("text", "")) for option in options],
        ):
            if field_value.count("**") % 2:
                issues.append(f"{question['id']}: negrito Markdown desbalanceado em {field_name}")
        if re.search(r"(?:^|\n)\s*[A-E]\)\s+", question.get("readingText", "")):
            issues.append(f"{question['id']}: marcador de alternativa vazou para o texto de apoio")
        if question.get("readingText", "").splitlines()[-1:] and re.match(
            r"^Com base no texto,\s*responda\s+(?:à|às|a)\s+quest", 
            question.get("readingText", "").splitlines()[-1],
            re.IGNORECASE,
        ):
            issues.append(f"{question['id']}: comando genérico permaneceu no texto de apoio")
        if not question.get("readingText") and re.match(r"^TEXTO\s+[IVX]+\b", question.get("statement", ""), re.I):
            issues.append(f"{question['id']}: referência a texto de apoio sem conteúdo")

    restored_support = {
        "classes_var-pdf_4_classes_var-q39",
        "classes_var-pdf_4_classes_var-q60",
        "classes_var-pdf_4_classes_var-q61",
        "classes_var-pdf_4_classes_var-q62",
        "classes_invar-pdf_5_classes_invar-q24",
        "classes_invar-pdf_5_classes_invar-q25",
        "pronomes-pdf_6_pronomes-q45",
        "verbos-pdf_7-q5",
    }
    by_id = {question["id"]: question for question in questions}
    for question_id in restored_support:
        if not by_id.get(question_id, {}).get("readingText", "").strip():
            issues.append(f"{question_id}: texto escaneado restaurado ausente")

    # Regression guards for the two 30-question verb sheets. These are the
    # exact structures most affected by PDF style-run fragmentation.
    formatting_guards = {
        "verbos-pdf_16-q1": "______",
        "verbos-pdf_16-q9": "1 –",
        "verbos-pdf_16-q11": "**derem**",
        "verbos-pdf_16-q20": "______ a pulsar",
        "verbos-pdf_17-q11": "**cresceria**",
        "verbos-pdf_17-q12": "______ o resultado",
        "verbos-pdf_17-q17": "o céu",
        "verbos-pdf_17-q24": "O verbo pertence à segunda conjugação",
        "verbos-pdf_17-q27": "______ mais aperfeiçoados",
    }
    for question_id, marker in formatting_guards.items():
        if marker not in by_id.get(question_id, {}).get("statement", "") and marker not in by_id.get(question_id, {}).get("readingText", ""):
            issues.append(f"{question_id}: estrutura de formatação esperada ausente ({marker})")

    if issues:
        print(f"FALHA: {len(issues)} problema(s)")
        print("\n".join(f"- {issue}" for issue in issues))
        return 1

    print(f"OK: {len(questions)} questões, 9 PDFs, gabaritos e estrutura consistentes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
