"""Inspect all PDF pages with images and cross reference with question text."""

import json
import re
from pathlib import Path
from pypdf import PdfReader
import pdfplumber

ROOT = Path(r"c:\Users\gusta\Documents\ConjuLetter")
PDF_PATH = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")

with pdfplumber.open(PDF_PATH) as pdf:
    print("=== PDF PAGES WITH IMAGES ===")
    for p_idx in range(1, 190):
        page = pdf.pages[p_idx - 1]
        imgs = page.images
        if imgs:
            text = page.extract_text() or ""
            # find question numbers on this page
            q_matches = re.findall(r"(?m)^\s*(\d{3})(?:\s*\|\s*|\.\s+)([^\n]*)", text)
            print(f"\nPage {p_idx}: {len(imgs)} image(s). Questions: {q_matches}")
            for img in imgs:
                print(f"  Img: name={img.get('name')} x0={img.get('x0'):.1f} top={img.get('top'):.1f} w={img.get('width'):.1f} h={img.get('height'):.1f}")
