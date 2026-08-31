"""Deterministic audit of questionBank.ts against the official PDF answer keys."""

from __future__ import annotations

import json
import re
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[2]
BANK_PATH = ROOT / "src" / "data" / "questionBank.ts"
SIMULADO_PATH = ROOT / "src" / "data" / "simuladoQuestions.ts"
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

REFERENCE_RE = re.compile(
    r"\b(?:sublinhad[oa]s?|grif[oa]d[oa]s?|destacad[oa]s?|em destaque|"
    r"em negrito|assinalad[oa]s?)\b",
    re.IGNORECASE,
)
STRICT_VISUAL_REFERENCE_RE = re.compile(
    r"\b(?:sublinhad[oa]s?|grif[oa]d[oa]s?|em negrito)\b",
    re.IGNORECASE,
)
QUOTED_TARGET_RE = re.compile(r"[“\"]\s*[^”\"\n]{1,160}\s*[”\"]")


def load_bank() -> list[dict]:
    source = BANK_PATH.read_text(encoding="utf-8")
    declaration = source.index("export const QUESTION_BANK")
    payload = source.index(" = ", declaration) + 3
    return json.loads(source[payload:].rstrip().removesuffix(";"))


def load_simulados() -> list[dict]:
    source = SIMULADO_PATH.read_text(encoding="utf-8")
    declaration = source.index("export const SIMULADO_QUESTIONS")
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
        support = question.get("support")
        provenance = question.get("provenance")
        quality = question.get("quality")
        # Built-in records must be fully migrated to the explicit support
        # schema.  Legacy readingText remains only as a compatibility field.
        if support is not None and not isinstance(support, dict):
            issues.append(f"{question['id']}: suporte estruturado inválido")
        elif isinstance(support, dict):
            paragraphs = support.get("paragraphs")
            if not isinstance(paragraphs, list):
                issues.append(f"{question['id']}: support.paragraphs inválido")
            elif any(not isinstance(paragraph, str) or not paragraph.strip() for paragraph in paragraphs):
                issues.append(f"{question['id']}: parágrafo vazio ou inválido")
            if any(re.search(r"<u>|</u>|\*\*", str(support.get(field, ""))) for field in ("label", "title", "author", "source")):
                issues.append(f"{question['id']}: marcação decorativa em metadado do apoio")
        if not isinstance(provenance, dict) or not provenance.get("pdf"):
            issues.append(f"{question['id']}: proveniência do PDF ausente")
        elif not isinstance(provenance.get("questionPage"), int) or not isinstance(provenance.get("answerPage"), int):
            issues.append(f"{question['id']}: páginas de questão/gabarito ausentes")
        if not isinstance(quality, dict) or quality.get("status") != "verified" or quality.get("warnings"):
            issues.append(f"{question['id']}: qualidade nativa não verificada")
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
            "Poresta", "avi daé", "aqu ese", "flordes",
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
            if field_value.count("<u>") != field_value.count("</u>"):
                issues.append(f"{question['id']}: sublinhado HTML desbalanceado em {field_name}")
            if re.search(r"<u>\s*</u>|\*\*\s*\*\*", field_value):
                issues.append(f"{question['id']}: marcação pedagógica vazia em {field_name}")
        statement = question.get("statement", "")
        has_visual_markup = bool(re.search(r"<u>.+?</u>|\*\*.+?\*\*", combined_text, re.DOTALL))
        has_quoted_target = bool(QUOTED_TARGET_RE.search(statement))
        if STRICT_VISUAL_REFERENCE_RE.search(statement) and not has_visual_markup:
            issues.append(f"{question['id']}: enunciado exige marcação visual, mas ela está ausente")
        elif REFERENCE_RE.search(statement) and not (has_visual_markup or has_quoted_target):
            issues.append(f"{question['id']}: referência a destaque sem alvo identificável")
        option_markers = [
            bool(re.search(r"<u>.+?</u>|\*\*.+?\*\*", option.get("text", ""), re.DOTALL))
            for option in options
        ]
        compares_marked_options = bool(
            re.search(r"\b(?:alternativas?|opç(?:ão|ões))\b", statement, re.IGNORECASE)
            and REFERENCE_RE.search(statement)
        )
        if compares_marked_options and sum(option_markers) >= 2 and not all(option_markers):
            missing_letters = [option["letter"] for option, present in zip(options, option_markers) if not present]
            issues.append(
                f"{question['id']}: alternativas sem o destaque exigido ({missing_letters})"
            )
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

        if isinstance(support, dict):
            support_text = " ".join(
                [str(support.get(field, "")) for field in ("label", "title", "author")]
                + [str(paragraph) for paragraph in support.get("paragraphs", [])]
                + [str(support.get("source", ""))]
            )
            if any(marker in support_text for marker in ("�", "¢", "€", "†")):
                issues.append(f"{question['id']}: caractere corrompido no apoio estruturado")

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

    # Simulator cards are a presentation copy of the canonical bank.  Keep
    # their content synchronized while preserving simulator-only explanations.
    canonical_by_key = {(question["listId"], question["questionNumber"]): question for question in questions}
    simulados = load_simulados()
    for simulado in simulados:
        canonical = canonical_by_key.get((simulado.get("listId"), simulado.get("questionNumber")))
        if canonical is None:
            issues.append(f"{simulado.get('id', '<simulado>')}: questão não encontrada no banco canônico")
            continue
        if simulado.get("statement") != canonical.get("statement") or simulado.get("correctLetter") != canonical.get("correctLetter"):
            issues.append(f"{simulado.get('id', '<simulado>')}: enunciado/gabarito divergente do banco")
        sim_options = [(option.get("letter"), option.get("text"), option.get("correct")) for option in simulado.get("options", [])]
        bank_options = [(option.get("letter"), option.get("text"), option.get("correct")) for option in canonical.get("options", [])]
        if sim_options != bank_options:
            issues.append(f"{simulado.get('id', '<simulado>')}: alternativas divergentes do banco")
        if simulado.get("support") != canonical.get("support"):
            issues.append(f"{simulado.get('id', '<simulado>')}: suporte estruturado divergente do banco")
    for question_id in restored_support:
        if not by_id.get(question_id, {}).get("readingText", "").strip():
            issues.append(f"{question_id}: texto escaneado restaurado ausente")

    # The original command for "Mulheres de Atenas" only refers to the
    # expression underlined in option C.  Option B's underline is an OCR
    # decoration and must stay removed; this is a focused regression guard.
    women_q5 = by_id.get("verbos-pdf_7-q5", {})
    option_b = next((option for option in women_q5.get("options", []) if option.get("letter") == "B"), {})
    if re.search(r"<u>\s*castigadas\.?\s*</u>", option_b.get("text", ""), re.IGNORECASE):
        issues.append("verbos-pdf_7-q5: sublinhado decorativo em 'castigadas' não removido")

    # Regression guards for the two 30-question verb sheets. These are the
    # exact structures most affected by PDF style-run fragmentation.
    formatting_guards = {
        "verbos-pdf_7-q1": "<u>havia visto</u>",
        "verbos-pdf_16-q1": "______",
        "verbos-pdf_16-q9": "1 –",
        "verbos-pdf_16-q11": "**derem**",
        "verbos-pdf_16-q20": "______ não só os ouvidos",
        "verbos-pdf_17-q11": "**cresceria**",
        "verbos-pdf_17-q12": "______ o resultado",
        "verbos-pdf_17-q17": "o céu",
        "verbos-pdf_17-q24": "O verbo pertence à segunda conjugação",
        "verbos-pdf_17-q27": "______ mais aperfeiçoados",
        "classes_var-pdf_4_classes_var-q23": "<u>vitórias-régias</u>",
        "pronomes-pdf_6_pronomes-q47": "<u>onde</u>",
        "verbos-pdf_7-q50": "<u>fui germinada</u>",
    }
    for question_id, marker in formatting_guards.items():
        guarded = by_id.get(question_id, {})
        guarded_text = " ".join(
            [guarded.get("statement", ""), guarded.get("readingText", "")]
            + [option.get("text", "") for option in guarded.get("options", [])]
        )
        if marker not in guarded_text:
            issues.append(f"{question_id}: estrutura de formatação esperada ausente ({marker})")

    verb_q1 = by_id.get("verbos-pdf_7-q1", {})
    verb_q1_missing = [
        option.get("letter")
        for option in verb_q1.get("options", [])
        if not re.search(r"<u>.+?</u>|\*\*.+?\*\*", option.get("text", ""), re.DOTALL)
    ]
    if verb_q1_missing:
        issues.append(f"verbos-pdf_7-q1: alternativas sem forma verbal marcada ({verb_q1_missing})")

    if issues:
        print(f"FALHA: {len(issues)} problema(s)")
        print("\n".join(f"- {issue}" for issue in issues))
        return 1

    print(f"OK: {len(questions)} questões, 9 PDFs, gabaritos e estrutura consistentes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
