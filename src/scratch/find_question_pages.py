"""Print source PDF pages for selected question numbers."""

from __future__ import annotations

import re
from pathlib import Path

import pdfplumber


ROOT = Path(__file__).resolve().parents[2]
CASES = [
    ("2. Acentuação.pdf", {60, 61, 63, 64}),
    ("3. Estrutura e Formação de Palavras.pdf", {84, 85}),
    ("4. Classes de Palavras Variaveis.pdf", {23, 24, 37, 38, 53, 54}),
    ("6. Pronomes.pdf", {47, 48, 54, 55}),
    ("7. Verbos.pdf", {50, 51, 61, 62}),
]


for filename, wanted in CASES:
    found: dict[int, int] = {}
    with pdfplumber.open(ROOT / "lists" / filename) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            for number in wanted - found.keys():
                if re.search(rf"Questão\s+{number}\b", text, re.IGNORECASE):
                    found[number] = page_number
            if found.keys() >= wanted:
                break
    print(filename, dict(sorted(found.items())))
