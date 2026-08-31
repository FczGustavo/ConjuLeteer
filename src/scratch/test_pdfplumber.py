import pdfplumber
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"c:\Users\gusta\Documents\ConjuLetter\lists\1. Fonética e Fonologia.pdf"

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    
    # Search for page with "Sobre a importância da ciência" (Q46)
    for p_idx, page in enumerate(pdf.pages):
        text = page.extract_text(layout=False) or ""
        if "Sobre a importância da ciência" in text or "paradoxal que, no início" in text:
            print(f"\n=== Found on Page {p_idx+1} ===")
            print("--- Standard extract_text ---")
            print(text[:600])
            
            print("\n--- Layout extract_text ---")
            layout_text = page.extract_text(layout=True) or ""
            print(layout_text[:600])
            break
