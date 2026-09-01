"""Generate one auditable review sheet for every native question.

The report is deliberately data-only: it links the canonical record to its
source PDF/pages, official answer, stored answer and quality result.  This
makes a future import/review diffable without relying on a visual snapshot.
"""

from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[2]
BANK_PATH = ROOT / "src" / "data" / "questionBank.ts"
REPORT_DIR = ROOT / "reports"

PDFS = {
    "pdf_1_fonetica": ("1. Fonética e Fonologia.pdf", "Respostas"),
    "pdf_2_acentuacao": ("2. Acentuação.pdf", "Respostas"),
    "pdf_3_formacao": ("3. Estrutura e Formação de Palavras.pdf", "Respostas"),
    "pdf_4_classes_var": ("4. Classes de Palavras Variaveis.pdf", "Respostas"),
    "pdf_5_classes_invar": ("5. Classes de Palavras invariáveis.pdf", "Respostas"),
    "pdf_6_pronomes": ("6. Pronomes.pdf", "Respostas"),
    "pdf_7": ("7. Verbos.pdf", "Respostas"),
}


def load_bank() -> list[dict]:
    source = BANK_PATH.read_text(encoding="utf-8")
    marker = source.index("export const QUESTION_BANK")
    payload = source.index(" = ", marker) + 3
    return json.loads(source[payload:].rstrip().removesuffix(";"))


def extract_answers(text: str, marker: str) -> dict[int, str]:
    start = text.upper().rfind(marker.upper())
    if start < 0:
        raise ValueError(f"Bloco {marker!r} ausente")
    return {
        int(number): letter
        for number, letter in re.findall(r"(\d{1,3})\s*[\).\-]?\s*([A-E])\b", text[start:])
    }


def source_maps() -> dict[str, tuple[str, dict[int, int], int | None, dict[int, str]]]:
    result = {}
    for list_id, (filename, marker) in PDFS.items():
        pages = [page.extract_text() or "" for page in PdfReader(ROOT / "lists" / filename).pages]
        question_pages: dict[int, int] = {}
        for number in range(1, 200):
            for page_number, text in enumerate(pages, 1):
                if re.search(rf"(?i)(?:quest(?:ão|ao)\s+{number}\b|^\s*{number}\s*[.)-]\s+)", text, re.M):
                    question_pages[number] = page_number
                    break
        answer_page = next(
            (page_number for page_number, text in enumerate(pages, 1) if re.search(r"(?:RESPOSTAS|GABARITO|GABARITOS)", text, re.I)),
            None,
        )
        result[list_id] = (filename, question_pages, answer_page, extract_answers("\n".join(pages), marker))
    return result


def main() -> None:
    questions = load_bank()
    maps = source_maps()
    rows = []
    for question in questions:
        filename, question_pages, answer_page, answers = maps[question["listId"]]
        number = int(question["questionNumber"])
        provenance = question.get("provenance") or {}
        quality = question.get("quality") or {"status": "warning", "warnings": ["Qualidade ausente"]}
        rows.append(
            {
                "id": question["id"],
                "subjectId": question["subjectId"],
                "listId": question["listId"],
                "questionNumber": number,
                "pdf": provenance.get("pdf", filename),
                "questionPage": provenance.get("questionPage", question_pages.get(number)),
                "answerPage": provenance.get("answerPage", answer_page),
                "officialCorrectLetter": answers.get(number),
                "storedCorrectLetter": question.get("correctLetter"),
                "quality": quality,
                "supportFields": [field for field in ("label", "title", "author", "paragraphs", "source") if isinstance(question.get("support"), dict) and question["support"].get(field)],
                "emphasisNotes": question.get("emphasisNotes", []),
            }
        )

    report = {
        "generatedAt": date.today().isoformat(),
        "questionCount": len(rows),
        "pdfCount": len(PDFS),
        "verifiedCount": sum(row["quality"].get("status") == "verified" for row in rows),
        "warningCount": sum(row["quality"].get("status") == "warning" for row in rows),
        "gabaritoDivergences": [row["id"] for row in rows if row["officialCorrectLetter"] != row["storedCorrectLetter"]],
        "questions": rows,
    }
    REPORT_DIR.mkdir(exist_ok=True)
    (REPORT_DIR / "question-audit.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with (REPORT_DIR / "question-audit.md").open("w", encoding="utf-8") as handle:
        handle.write("# Fichas de auditoria das questões\n\n")
        handle.write(f"Gerado em {report['generatedAt']}. **{len(rows)} questões**, **{len(PDFS)} PDFs**, "
                     f"**{report['verifiedCount']} verificadas**, **{report['warningCount']} com aviso**.\n\n")
        handle.write("| ID | PDF | Pág. questão | Pág. gabarito | Oficial | Banco | Estado |\n")
        handle.write("|---|---|---:|---:|:---:|:---:|---|\n")
        for row in rows:
            handle.write(
                f"| `{row['id']}` | `{row['pdf']}` | {row['questionPage'] or '—'} | {row['answerPage'] or '—'} | "
                f"{row['officialCorrectLetter'] or '—'} | {row['storedCorrectLetter'] or '—'} | {row['quality'].get('status', 'warning')} |\n"
            )
    print(f"generated {len(rows)} question audit sheets in reports/")
    print(f"verified={report['verifiedCount']} warnings={report['warningCount']} divergences={len(report['gabaritoDivergences'])}")


if __name__ == "__main__":
    main()
