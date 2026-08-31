"""Apply uniquely located underline spans extracted from the official PDFs.

The extractor retains a short context for every vector line. This pass uses
that context (with a whitespace-preserving index map) to restore marks that
could not be transferred by a literal substring match.
"""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
BANK_PATH = ROOT / "src" / "data" / "questionBank.ts"
ROWS_PATH = ROOT / "tmp" / "question-underlines.json"


def fields(question: dict):
    yield "statement", question.get("statement", "")
    yield from ((f"option:{o['letter']}", o.get("text", "")) for o in question.get("options", []))
    yield "readingText", question.get("readingText", "")


def set_field(question: dict, field: str, value: str) -> None:
    if field == "statement":
        question[field] = value
    elif field == "readingText":
        question[field] = value
    else:
        letter = field.split(":", 1)[1]
        for option in question.get("options", []):
            if option.get("letter") == letter:
                option["text"] = value
                return


def plain_map(marked: str) -> tuple[str, list[int]]:
    plain: list[str] = []
    positions: list[int] = []
    i = 0
    while i < len(marked):
        token = next((t for t in ("<u>", "</u>", "**") if marked.startswith(t, i)), None)
        if token:
            i += len(token)
            continue
        ch = marked[i]
        if ch.isspace():
            if plain and not plain[-1].isspace():
                plain.append(" ")
                positions.append(i)
        else:
            plain.append(ch)
            positions.append(i)
        i += 1
    return "".join(plain), positions


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"</?u>|\*\*", "", value)).strip().casefold()


def apply_at(marked: str, phrase: str, context: str, occurrence: int) -> tuple[str, bool]:
    plain, positions = plain_map(marked)
    plain_fold = plain.casefold()
    context_clean = clean(re.sub(r"^[A-Ea-e]\)?\s+", "", context))
    phrase_clean = clean(phrase)
    if not context_clean or not phrase_clean:
        return marked, False
    start = plain_fold.find(context_clean)
    if start < 0:
        return marked, False
    rels = [m.start() for m in re.finditer(re.escape(phrase_clean), context_clean)]
    if occurrence >= len(rels):
        return marked, False
    target = start + rels[occurrence]
    if target >= len(positions) or target + len(phrase_clean) > len(positions):
        return marked, False
    original_start = positions[target]
    original_end = positions[target + len(phrase_clean) - 1] + 1
    # Do not nest a new span inside an existing one.
    before = marked[:original_start]
    if before.rfind("<u>") > before.rfind("</u>"):
        return marked, True
    return marked[:original_start] + "<u>" + marked[original_start:original_end] + "</u>" + marked[original_end:], True


def main() -> None:
    source = BANK_PATH.read_text(encoding="utf-8")
    marker = "export const QUESTION_BANK"
    start = source.index(" = ", source.index(marker)) + 3
    prefix, payload = source[:start], source[start:]
    data = json.loads(payload.rstrip().removesuffix(";"))
    by_key = {(q.get("listId"), q.get("questionNumber")): q for q in data}
    rows = json.loads(ROWS_PATH.read_text(encoding="utf-8"))
    applied = skipped = ambiguous = 0
    for row in rows:
        phrase = str(row.get("phrase", "")).strip()
        if not phrase or any(ch in phrase for ch in "�¢€†"):
            continue
        q = by_key.get((row.get("listId"), row.get("questionNumber")))
        if not q:
            skipped += 1
            continue
        option = str(row.get("optionLetter", "")).strip().upper()
        candidates = [f for f, value in fields(q) if phrase.casefold() in clean(value)]
        context = row.get("context", "")
        context_clean = clean(re.sub(r"^[A-Ea-e]\)?\s+", "", context))
        contextual = [f for f, value in fields(q) if context_clean and context_clean in clean(value)]
        if option and f"option:{option}" in candidates:
            candidates = [f"option:{option}"]
        elif len(contextual) == 1:
            candidates = contextual
        elif len(candidates) != 1:
            ambiguous += 1
            continue
        field = candidates[0]
        updated, ok = apply_at(dict(fields(q))[field], phrase, context, int(row.get("occurrence", 0)))
        if ok and updated != dict(fields(q))[field]:
            set_field(q, field, updated)
            applied += 1
        else:
            skipped += 1
    BANK_PATH.write_text(prefix + json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"vector marks applied={applied} skipped={skipped} ambiguous={ambiguous}")


if __name__ == "__main__":
    main()
