import pypdf
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_dir = r"c:\Users\gusta\Documents\ConjuLetter\lists"
files = [
    "1. Fonética e Fonologia.pdf",
    "2. Acentuação.pdf",
    "3. Estrutura e Formação de Palavras.pdf",
    "4. Classes de Palavras Variaveis.pdf",
    "5. Classes de Palavras invariáveis.pdf",
    "6. Pronomes.pdf"
]

corruptions = set()
watermarks = set()

for filename in files:
    path = os.path.join(pdf_dir, filename)
    reader = pypdf.PdfReader(path)
    for p_idx, page in enumerate(reader.pages):
        text = page.extract_text()
        
        # Check for weird symbols like %, *, W in words
        for word in re.findall(r'[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]*[%*W#@$][a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+', text):
            corruptions.add(word)
            
        # Check for long numbers (watermarks)
        for num in re.findall(r'\b\d{6,}\b', text):
            watermarks.add(num)

print(f"Sample corruptions found ({len(corruptions)} total):")
print(list(corruptions)[:40])
print()
print(f"Sample watermarks found ({len(watermarks)} total):")
print(list(watermarks)[:20])
