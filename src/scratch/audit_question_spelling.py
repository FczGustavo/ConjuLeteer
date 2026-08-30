"""List potential spelling defects in the complete question bank.

Uses the pt_BR Hunspell dictionary bundled with Adobe Acrobat.  The output is
triage material, not an automatic correction list: names, quotations, foreign
words and intentional distractors must always be checked against the PDF.
"""

from __future__ import annotations

import collections
import json
import re
import sys
from pathlib import Path

from spylls.hunspell import Dictionary

ROOT = Path(__file__).resolve().parents[2]
BANK_PATH = ROOT / "src" / "data" / "questionBank.ts"
DICTIONARY_BASE = Path(
    r"C:\Program Files\Common Files\Adobe\Acrobat\DC\Linguistics\Providers\Plugins2"
    r"\AdobeHunspellPlugin\Dictionaries\pt_BR\pt_BR"
)


def load_bank() -> list[dict]:
    source = BANK_PATH.read_text(encoding="utf-8")
    declaration = source.index("export const QUESTION_BANK")
    payload = source.index(" = ", declaration) + 3
    return json.loads(source[payload:].rstrip().removesuffix(";"))


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    dictionary = Dictionary.from_files(str(DICTIONARY_BASE))
    occurrences: dict[str, list[str]] = collections.defaultdict(list)
    contexts: dict[str, list[str]] = collections.defaultdict(list)
    include_options = "--include-options" in sys.argv
    for question in load_bank():
        fields = [("apoio", question.get("readingText", "")), ("enunciado", question["statement"])]
        if include_options:
            fields.extend((f"alternativa-{option['letter']}", option["text"]) for option in question["options"])
        for field_name, field_text in fields:
          for token in re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-’'][A-Za-zÀ-ÖØ-öø-ÿ]+)*", field_text):
            candidate = token.strip("-'’").lower()
            if len(candidate) < 3 or token.isupper() or dictionary.lookup(candidate):
                continue
            if len(occurrences[candidate]) < 6:
                occurrences[candidate].append(f"{question['id']}:{field_name}")
                start = max(0, field_text.lower().find(token.lower()) - 55)
                end = min(len(field_text), field_text.lower().find(token.lower()) + len(token) + 55)
                contexts[candidate].append(" ".join(field_text[start:end].split()))

    if "--suspects" in sys.argv:
        suspects = {}
        for token, question_ids in occurrences.items():
            repairs = set()
            if "-" in token:
                for joiner in ("fi", "fl", ""):
                    candidate = token.replace("-", joiner)
                    if dictionary.lookup(candidate):
                        repairs.add(candidate)
            for prefix in ("fi", "fl", "a", "i", "o"):
                candidate = prefix + token
                if dictionary.lookup(candidate):
                    repairs.add(candidate)
            if repairs:
                suspects[token] = (question_ids, sorted(repairs))
        for token, (question_ids, repairs) in sorted(suspects.items()):
            print(f"{token}\t{','.join(repairs)}\t{','.join(question_ids)}")
            if "--contexts" in sys.argv:
                for context in dict.fromkeys(contexts[token]):
                    print(f"  > {context}")
        print(f"SUSPEITOS={len(suspects)}")
        return

    token_args = next((arg.removeprefix("--tokens=") for arg in sys.argv if arg.startswith("--tokens=")), None)
    if token_args is not None:
        for token in token_args.split(","):
            print(f"{token}\t{','.join(occurrences.get(token, []))}")
            for context in dict.fromkeys(contexts.get(token, [])):
                print(f"  > {context}")
        return

    if "--suggestions" in sys.argv:
        def edit_distance(left: str, right: str) -> int:
            row = list(range(len(right) + 1))
            for i, char_left in enumerate(left, 1):
                next_row = [i]
                for j, char_right in enumerate(right, 1):
                    next_row.append(min(next_row[-1] + 1, row[j] + 1, row[j - 1] + (char_left != char_right)))
                row = next_row
            return row[-1]

        found = 0
        for token, question_ids in sorted(occurrences.items()):
            if len(token) < 5 or "-" in token:
                continue
            suggestions = list(dictionary.suggest(token))[:8]
            close = [suggestion for suggestion in suggestions if edit_distance(token, suggestion.lower()) <= 2]
            if not close:
                continue
            found += 1
            print(f"{token}\t{','.join(close)}\t{','.join(question_ids)}")
            if "--contexts" in sys.argv:
                for context in dict.fromkeys(contexts[token]):
                    print(f"  > {context}")
        print(f"SUGESTOES_PROXIMAS={found}")
        return

    for token, question_ids in sorted(occurrences.items(), key=lambda item: (-len(item[1]), item[0])):
        print(f"{token}\t{','.join(question_ids)}")
    print(f"POTENCIAIS={len(occurrences)}")


if __name__ == "__main__":
    main()
