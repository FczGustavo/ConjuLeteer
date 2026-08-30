"""Complete per-option pedagogical markings from PDF vector underlines."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
BANK = ROOT / "src" / "data" / "questionBank.ts"
UNDERLINES = ROOT / "tmp" / "question-underlines.json"
REFERENCE = re.compile(r"(?:destacad|sublinh|grifad|negrito)", re.I)
CHOICE = re.compile(r"(?:alternativa|alternativas|opção|opções)", re.I)


def load_bank() -> tuple[str, list[dict]]:
    source = BANK.read_text(encoding="utf-8")
    declaration = source.index("export const QUESTION_BANK")
    payload = source.index(" = ", declaration) + 3
    return source[:payload], json.loads(source[payload:].rstrip().removesuffix(";"))


def marked(text: str) -> bool:
    return "**" in text or "<u>" in text


def main() -> None:
    prefix, questions = load_bank()
    rows = json.loads(UNDERLINES.read_text(encoding="utf-8"))
    by_key: dict[tuple[str, int], list[dict]] = {}
    for row in rows:
        by_key.setdefault((row["listId"], row["questionNumber"]), []).append(row)

    changed = 0
    unresolved: list[str] = []
    for question in questions:
        statement = question.get("statement", "")
        if not (REFERENCE.search(statement) and CHOICE.search(statement)):
            continue
        options = question.get("options", [])
        if not any(marked(option.get("text", "")) for option in options):
            continue
        for option in options:
            text = option.get("text", "")
            if marked(text):
                continue
            candidates = []
            for row in by_key.get((question["listId"], question["questionNumber"]), []):
                phrase = row["phrase"].strip()
                if phrase and phrase in text and not re.fullmatch(r"[\d\W_]+", phrase):
                    candidates.append(phrase)
            candidates = sorted(set(candidates), key=len, reverse=True)
            # Prefer the longest source underline and avoid nesting overlaps.
            selected: list[str] = []
            for phrase in candidates:
                if not any(phrase in existing or existing in phrase for existing in selected):
                    selected.append(phrase)
            for phrase in sorted(selected, key=len, reverse=True):
                text = text.replace(phrase, f"<u>{phrase}</u>", 1)
            if selected:
                option["text"] = text
                changed += 1
            else:
                unresolved.append(f"{question['id']}:{option['letter']}")

    BANK.write_text(prefix + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(f"marked_options={changed}")
    print(f"unresolved={len(unresolved)}")
    for item in unresolved:
        print(item)


if __name__ == "__main__":
    main()
