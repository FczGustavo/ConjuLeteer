"""Normalize presentation artifacts in the imported question bank.

This is intentionally conservative: it only repairs markup/spacing artifacts
introduced by PDF text extraction and never changes options, answers or IDs.
"""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
BANK_PATH = ROOT / "src" / "data" / "questionBank.ts"
RECOVERED_PIPOCA_PATH = ROOT / "src" / "scratch" / "recovered_pipoca.txt"

HEADER_RE = re.compile(
    r"^(?:Portugu[eê]s|Acentua[cç][aã]o|Estrutura(?:\s+da\s+palavra)?|"
    r"Novo acordo ortogr[aá]fico|S[ií]laba e fonemas|Processos de forma[cç][aã]o de palavras|"
    r"Verbos|Classes(?: de palavras)?|Pronomes|Sujeito|Sintaxe|Morfologia|"
    r"Significa[cç][aã]o|Empregos|Coloca[cç][aã]o pronominal)\b",
    re.I,
)

# Directions such as "Leia o texto..." are part of the question command, not
# of the source excerpt.  They were often captured by the PDF text layer as a
# support paragraph, producing a redundant line in the support card.
REDUNDANT_SUPPORT_RE = re.compile(
    r"^(?:Leia\s*:?|Leia(?:\s+(?:o|a|os|as))?\s+(?:textos?|trechos?|excertos?|fragmentos?|frases?)(?:\s+(?:a|ao)\s+seguir|\s+abaixo|\s+seguinte|\s+destacado)?\s*[:.]?|"
    r"Leia\s+atentamente(?:\s+o\s+(?:seguinte\s+)?(?:texto|trecho)|\s+o\s+trecho\s+(?:a|ao)\s+seguir|\s+e\s+assinale\s+a\s+alternativa\s+correta)?\s*[:.]?|"
    r"Observe\s*:?|Observe\s+atentamente(?:\s+o\s+(?:seguinte\s+)?(?:texto|trecho|quesito))?\s*[:.]?|"
    r"Após\s+a\s+leitura\s+atenta[^.?!]{0,180}(?:responda|questão\s+proposta)[.!?]?|"
    r"Lido\s+o\s+texto,[^.?!]{0,220}(?:alternativa|opção)\s+correta(?:\s+em\s+cada\s+questão)?[.!?]?|"
    r"Com\s+base\s+no\s+texto,?\s+responda\s+(?:à\s+)?questão[.!?]?|"
    r"Para\s+responder\s+(?:à\s+)?questão\s*:?)$",
    re.I,
)

INLINE_SUPPORT_START_RE = re.compile(r"^(?:Leia|Observe|Considere)\b", re.I)
INLINE_COMMAND_RE = re.compile(
    r"^(?:As\s+consoantes|Os\s+encontros|Entre|Passe|Substituindo|Em\s+seguida|A\s+sequência|No\s+texto|Assinale|Indique|Marque|Qual|Complete|Em\s+relação|De\s+acordo)\b",
    re.I,
)

# Command starters are editorial instructions, not semantic targets for a
# question.  PDF extraction occasionally turns the bold/underlined command
# styling into a visual mark in the app (for example ``<u>Assinale</u>``).
# Strip only a marked starter at the beginning of the statement; highlights
# in the body and alternatives remain untouched.
INSTRUCTION_START_RE = re.compile(
    r"^(\s*)(?:<u>\s*(Assinale|Marque|Observe|Leia(?:-se)?|Indique|Aponte|"
    r"Considere|Analise|Responda|Complete)\s*</u>|\*\*\s*(Assinale|Marque|"
    r"Observe|Leia(?:-se)?|Indique|Aponte|Considere|Analise|Responda|Complete)\s*\*\*)",
    re.I,
)


