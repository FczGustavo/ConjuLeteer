"""Extract underlined phrases and associate them with source questions.

The Gran PDFs encode underlining as horizontal vector lines, not as text
metadata.  ``pdfplumber`` exposes both word boxes and those line objects, so a
geometric intersection recovers the exact phrase without guessing from the
question wording.
"""

from __future__ import annotations

import bisect
import json
import re
import sys
from pathlib import Path

import pdfplumber


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "tmp" / "question-underlines.json"
PDF_CONFIGS = [
    ("pdf_1_fonetica", "1. Fonética e Fonologia.pdf", False),
    ("pdf_2_acentuacao", "2. Acentuação.pdf", False),
    ("pdf_3_formacao", "3. Estrutura e Formação de Palavras.pdf", False),
    ("pdf_4_classes_var", "4. Classes de Palavras Variaveis.pdf", False),
    ("pdf_5_classes_invar", "5. Classes de Palavras invariáveis.pdf", False),
    ("pdf_6_pronomes", "6. Pronomes.pdf", False),
    ("pdf_7", "7. Verbos.pdf", False),
    ("pdf_16", "16. Modos Verbais I  - [✅].pdf", True),
    ("pdf_17", "17.  Modos Verbais II  - [✅].pdf", True),
]


def find_headers(words: list[dict], compact: bool) -> list[tuple[float, int]]:
    headers: list[tuple[float, int]] = []
    if compact:
        expected = 1
        for word in words:
            match = re.fullmatch(r"(\d{1,2})\)", word["text"])
            if match and int(match.group(1)) == expected:
                headers.append((word["doctop"], expected))
                expected += 1
        return headers

    for index, word in enumerate(words[:-1]):
        if word["text"].casefold() != "questão":
            continue
        number_word = words[index + 1]
        if abs(number_word["top"] - word["top"]) > 3:
            continue
        match = re.fullmatch(r"(\d{1,3})", number_word["text"])
        if match:
            headers.append((word["doctop"], int(match.group(1))))
    return headers


def phrase_for_line(line: dict, words: list[dict]) -> tuple[str, str, str, int]:
    if line.get("width", 0) < 2 or line.get("width", 0) > 300:
        return "", "", "", 0
    if abs(line.get("top", 0) - line.get("bottom", 0)) > 1:
        return "", "", "", 0

    selected = []
    same_line = []
    for word in words:
        if abs(word["bottom"] - line["top"]) > 3.5:
            continue
        same_line.append(word)
        overlap = min(word["x1"], line["x1"] + 1) - max(word["x0"], line["x0"] - 1)
        if overlap <= 0:
            continue
        if overlap / max(word["width"], 0.01) >= 0.35:
            selected.append(word)
    selected.sort(key=lambda word: word["x0"])
    same_line.sort(key=lambda word: word["x0"])
    phrase = " ".join(word["text"] for word in selected).strip()
    context = " ".join(word["text"] for word in same_line).strip()
    first_selected = same_line.index(selected[0]) if selected else 0
    prefix = " ".join(word["text"] for word in same_line[:first_selected])
    occurrence = len(re.findall(re.escape(phrase), prefix)) if phrase else 0
    option_match = re.match(r"^([A-Ea-e])\)?\s+", context)
    option_letter = option_match.group(1).upper() if option_match else ""
    return phrase, context, option_letter, occurrence


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    output: list[dict] = []
    for list_id, filename, compact in PDF_CONFIGS:
        path = ROOT / "lists" / filename
        with pdfplumber.open(path) as pdf:
            page_words = [page.extract_words(use_text_flow=False) for page in pdf.pages]
            words = [word for group in page_words for word in group]
            headers = find_headers(words, compact)
            header_positions = [position for position, _ in headers]
            found: set[tuple[int, int, float, str]] = set()

            for page_index, page in enumerate(pdf.pages):
                for line in page.lines:
                    phrase, context, option_letter, occurrence = phrase_for_line(line, page_words[page_index])
                    if not phrase:
                        continue
                    header_index = bisect.bisect_right(header_positions, line["doctop"]) - 1
                    if header_index < 0:
                        continue
                    question_number = headers[header_index][1]
                    key = (question_number, page_index + 1, round(line["top"], 2), phrase)
                    if key in found:
                        continue
                    found.add(key)
                    output.append({
                        "listId": list_id,
                        "questionNumber": question_number,
                        "phrase": phrase,
                        "context": context,
                        "optionLetter": option_letter,
                        "occurrence": occurrence,
                        "page": page_index + 1,
                    })
        print(f"{list_id}: {len(found)} underlined phrase(s)")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"total={len(output)} output={OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
