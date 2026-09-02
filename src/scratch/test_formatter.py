import sys
import re
from pathlib import Path
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

# Let's test the support cleaner and paragraph builder
OCR_TYPOS = [
    (r"\bHelpinq\b", "Helping"),
    (r"\bpeopie\b", "people"),
    (r"\bhospitais\b", "hospitals"),
    (r"\borthey\b", "or they"),
    (r"\bAcoording\b", "According"),
    (r"\bNous:\s*Genders\b", "Nouns: Genders"),
    (r"€€€", ""),
    (r"\bTsnunami\b", "Tsunami"),
]

def clean_ocr(text: str) -> str:
    for pattern, replacement in OCR_TYPOS:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    return text

def format_statement_items(statement: str) -> str:
    """Format statements containing sequences of items like ( ) or Roman numerals with clean line breaks."""
    # Format ( ) ... ( ) ...
    # Look for ( ) or (  ) or [ ] not at the start of a line
    # If there are 2 or more ( ) in the text:
    matches = list(re.finditer(r"\(\s*\)", statement))
    if len(matches) >= 2:
        # Check if they are already on separate lines
        parts = []
        last_end = 0
        first_match = matches[0]
        lead_in = statement[:first_match.start()].rstrip()
        
        # We split on ( )
        item_positions = [m.start() for m in matches] + [len(statement)]
        items = []
        for i in range(len(matches)):
            start = item_positions[i]
            end = item_positions[i+1]
            item_text = statement[start:end].strip()
            items.append(item_text)
        
        formatted = lead_in + "\n\n" + "\n".join(items) if lead_in else "\n".join(items)
        return formatted.strip()
    
    # Format Roman numerals I - ... II - ... or I. ... II. ...
    roman_matches = list(re.finditer(r"(?:^|\s+)([IVX]+)\s*[-–—.]\s*", statement))
    if len(roman_matches) >= 2 and roman_matches[0].group(1) == "I":
        # Split into lead in and items
        lead_in = statement[:roman_matches[0].start()].rstrip()
        items = []
        item_positions = [m.start() for m in roman_matches] + [len(statement)]
        for i in range(len(roman_matches)):
            start = item_positions[i]
            end = item_positions[i+1]
            item_text = statement[start:end].strip()
            items.append(item_text)
        formatted = lead_in + "\n\n" + "\n".join(items) if lead_in else "\n".join(items)
        return formatted.strip()

    return statement

# Test statement formatting
test_stmt = "Read the statements below to check if they are true (T) or false (F), and choose the option that respectively represents the statements. () Some volunteers work with preservation. () Mike Coleman often works in a hospital. () Mike is happy because the work is hard. () It's a personal experience, in Mike's opinion."
print("=== Original Statement ===")
print(test_stmt)
print("\n=== Formatted Statement ===")
print(format_statement_items(test_stmt))
