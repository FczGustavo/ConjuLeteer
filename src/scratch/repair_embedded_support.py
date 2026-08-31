"""Move long source excerpts accidentally stored in ``statement`` to support.

The first bank build kept a handful of PDF blocks in the command field when the
PDF had no blank line before the final instruction.  This repair is deliberately
conservative: it only considers questions without an existing support field,
requires a long block, and accepts a split only when the parser finds a clear
command boundary.  Answer letters and option content are never changed.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "src" / "scratch"))

from parse_helpers import smart_split_reading_statement  # noqa: E402
from text_purifier import deep_clean_portuguese  # noqa: E402

BANK_PATH = ROOT / "src" / "data" / "questionBank.ts"

# These three items cite a text from an earlier exercise but do not reproduce
# it in their own PDF block.  Keeping the citation in the command avoids a
# misleading empty support box; the missing source is reported by the source
# audit instead of being invented here.
NO_EMBEDDED_SUPPORT = {
    "classes_var-pdf_4_classes_var-q58",
    "classes_invar-pdf_5_classes_invar-q23",
    "pronomes-pdf_6_pronomes-q51",
}


def load_questions() -> tuple[str, list[dict]]:
    source = BANK_PATH.read_text(encoding="utf-8")
    start = source.index("export const QUESTION_BANK")
    payload = source.index(" = ", start) + 3
    return source[:payload], json.loads(source[payload:].rstrip().removesuffix(";"))


def main() -> int:
    prefix, questions = load_questions()
    changed: list[str] = []
    for question in questions:
        if question["id"] in NO_EMBEDDED_SUPPORT:
            if question.get("readingText", "").strip():
                question["statement"] = (
                    question["readingText"].strip()
                    + "\n\n"
                    + question.get("statement", "").strip()
                ).strip()
                question["readingText"] = ""
                changed.append(question["id"] + " (citation-only block restored to command)")
            continue
        if question.get("readingText", "").strip():
            continue
        statement = question.get("statement", "")
        if len(statement) < 500:
            continue

        reading, command = smart_split_reading_statement(statement)
        # A support excerpt must be substantial; this avoids turning a long
        # multi-line command into a fake reading box.
        if not reading or len(reading.strip()) < 240 or len(command.strip()) > 520:
            continue

        question["readingText"] = deep_clean_portuguese(reading).strip()
        question["statement"] = deep_clean_portuguese(command).strip()
        changed.append(question["id"])

    BANK_PATH.write_text(
        prefix + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"Reparadas {len(changed)} questões com texto de apoio embutido.")
    for question_id in changed:
        print(f"- {question_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