def plain(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<\/?(?:u|b|strong)>|\*\*", "", value or "", flags=re.I)).strip()


def strip_support_instruction(value: str) -> str:
    """Drop a meta direction, or its prefix when real excerpt follows."""
    value = value.replace("\r\n", "\n").replace("\r", "\n").strip()
    if not value or REDUNDANT_SUPPORT_RE.fullmatch(plain(value)):
        return ""
    match = re.match(
        r"^(?:Leia(?:[-\s]+(?:(?:o|a|os|as)\s+)?(?:textos?|trechos?|excertos?|fragmentos?|frases?)[^:]{0,100})?|"
        r"Observe(?:\s+atentamente[^:]{0,100})?|"
        r"Após\s+a\s+leitura\s+atenta[^.?!]{0,180}(?:responda|questão\s+proposta)|"
        r"Lido\s+o\s+texto,[^.?!]{0,220}(?:alternativa|opção)\s+correta(?:\s+em\s+cada\s+questão)?)\s*[:.]\s*(.+)$",
        value,
        flags=re.I | re.S,
    )
    if match and len(plain(match.group(1))) >= 24:
        return match.group(1).strip()
    # OCR occasionally loses the period between the generic direction and the
    # actual question text.  Keep the latter, but never keep the duplicated
    # "Lido o texto..." prefix in the support card.
    match = re.match(
        r"^Lido\s+o\s+texto,[^.?!]{0,220}(?:alternativa|opção)\s+correta(?:\s+em\s+cada\s+questão)?\s+(.+)$",
        value,
        flags=re.I | re.S,
    )
    if match and len(plain(match.group(1))) >= 24:
        return match.group(1).strip()
    return value


def clean_support_paragraphs(paragraphs: list[str]) -> list[str]:
    cleaned: list[str] = []
    for paragraph in paragraphs:
        value = strip_support_instruction(paragraph)
        if not value:
            continue
        lines = [re.sub(r"[ \t]+", " ", line.replace("\u00a0", " ")).strip() for line in value.split("\n")]
        lines = [line for line in lines if line]
        if lines:
            cleaned.append("\n".join(lines))
    return cleaned


def is_source_line(value: str) -> bool:
    text = plain(value)
    return bool(
        re.match(r"^(?:Fonte|Dispon[ií]vel|Acesso|Adaptado)\b", text, re.I)
        or re.search(r"\b(?:Dispon[ií]vel em|Acesso em|Texto adaptado|Editora|Record|Rocco|Saraiva)\b", text, re.I)
        or re.match(r"^\([^\n]{3,240}\b(?:19|20)\d{2}\b[^\n]*\)$", text)
    )


def is_title_line(value: str) -> bool:
    text = plain(value)
    words = text.split()
    return bool(
        text
        and len(text) <= 100
        and len(words) <= 12
        # Ellipses are common in literary titles (e.g. "Sobre a escrita...")
        # and should not be mistaken for sentence punctuation.
        and not re.search(r"(?<!\.)[.!?:;)]$", text)
        and not REDUNDANT_SUPPORT_RE.match(text)
    )


def is_byline_line(value: str) -> bool:
    text = plain(value)
    words = text.split()
    if not 2 <= len(words) <= 9 or re.search(r"[.!?:;(),\d]", text):
        return False
    connectors = {"a", "e", "da", "das", "de", "do", "dos", "em", "na", "no", "the", "of"}
    return all(word.lower() in connectors or word[:1].isupper() for word in words)


def upgrade_support(support: dict | None, legacy_text: str = "") -> dict | None:
    if not isinstance(support, dict):
        return None
    paragraphs = clean_support_paragraphs([p for p in support.get("paragraphs", []) if isinstance(p, str)])
    # Idempotence: generated files may be normalized more than once during a
    # development import.  Do not accumulate repeated physical blocks.
    unique_paragraphs: list[str] = []
    seen_paragraphs: set[str] = set()
    for paragraph in paragraphs:
        key = plain(paragraph)
        if key and key not in seen_paragraphs:
            unique_paragraphs.append(paragraph)
            seen_paragraphs.add(key)
    paragraphs = unique_paragraphs
    normalized: dict = {"paragraphs": paragraphs}
    label = plain(str(support.get("label", ""))) if support.get("label") else ""
    if label and re.fullmatch(r"Texto\s+[IVX]+", label, re.I):
        label = re.sub(r"^Texto", "TEXTO", label, flags=re.I)
    if label:
        normalized["label"] = label
    title = plain(str(support.get("title", ""))) if support.get("title") else ""
    author = plain(str(support.get("author", ""))) if support.get("author") else ""
    source = plain(str(support.get("source", ""))) if support.get("source") else ""
    if title and REDUNDANT_SUPPORT_RE.fullmatch(title):
        title = ""
    if title and re.match(
        r"^(?:texto\s+para(?:\s+responder)?|a\s+afirmativa\s+que\s+apresenta|a\s+alternativa\s+que\s+apresenta)\b",
        title,
        flags=re.I,
    ):
        title = ""
    if title:
        # When the command and a real heading share one PDF text run, the
        # parser may store both as the title.  Retain only the heading.
        title = re.sub(
            r"^(?:Após\s+a\s+leitura\s+atenta[^.?!]{0,180}(?:responda|questão\s+proposta)|"
            r"Leia(?:\s+atentamente)?[^.?!]{0,180}(?:assinale|indique|responda)[^.?!]{0,180})\s*[.:]?\s*",
            "",
            title,
            flags=re.I,
        ).strip()
    # Older records sometimes stored the complete excerpt only in
    # ``readingText`` while the structured object contained a title (or even
    # mistook the whole excerpt for a title).  Hydrate the body before moving
    # metadata so the renderer receives one consistent structure.
    if not paragraphs and legacy_text.strip():
        legacy_blocks = clean_support_paragraphs([
            block for block in re.split(r"\n\s*\n+", legacy_text.replace("\r", "")) if block.strip()
        ])
        if legacy_blocks:
            title_plain = plain(title)
            first_plain = plain(legacy_blocks[0])
            if title_plain and title_plain == first_plain:
                # The current title is actually the only body paragraph.
                title = ""
            elif title_plain and title_plain in first_plain and len(title_plain) > 70:
                title = ""
            elif title_plain and first_plain == title_plain:
                legacy_blocks.pop(0)
            paragraphs = legacy_blocks
    # News excerpts often arrive as "Título Por Autor | data" in one line.
    # Keep the title and byline visually distinct in the support card.
    title_match = re.match(r"^(.+?)\s+Por\s+([^|]+?)(?:\s*\|\s*.+)?$", title, re.I)
    if title_match and not author:
        title, author = title_match.group(1).strip(), title_match.group(2).strip()
    if not title and paragraphs and is_title_line(paragraphs[0]):
        title = plain(paragraphs.pop(0))
    if not author and paragraphs and is_byline_line(paragraphs[0]):
        author = plain(paragraphs.pop(0))
    if not source and paragraphs:
        # A few PDF text layers put the citation before the excerpt instead
        # of at its end.  Move only a short, clearly bibliographic block; a
        # long paragraph that merely mentions a publisher is body content.
        source_index = None
        for index in (len(paragraphs) - 1, 0):
            if index < 0 or index >= len(paragraphs):
                continue
            if is_source_line(paragraphs[index]) and len(plain(paragraphs[index])) <= 500:
                source_index = index
                break
        if source_index is not None:
            source = plain(paragraphs.pop(source_index))
    meta_values = {plain(value) for value in (title, author, source) if value}
    paragraphs = [paragraph for paragraph in paragraphs if plain(paragraph) not in meta_values]
    if title:
        normalized["title"] = title
    if author:
        normalized["author"] = author
    if source:
        normalized["source"] = source
    normalized["paragraphs"] = paragraphs
    # A bare citation is not a support excerpt.  Keeping it as a support card
    # is the source of the phantom balloons seen in the question bank.
    if not paragraphs and not title and not author and source:
        return None
    return normalized if any(normalized.get(key) for key in ("label", "title", "author", "source")) or paragraphs else None


def split_inline_support(question: dict) -> None:
    """Promote an unambiguous reading passage embedded in the statement."""
    if question.get("support") or question.get("readingText"):
        return
    statement = (question.get("statement") or "").replace("\r", "").strip()
    if not INLINE_SUPPORT_START_RE.match(statement) or len(statement) < 180:
        return
    lines = statement.split("\n")
    first_line = lines[0].strip() if lines else ""
    body_start = None
    # A colon after "Leia:" / "Leia o texto...:" unambiguously separates the
    # reading direction from the excerpt.
    colon = first_line.find(":")
    if colon >= 0:
        body_start = len(first_line[: colon + 1])
    else:
        sentence = re.search(r"\.\s*(?=\S)", statement)
        if sentence:
            body_start = sentence.end()
    if body_start is None:
        return
    head = statement[:body_start].strip()
    remainder = statement[body_start:].strip()
    # If the first sentence is itself the command (q2), the remaining text is
    # all support.  Otherwise locate the question command after the passage.
    command_match = re.search(
        r"(?:^|\n)(?=(?:As\s+consoantes|Os\s+encontros|Entre|Passe|Substituindo|Em\s+seguida|A\s+sequência|No\s+texto|Assinale|Indique|Marque|Qual|Complete|Em\s+relação|De\s+acordo|Na\s+palavra|Quanto|Com\s+relação|Sabendo-se|Mantendo-se|Optando-se|O\s+tempo|A\s+forma|O\s+verbo|Em\s+qual|A\s+respeito)\b(?:\s|:|-))",
        remainder,
        re.I,
    )
    if command_match and command_match.start() > 0:
        body = remainder[:command_match.start()].strip()
        command = remainder[command_match.start():].strip()
    elif re.search(r"assinale|indique|responda|obt[eé]m-se|classificam-se", head, re.I) and len(remainder) >= 140:
        body, command = remainder, ""
    else:
        return
    if len(body) < 40:
        return
    # Remove only the leading reading direction, retaining the actual command.
    cleaned_head = re.sub(
        r"^Leia(?:\s+(?:o\s+)?(?:texto|trecho|excerto|fragmento)(?:\s+(?:a|ao)\s+(?:seguir|abaixo)|\s+abaixo|\s+a\s+seguir)?)?\s*(?:e\s+)?",
        "",
        head,
        flags=re.I,
    ).strip(" :")
    if command:
        new_statement = command
    elif cleaned_head:
        new_statement = cleaned_head[:1].upper() + cleaned_head[1:]
    else:
        return
    paragraphs = [re.sub(r"\s+", " ", part).strip() for part in re.split(r"\n\s*\n+", body) if part.strip()]
    if not paragraphs:
        return
    question["support"] = {"paragraphs": paragraphs}
    question["readingText"] = "\n\n".join(paragraphs)
    question["statement"] = new_statement


def strip_statement_preamble(statement: str, has_support: bool) -> str:
    if not has_support:
        return statement
    value = (statement or "").replace("\r", "").strip()
    value = re.sub(r"^(?:Após\s+a\s+leitura\s+atenta[^.?!]{0,180}(?:responda|questão\s+proposta)|Lido\s+o\s+texto,[^.?!]{0,240}(?:alternativa|opção)\s+correta)[.!?]\s*", "", value, flags=re.I)
    value = re.sub(
        r"^Lido\s+o\s+texto,\s*(?:\*\*)?observe\s+atentamente(?:\*\*)?\s+o\s+quesito\s+e\s+assinale\s+somente\s+(?:\*\*)?uma(?:\*\*)?\s+alternativa\s+correta(?:\s+em\s+cada\s+questão)?\s*[:.]?\s*",
        "",
        value,
        flags=re.I,
    )
    value = re.sub(r"^Leia(?:\s+atentamente)?(?:\s+(?:o\s+)?(?:textos?|trechos?|excertos?|fragmentos?|frases?)[^:]{0,100})?\s*(?:em\s+destaque\s*)?[:.]\s*", "", value, flags=re.I)
    return value.strip()


def _support_body_size(support: dict | None) -> int:
    if not isinstance(support, dict):
        return 0
    return sum(len(plain(paragraph)) for paragraph in support.get("paragraphs", []) if isinstance(paragraph, str))


def hydrate_shared_support(data: list[dict]) -> None:
    """Fill metadata-only cards from an identical passage used nearby.

    Some PDFs repeat a passage title and citation for every question while
    only the first occurrence contains the body.  Keeping those metadata-only
    objects produced the empty balloons reported in the UI.  We copy a
    canonical structured support only when a distinctive title/citation
    fingerprint identifies the same passage; otherwise the card is removed.
    """
    candidates = [
        question for question in data
        if _support_body_size(question.get("support")) >= 120
    ]
    pipoca_paragraphs = []
    if RECOVERED_PIPOCA_PATH.exists():
        pipoca_paragraphs = clean_support_paragraphs(
            [block for block in RECOVERED_PIPOCA_PATH.read_text(encoding="utf-8").split("\n\n") if block.strip()]
        )
    recovered_pipoca_ids = {
        "formacao-pdf_3_formacao-q90",
        "classes_var-pdf_4_classes_var-q46",
        "verbos-pdf_7-q80",
    }

    def copy_support(target: dict, source_question: dict) -> None:
        support = source_question.get("support")
        if not isinstance(support, dict):
            return
        target["support"] = json.loads(json.dumps(support, ensure_ascii=False))
        support = target["support"]
        target["readingText"] = "\n\n".join(
            value for value in (
                support.get("label"), support.get("title"), support.get("author"),
                *support.get("paragraphs", []), support.get("source"),
            ) if isinstance(value, str) and value.strip()
        )

    for question in data:
        support = question.get("support")
        if question.get("id") in recovered_pipoca_ids and pipoca_paragraphs:
            existing_source = plain(str((support or {}).get("source", ""))) if isinstance(support, dict) else ""
            question["support"] = {
                "title": "A PIPOCA",
                "author": "Rubem Alves",
                "paragraphs": pipoca_paragraphs,
                "source": existing_source or "Disponível em http://www.releituras.com/rubemalves_pipoca.asp. Acessado em 31 de mai. 2016. OBS.: O texto foi adaptado às regras do Novo Acordo Ortográfico.",
            }
            question["readingText"] = "\n\n".join(
                ["A PIPOCA", "Rubem Alves", *pipoca_paragraphs, question["support"]["source"]]
            )
            continue
        if not isinstance(support, dict) or _support_body_size(support) > 0:
            continue
        title = plain(str(support.get("title", "")))
        label = plain(str(support.get("label", "")))
        source = plain(str(support.get("source", "")))
        source_lower = source.lower()
        match = None

        # Pages 129/81 of the source PDFs are image-only.  The passage is
        # recovered once in a local, reviewed fixture so the three questions
        # that cite "A PIPOCA" do not render an empty title/source balloon.
        if title.upper() == "A PIPOCA" and "rubemalves_pipoca.asp" in source_lower and pipoca_paragraphs:
            question["support"] = {
                "title": "A PIPOCA",
                "author": "Rubem Alves",
                "paragraphs": pipoca_paragraphs,
                "source": source,
            }
            question["readingText"] = "\n\n".join(
                ["A PIPOCA", "Rubem Alves", *pipoca_paragraphs, source]
            )
            continue

        # Machado de Assis' "Um apólogo" is reused in two subjects.  The
        # malformed records contain the full excerpt in their citation field.
        if (title.upper() == "TEXTO 1" or label.upper() == "TEXTO 1") and "um apólogo" in source_lower:
            match = next(
                (candidate for candidate in candidates
                 if plain(str((candidate.get("support") or {}).get("title", ""))).lower() == "um apólogo"
                 and "agulha" in plain(" ".join((candidate.get("support") or {}).get("paragraphs", []))).lower()),
                None,
            )

        # The repeated "O mar, a primeira vez" excerpt has a stable opening
        # sentence even though its title was lost by the PDF layer.
        if match is None and label.upper() == "TEXTO 2" and "minha amiga me pergunta" in source_lower:
            match = next(
                (candidate for candidate in candidates
                 if "minha amiga me pergunta" in plain(" ".join((candidate.get("support") or {}).get("paragraphs", []))).lower()),
                None,
            )

        if match is not None:
            copy_support(question, match)
            # Preserve the repeated label when the canonical record did not
            # carry one, while keeping title/author/source editorially clean.
            if label and not question["support"].get("label"):
                question["support"]["label"] = label
            continue

        # A citation/title without an excerpt is not a support card.  Keep the
        # question usable and prevent the legacy readingText fallback from
        # recreating the same phantom balloon in the renderer.
        question.pop("support", None)
        question["readingText"] = ""

MANUAL_MARKS: dict[tuple[str, int, str], list[tuple[str, str]]] = {
    ("pdf_1_fonetica", 18, "statement"): [("alcançou recorde", "alcançou **recorde**"), ("prêmio Nobel", "prêmio **Nobel**")],
    ("pdf_1_fonetica", 19, "readingText"): [("cassino", "**cassino**"), ("beije", "**beije**"), ("Cólquida", "**Cólquida**")],
    ("pdf_1_fonetica", 50, "statement"): [("o amador", "o **amador**"), ("desejar", "**desejar**"), ("desejada", "**desejada**")],
    ("pdf_1_fonetica", 71, "statement"): [("o ai", "o **ai**"), ("que voa", "que **voa**")],
    ("pdf_1_fonetica", 72, "statement"): [("doze reféns", "doze **reféns**"), ("os tréns", "os **tréns**"), ("armazéns", "**armazéns**")],
    ("pdf_1_fonetica", 73, "statement"): [("Tapsia", "**Tapsia**")],
    ("pdf_1_fonetica", 78, "statement"): [("abelha rainha", "**abelha rainha**")],
    ("pdf_1_fonetica", 81, "statement"): [("que a convidou", "que **a** convidou"), ("irem a casa", "irem **a casa**"), ("iriam a pé", "iriam **a pé**"), ("a casa fica", "a **casa** fica"), ("a poucos", "a **poucos**")],
    ("pdf_2_acentuacao", 70, "option:C"): [("é mesmo", "<u>é</u> mesmo")],
    ("pdf_2_acentuacao", 71, "option:B"): [("dádivas", "<u>dádivas</u>")],
    ("pdf_2_acentuacao", 71, "option:C"): [("equívoco", "<u>equívoco</u>")],
    ("pdf_2_acentuacao", 72, "option:A"): [("colérico", "<u>colérico</u>")],
    ("pdf_3_formacao", 63, "option:B"): [("notícia de que", "notícia <u>de que</u>")],
    ("pdf_3_formacao", 89, "option:B"): [("do remar", "do <u>remar</u>")],
    ("pdf_3_formacao", 89, "option:D"): [("a busca", "a <u>busca</u>")],
    ("pdf_3_formacao", 91, "option:A"): [("de livraria", "de <u>livraria</u>")],
    ("pdf_3_formacao", 91, "option:C"): [("a crueldade", "a <u>crueldade</u>")],
    ("pdf_3_formacao", 91, "option:D"): [("calma ferocidade", "calma <u>ferocidade</u>")],
    ("pdf_4_classes_var", 26, "option:A"): [("não o fez", "não <u>o</u> fez")],
    ("pdf_4_classes_var", 40, "option:A"): [("de fora", "<u>de fora</u>")],
    ("pdf_4_classes_var", 40, "option:C"): [("do mar", "<u>do mar</u>")],
    ("pdf_4_classes_var", 40, "option:E"): [("do brejo", "<u>do brejo</u>")],
    ("pdf_4_classes_var", 42, "option:A"): [("São muitos", "São <u>muitos</u>")],
    ("pdf_4_classes_var", 42, "option:B"): [("ninguém", "<u>ninguém</u>")],
    ("pdf_4_classes_var", 42, "option:E"): [("para nada", "para <u>nada</u>")],
    ("pdf_4_classes_var", 45, "option:C"): [("para se decidir", "para <u>se</u> decidir")],
    ("pdf_4_classes_var", 45, "option:D"): [("barcos se fazem", "barcos <u>se</u> fazem")],
    ("pdf_4_classes_var", 65, "option:B"): [("uns doze", "uns <u>doze</u>")],
    ("pdf_5_classes_invar", 1, "option:C"): [("Depois a", "Depois <u>a</u>")],
    ("pdf_5_classes_invar", 8, "option:A"): [("não o fez", "não <u>o</u> fez")],
    ("pdf_5_classes_invar", 18, "option:C"): [("pela primeira vez", "<u>pela primeira vez</u>")],
    ("pdf_5_classes_invar", 18, "option:E"): [("pobre tarde de homem", "<u>pobre tarde de homem</u>")],
    ("pdf_6_pronomes", 1, "option:C"): [("esperá-lo", "esperá-<u>lo</u>")],
    ("pdf_6_pronomes", 12, "option:E"): [("médico lhe", "médico <u>lhe</u>")],
    ("pdf_6_pronomes", 15, "option:B"): [("cancelar a linha", "cancelar a <u>linha</u>")],
    ("pdf_6_pronomes", 15, "option:D"): [("na época", "na <u>época</u>")],
    ("pdf_6_pronomes", 42, "option:D"): [("apoio da FAPERJ", "<u>apoio da FAPERJ</u>")],
    ("pdf_6_pronomes", 44, "option:C"): [("com que", "<u>com que</u>")],
    ("pdf_6_pronomes", 54, "option:B"): [("sociedade-que", "sociedade<u>-</u>que")],
    ("pdf_6_pronomes", 66, "option:C"): [("olhou-me", "olhou-<u>me</u>")],
    ("pdf_6_pronomes", 70, "option:B"): [("em que te achas", "em que <u>te</u> achas")],
    ("pdf_6_pronomes", 83, "option:A"): [("e isto", "e <u>isto</u>")],
    ("pdf_6_pronomes", 83, "option:C"): [("de semelhante", "de <u>semelhante</u>")],
    ("pdf_6_pronomes", 83, "option:E"): [("Foi esse", "Foi <u>esse</u>")],
    ("pdf_6_pronomes", 92, "option:E"): [("sabê-lo", "sabê-<u>lo</u>")],
    ("pdf_7", 10, "option:B"): [("ferira-me", "<u>ferira-me</u>")],
    ("pdf_7", 10, "option:E"): [("Estivera", "<u>Estivera</u>")],
    ("pdf_7", 20, "readingText"): [("requer", "<u>requer</u>")],
    ("pdf_6_pronomes", 88, "option:A"): [("Visava ao circunstancial , ao episódico", "<u>Visava ao circunstancial , ao episódico</u>")],
    ("pdf_6_pronomes", 88, "option:B"): [("Não sou poeta (. . .)", "<u>Não sou poeta (. . .)</u>")],
    ("pdf_6_pronomes", 88, "option:C"): [("mal ousa balançar as perninhas", "<u>mal ousa balançar as perninhas</u>")],
    ("pdf_6_pronomes", 88, "option:D"): [("A meu lado o garçom encaminha a ordem", "<u>A meu lado o garçom encaminha a ordem</u>")],
    ("pdf_6_pronomes", 88, "option:E"): [("A negrinha agarra finalmente o bolo (.. .)", "<u>A negrinha agarra finalmente o bolo (.. .)</u>")],
    ("pdf_1_fonetica", 74, "statement"): [("da noite", "da <u>noite</u>"), ("tênues", "<u>tênues</u>"), ("de luar", "de <u>luar</u>")],
    ("pdf_6_pronomes", 66, "option:E"): [("informavam-me", "informavam-<u>me</u>")],
    ("pdf_6_pronomes", 68, "option:A"): [("me dirá", "<u>me</u> dirá")],
    ("pdf_6_pronomes", 68, "option:B"): [("integrou-se", "<u>integrou-se</u>")],
    ("pdf_6_pronomes", 68, "option:C"): [("acenando-lhe", "<u>acenando-lhe</u>")],
    ("pdf_6_pronomes", 68, "option:D"): [("fascinava-me", "fascinava-<u>me</u>")],
    ("pdf_6_pronomes", 68, "option:E"): [("Vi-a", "<u>Vi-a</u>")],
    ("pdf_4_classes_var", 23, "readingText"): [("das vitórias-régias", "das <u>vitórias-régias</u>")],
}

# Marks that were present in extracted content but are not pedagogically
# referenced by the original command.  Keep this list explicit and scoped to
# the individual record so future imports cannot silently lose meaningful
# emphasis.  In q5 of "Mulheres de Atenas", only "pros seus maridos" is
# referenced as underlined; the underline on "castigadas" is decorative OCR
# residue.
MANUAL_UNMARKS: dict[tuple[str, int, str], list[str]] = {
    ("pdf_7", 5, "option:B"): ["castigadas."],
    # The source PDF leaves this prose paragraph unmarked; the underline was
    # an extraction artifact and is not referenced by the command.
    ("pdf_7", 6, "support.paragraph:1"): ["Bons tempos aqueles em que a família em férias, no extenso litoral brasileiro, escolhia para locar uma casa ou um resort por conta da proximidade com o mar, pelo acesso ao comércio e pelas belezas naturais ao redor."],
}


def repair_bold_markers(value: str) -> str:
    positions = [m.start() for m in re.finditer(r"\*\*", value)]
    if len(positions) % 2:
        last = positions[-1]
        value = value[:last] + value[last + 2 :]
    # A single star is not a supported marker and is a common PDF residue.
    return re.sub(r"(?<!\*)\*(?!\*)", "", value)


def repair_markup(value: str) -> str:
    value = value.replace("</u</u>>", "</u></u>").replace("<</u>/u>", "</u></u>")
    value = re.sub(r"\*\*<u>([^<\n]*)\*?</u>\*?", r"<u>\1</u>", value)
    value = re.sub(r"\*\*<u>([^<\n]*)\*\*?</u>", r"<u>\1</u>", value)
    value = re.sub(r"<u>([^<\n]*)\*\*([^<\n]*)</u>([^*\n]*)\*\*", r"<u>\1\2</u>\3", value)
    value = re.sub(r"<u>([^<\n]*)</u>\*+([\wÀ-ÿ])", r"<u>\1\2</u>", value)
    value = re.sub(r"<u>([\s\S]*?)</u>", lambda m: f"<u>{m.group(1).replace('*', '')}</u>", value)
    value = re.sub(r"\bTexto\s+([IVX]+)<u>([^<\n]+)</u>", r"Texto \1\n\2", value)
    value = re.sub(r"\bTexto\s+([IVX]+)(?=[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ])", r"Texto \1\n", value)
    value = re.sub(r"(\d{1,2}\s*[§º°])(?=\S)", r"\1 ", value)
    value = re.sub(r"\beo\b", "e o", value)
    value = re.sub(r"\bea\b", "e a", value)
    value = re.sub(r"\beA\b", "e A", value)
    value = re.sub(r"\bEo\b", "E o", value)
    value = re.sub(r"\bEa\b", "E a", value)
    value = re.sub(r"\béa\b", "é a", value, flags=re.I)
    value = re.sub(r"\bu\s+mpronome\b", "um pronome", value, flags=re.I)
    value = re.sub(r"\bu\s+mverbo\b", "um verbo", value, flags=re.I)
    value = re.sub(r"\bE\s+muma\b", "Em uma", value)
    value = re.sub(r"\be\s+m\s+(?=\d)", "em ", value)
    value = re.sub(r"\btransformar\s+se\b", "transformar-se", value, flags=re.I)
    value = re.sub(r"\bfiorescia\b", "florescia", value, flags=re.I)
    value = re.sub(r"\bfiores\b", "flores", value, flags=re.I)
    value = value.replace("Refiexo", "Reflexo").replace("Iogo", "logo").replace("Garlos", "Carlos")
    for bad, good in (
        ("previlégios", "privilégios"),
        ("herbâceas", "herbáceas"),
        ("fundamentaispara", "fundamentais para"),
        ("influênciadores", "influenciadores"),
        ("difinitivamente", "definitivamente"),
        ("serumano", "ser humano"),
        ("Balltico", "Báltico"),
        ("seestabelece", "se estabelece"),
        ("empurrandoo", "empurrando o"),
        ("retribuido", "retribuído"),
    ):
        value = value.replace(bad, good)
    value = re.sub(r"\b0 termo\b", "O termo", value)
    value = re.sub(r"J&€\s*0", "Já o", value, flags=re.I)
    value = re.sub(r"\s+¢€?\s+", " — ", value)
    value = re.sub(r"\s+€\s+(?=(?:formado|isso|contudo)\b)", " é ", value, flags=re.I)
    value = value.replace("†", "?")
    value = "\n".join(repair_bold_markers(line) for line in value.split("\n"))
    return value


def strip_instruction_markup(value: str) -> str:
    """Remove decorative markup from the leading command word only."""
    return INSTRUCTION_START_RE.sub(lambda match: f"{match.group(1)}{match.group(2) or match.group(3)}", value, count=1)


def move_leading_access_to_source(question: dict) -> None:
    """Keep an extracted access date in the support source footer.

    A few PDF text layers placed ``Acesso em ...`` before the actual command,
    which made bibliographic metadata appear as part of the enunciado.  This
    deterministic repair is intentionally limited to a leading access line.
    """
    support = question.get("support")
    statement = str(question.get("statement") or "").replace("\r", "").strip()
    if not isinstance(support, dict) or not statement:
        return
    match = re.match(r"^(Acesso\s+em[^\n]{2,120})\n+(.+)$", statement, flags=re.I | re.S)
    if not match:
        return
    access = re.sub(r"\s+", " ", match.group(1)).strip()
    source = str(support.get("source") or "").strip()
    if access.casefold() not in source.casefold():
        support["source"] = f"{source} {access}".strip()
    question["statement"] = match.group(2).strip()


def repair_reading(value: str) -> str:
    value = repair_markup(value)
    lines = value.split("\n")
    while len(lines) > 1 and HEADER_RE.match(lines[0].strip()) and len(lines[0].strip()) < 180:
        lines.pop(0)
    if len(lines) == 1:
        line = lines[0].strip()
        citation_at = re.search(r"\s(?=\()", line)
        if citation_at and HEADER_RE.match(line[: citation_at.start()].strip()):
            lines[0] = line[citation_at.start() + 1 :]
    # Keep source and a following command in different visual blocks.
    result: list[str] = []
    for line in lines:
        if re.match(r"^Fonte\b", line, re.I):
            line = re.sub(r"\s+(?=(?:Leia|Observe|Considere|Assinale|Marque|Julgue|Indique)\b)", "\n", line, count=1, flags=re.I)
        result.extend(re.split(r"\s+(?=\(?(?:Dispon[ií]vel|Acesso em:?)\b)", line, maxsplit=1, flags=re.I))
    return "\n".join(result)


def apply_manual_marks(question: dict) -> None:
    key = (question.get("listId"), question.get("questionNumber"))
    for (list_id, number, field), replacements in MANUAL_MARKS.items():
        if key != (list_id, number):
            continue
        if field == "statement":
            target = question.get("statement", "")
            for old, new in replacements:
                if old in target and new not in target:
                    target = target.replace(old, new, 1)
            question["statement"] = target
        elif field == "readingText":
            target = question.get("readingText", "")
            for old, new in replacements:
                if old in target and new not in target:
                    target = target.replace(old, new, 1)
            question["readingText"] = target
        elif field.startswith("option:"):
            letter = field.split(":", 1)[1]
            for option in question.get("options", []):
                if option.get("letter") != letter:
                    continue
                target = option.get("text", "")
                for old, new in replacements:
                    if old in target and new not in target:
                        target = target.replace(old, new, 1)
                option["text"] = target

    for (list_id, number, field), targets in MANUAL_UNMARKS.items():
        if key != (list_id, number):
            continue
        if field.startswith("option:"):
            letter = field.split(":", 1)[1]
            for option in question.get("options", []):
                if option.get("letter") != letter:
                    continue
                target = option.get("text", "")
                for phrase in targets:
                    target = target.replace(f"<u>{phrase}</u>", phrase)
                option["text"] = target
        elif field.startswith("support.paragraph:"):
            try:
                index = int(field.split(":", 1)[1]) - 1
            except ValueError:
                continue
            support = question.get("support")
            if not isinstance(support, dict) or not isinstance(support.get("paragraphs"), list):
                continue
            if not 0 <= index < len(support["paragraphs"]):
                continue
            target = str(support["paragraphs"][index])
            for phrase in targets:
                target = target.replace(f"<u>{phrase}</u>", phrase)
                target = target.replace(f"**{phrase}**", phrase)
            support["paragraphs"][index] = target


def main() -> None:
    source = BANK_PATH.read_text(encoding="utf-8")
    marker = "export const QUESTION_BANK"
    start = source.index(" = ", source.index(marker)) + 3
    prefix, payload = source[:start], source[start:]
    data = json.loads(payload.rstrip().removesuffix(";"))
    for question in data:
        for field in ("statement",):
            question[field] = strip_instruction_markup(repair_markup(question.get(field, "")))
        for option in question.get("options", []):
            option["text"] = repair_markup(option.get("text", ""))
        if question.get("readingText"):
            question["readingText"] = repair_reading(question["readingText"])
        apply_manual_marks(question)
        # Keep bibliographic access dates in the structured source footer, not
        # in the question command (the Verbos q6 PDF exposed this extraction
        # artifact as a leading ``Acesso em ago. 2020`` line).
        move_leading_access_to_source(question)
        key = (question.get("listId"), question.get("questionNumber"))
        if key == ("pdf_7", 6):
            # The PDF has no visual target for "em destaque" in this command;
            # the imported underline was a full-paragraph extraction artifact.
            # Keep the original meaning while making the instruction honest
            # and preventing the renderer/auditor from showing a phantom cue.
            question["statement"] = re.sub(
                r"período\s+em\s+destaque\s+no\s+enunciado",
                "período apresentado no enunciado",
                question.get("statement", ""),
                count=1,
                flags=re.I,
            )
        if key in {
            ("pdf_4_classes_var", 29),
            ("pdf_5_classes_invar", 11),
        }:
            # The command explicitly says "trecho em destaque".  Restore the
            # single quoted excerpt as one semantic target instead of leaving
            # the instruction without a visible target.
            statement = question.get("statement", "")
            if not re.search(r"<u>.*?natureza humana.*?</u>", statement, re.I | re.S):
                statement = re.sub(
                    r"([“\"]?O termo transumanismo foi criado.*?natureza humana[”\"]?)",
                    r"<u>\1</u>",
                    statement,
                    count=1,
                    flags=re.I | re.S,
                )
            question["statement"] = statement
        # Keep the legacy compatibility text and the structured support in
        # lockstep.  This is also where old imports receive the same cleanup
        # as future PDF imports.
        had_structured_support = isinstance(question.get("support"), dict)
        question["support"] = upgrade_support(question.get("support"), question.get("readingText", ""))
        if question.get("support"):
            support = question["support"]
            # A few early records had only readingText populated.  If a
            # structured object is present, remove duplicated directions from
            # its paragraphs and make the metadata explicit.
            question["readingText"] = "\n\n".join(
                value for value in (
                    support.get("label"), support.get("title"), support.get("author"),
                    *support.get("paragraphs", []), support.get("source"),
                ) if isinstance(value, str) and value.strip()
            )
        else:
            split_inline_support(question)
            question["support"] = upgrade_support(question.get("support"), question.get("readingText", ""))
            if had_structured_support and question.get("support") is None:
                # A citation without an excerpt is provenance, not a support
                # card; prevent the legacy fallback from recreating a balloon.
                question["readingText"] = ""
        question["statement"] = strip_statement_preamble(question.get("statement", ""), bool(question.get("support")))
        if question.get("support") is None:
            question.pop("support", None)
    hydrate_shared_support(data)
    BANK_PATH.write_text(prefix + json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"normalized {len(data)} questions")


if __name__ == "__main__":
    main()
