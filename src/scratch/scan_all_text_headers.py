import re
from pathlib import Path
import pypdf

PDF_PATH = Path(r"c:\Users\gusta\Documents\ConjuLetter\lists\Apostila de Inglês (CN, EPCAR, EAM, EsSA, EEAR, EsPCEx, AFA, EFOMM, EN e ITA) - Atualizada.pdf")
reader = pypdf.PdfReader(str(PDF_PATH))

# Let's inspect all occurrences of "Texto para", "Textos para", "Read the text", "Read the poem", etc. in the PDF
text_header_regex = re.compile(r'(Textos?\s+para\s+(?:as?\s+)?quest[õoõ]es?\s+\d+.*|Read\s+the\s+(?:text|passage|poem|cartoon|comic).*|Instrução\s+para\s+as\s+questões.*)', re.IGNORECASE)

matches = []
for i, page in enumerate(reader.pages):
    txt = page.extract_text() or ""
    for line in txt.splitlines():
        if text_header_regex.search(line):
            matches.append((i + 1, line.strip()))

print(f"Total text header matches found: {len(matches)}")
for page_num, header in matches[:30]:
    print(f"Page {page_num}: {header}")
