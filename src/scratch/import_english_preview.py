"""Build the isolated Inglês Preview corpus from the 2,270-question apostila.

This importer is intentionally deterministic. It uses the PDF's printed table
of contents and answer-key pages as the source of truth for section boundaries,
then applies the audited text/support parser used by the existing English bank.
It never asks a model to invent an answer or metadata. Ambiguous records are
kept in the manifest and marked ``quarantined`` instead of being published.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import re
from collections import defaultdict
from pathlib import Path
from typing import Any

import pdfplumber
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[2]
LISTS_PDF = ROOT / "lists" / "Apostila de Inglês (CN, EPCAR, EAM, EsSA, EEAR, EsPCEx, AFA, EFOMM, EN e ITA) - Atualizada.pdf"
DOWNLOADS_PDF = Path(r"C:\Users\gusta\Downloads\Apostila de Inglês (CN, EPCAR, EAM, EsSA, EEAR, EsPCEx, AFA, EFOMM, EN e ITA) - Atualizada.pdf")
DEFAULT_PDF = LISTS_PDF if LISTS_PDF.exists() else DOWNLOADS_PDF
OUT_DATA = ROOT / "src" / "data" / "englishPreviewQuestionBank.ts"
OUT_DATA_DIR = ROOT / "src" / "data" / "englishPreview"
OUT_MANIFEST = ROOT / "src" / "data" / "englishPreviewManifest.ts"
OUT_REPORT = ROOT / "reports" / "english-preview-audit.json"
OUT_REPORT_MD = ROOT / "reports" / "english-preview-audit.md"


# PDF pages are 1-based and match the printed page numbers after the cover.
# ``answer_pages`` deliberately includes continuation pages without a repeated
# "Gabarito" heading (92, 205 and 301).
GROUPS: list[dict[str, Any]] = [
    {"id": "preview_reading", "title": "Interpretação e Vocabulário — Colégio Naval", "short": "Interpretação: Colégio Naval", "start": 12, "end": 21, "count": 48, "answers": [22], "kind": "reading"},
    {"id": "preview_reading_epcar", "title": "Interpretação e Vocabulário — EPCAR", "short": "Interpretação: EPCAR", "start": 23, "end": 34, "count": 84, "answers": [35], "kind": "reading"},
    {"id": "preview_reading_eam", "title": "Interpretação e Vocabulário — EAM", "short": "Interpretação: EAM", "start": 36, "end": 38, "count": 10, "answers": [39], "kind": "reading"},
    {"id": "preview_reading_essa", "title": "Interpretação e Vocabulário — EsSA", "short": "Interpretação: EsSA", "start": 40, "end": 41, "count": 9, "answers": [42], "kind": "reading"},
    {"id": "preview_reading_eear", "title": "Interpretação e Vocabulário — EEAr", "short": "Interpretação: EEAr", "start": 43, "end": 60, "count": 120, "answers": [61], "kind": "reading"},
    {"id": "preview_reading_eear_bct", "title": "Interpretação e Vocabulário — EEAr BCT", "short": "Interpretação: EEAr BCT", "start": 62, "end": 90, "count": 183, "answers": [91, 92], "kind": "reading"},
    {"id": "preview_reading_espcex", "title": "Interpretação e Vocabulário — EsPCEx", "short": "Interpretação: EsPCEx", "start": 93, "end": 113, "count": 107, "answers": [114], "kind": "reading"},
    {"id": "preview_reading_afa", "title": "Interpretação e Vocabulário — AFA", "short": "Interpretação: AFA", "start": 115, "end": 134, "count": 120, "answers": [135], "kind": "reading"},
    {"id": "preview_reading_efomm", "title": "Interpretação e Vocabulário — EFOMM", "short": "Interpretação: EFOMM", "start": 136, "end": 151, "count": 74, "answers": [152], "kind": "reading"},
    {"id": "preview_reading_en", "title": "Interpretação e Vocabulário — Escola Naval", "short": "Interpretação: Escola Naval", "start": 153, "end": 173, "count": 77, "answers": [174], "kind": "reading"},
    {"id": "preview_reading_ita", "title": "Interpretação e Vocabulário — ITA", "short": "Interpretação: ITA", "start": 175, "end": 203, "count": 135, "answers": [204, 205], "kind": "reading"},
    {"id": "preview_articles", "title": "Articles", "short": "Articles", "start": 206, "end": 209, "count": 32, "answers": [210]},
    {"id": "preview_nouns_countable", "title": "Nouns: Countable x Uncountable", "short": "Nouns: Countable x Uncountable", "start": 211, "end": 212, "count": 31, "answers": [213]},
    {"id": "preview_nouns_plural", "title": "Nouns: Plural", "short": "Nouns: Plural", "start": 214, "end": 216, "count": 31, "answers": [217]},
    {"id": "preview_nouns_gender", "title": "Nouns: Gender", "short": "Nouns: Gender", "start": 218, "end": 219, "count": 30, "answers": [220]},
    {"id": "preview_adjectives", "title": "Adjectives", "short": "Adjectives", "start": 221, "end": 227, "count": 67, "answers": [228]},
    {"id": "preview_adverbs", "title": "Adverbs", "short": "Adverbs", "start": 229, "end": 232, "count": 34, "answers": [233]},
    {"id": "preview_pronouns_personal", "title": "Pronouns: Subject x Object", "short": "Pronouns: Subject x Object", "start": 234, "end": 240, "count": 33, "answers": [241]},
    {"id": "preview_pronouns_possessive", "title": "Pronouns: Possessives", "short": "Pronouns: Possessives", "start": 242, "end": 250, "count": 33, "answers": [251]},
    {"id": "preview_pronouns_reflexive", "title": "Pronouns: Reflexive", "short": "Pronouns: Reflexive", "start": 252, "end": 255, "count": 32, "answers": [256]},
    {"id": "preview_pronouns_relative", "title": "Pronouns: Relative", "short": "Pronouns: Relative", "start": 257, "end": 263, "count": 35, "answers": [264]},
    {"id": "preview_pronouns_demonstrative", "title": "Pronouns: Demonstrative", "short": "Pronouns: Demonstrative", "start": 265, "end": 272, "count": 32, "answers": [273]},
    {"id": "preview_pronouns_indefinite", "title": "Pronouns: Indefinite", "short": "Pronouns: Indefinite", "start": 274, "end": 277, "count": 31, "answers": [278]},
    {"id": "preview_verbs", "title": "Verbs and Verb Tenses", "short": "Verbs & Verb Tenses", "start": 279, "end": 299, "count": 191, "answers": [300, 301]},
    {"id": "preview_numbers", "title": "Numbers", "short": "Numbers", "start": 302, "end": 303, "count": 30, "answers": [304]},
    {"id": "preview_conjunctions", "title": "Conjunctions", "short": "Conjunctions", "start": 305, "end": 312, "count": 68, "answers": [313]},
    {"id": "preview_prepositions", "title": "Prepositions", "short": "Prepositions", "start": 314, "end": 320, "count": 55, "answers": [321]},
    {"id": "preview_modal_verbs", "title": "Modal Verbs", "short": "Modal Verbs", "start": 322, "end": 326, "count": 56, "answers": [327]},
    {"id": "preview_phrasal_verbs", "title": "Phrasal Verbs", "short": "Phrasal Verbs", "start": 328, "end": 335, "count": 57, "answers": [336]},
    {"id": "preview_passive_active", "title": "Passive Voice and Active Voice", "short": "Passive & Active Voice", "start": 337, "end": 340, "count": 35, "answers": [341]},
    {"id": "preview_wh_questions", "title": "Wh-Questions e Interrogative Pronouns", "short": "Wh-Questions", "start": 342, "end": 344, "count": 30, "answers": [345]},
    {"id": "preview_question_tags", "title": "Question Tag e Tag Answers", "short": "Question Tags", "start": 346, "end": 348, "count": 32, "answers": [349]},
    {"id": "preview_reported_speech", "title": "Reported Speech", "short": "Reported Speech", "start": 350, "end": 352, "count": 33, "answers": [353]},
    {"id": "preview_so_too", "title": "so / too / either / neither / nor", "short": "So / Too / Either", "start": 354, "end": 355, "count": 31, "answers": [356]},
    {"id": "preview_if_clauses", "title": "If Clauses", "short": "If Clauses", "start": 357, "end": 360, "count": 37, "answers": [361]},
    {"id": "preview_determiners", "title": "Determiners", "short": "Determiners", "start": 362, "end": 363, "count": 30, "answers": [364]},
    {"id": "preview_quantifiers", "title": "Quantifiers", "short": "Quantifiers", "start": 365, "end": 367, "count": 35, "answers": [368]},
    {"id": "preview_infinitive_gerund", "title": "Infinitive x Gerund", "short": "Infinitive x Gerund", "start": 369, "end": 373, "count": 37, "answers": [374]},
    {"id": "preview_genitive", "title": "Genitive Case", "short": "Genitive Case", "start": 375, "end": 377, "count": 31, "answers": [378]},
    {"id": "preview_grammar_classes", "title": "Classes Gramaticais", "short": "Classes Gramaticais", "start": 379, "end": 392, "count": 94, "answers": [393]},
]

# Totals printed in the source PDF's editorial table (page 10).
EDITORIAL_TOTALS = {
    "questions": 2270,
    "readingVocabulary": 967,
    "grammar": 1303,
    "subjects": 30,
    "exams": 112,
}

# Credits that identify material authored or copied by a private compiler are
# never published.  The PDF text layer occasionally replaces accented glyphs
# with ``�``; the final alternative keeps that form covered as well.
AUTHORIAL_BOARD_RE = re.compile(
    r"(?:\bJFS\b|j(?:e|ef)f?erson\s+celestino|\bjerfeson\b|"
    r"(?:mateus\s+)?germano|cola\s+da\s+web|"
    r"quest[^\s]{0,3}\s+in[^\s]{0,3}dita|\bautoral\b)",
    re.I,
)

REDUNDANT_SUPPORT_RE = re.compile(
    r"^\s*(?:now\s+read\s+(?:the\s+)?questions?|texto\s+para(?:s)?\s+(?:a|as|duas|tr[êe]s|quatro)?\s*"
    r"quest[^\n]{0,80}(?:seguintes)?|instru[cç][oõ]es?\s+para\s+"
    r"quest[^\n]{0,80}|(?:read|leia|observe)(?:\s+(?:the|o|a|os|as|following|"
    r"this|seguinte))?(?:\s+(?:text|texto|passage|trecho|fragment|excerto|"
    r"questions?|quest[õo]es?))?\s*)[:.]?\s*$",
    re.I,
)

REDUNDANT_SUPPORT_PREFIX_RE = re.compile(
    r"^\s*(?:now\s+read\s+(?:the\s+)?questions?\s*[:.]?\s*|"
    r"texto\s+para(?:s)?\s+(?:a|as|duas|tr[êe]s|quatro)?\s*"
    r"quest[^\n]{0,100}(?:seguintes)?|instru[cç][oõ]es?\s+para\s+"
    r"quest[^\n]{0,100})\s*(?:\([^)]*\))?\s*",
    re.I,
)

QUESTION_RE = re.compile(r"(?m)^\s*(\d{1,3})\s*\)\s*")
ANSWER_RE = re.compile(r"(?<!\d)(\d{1,3})\s*\)\s*([A-E])\b")
BOARD_YEAR_RE = re.compile(r"^(?P<board>.*?)(?P<year>(?:19|20)\d{2}|\d{2})\s*$", re.I)
ADAPTED_RE = re.compile(r"(?:\s*[–—-]\s*|\s+)ADAPT(?:ED|ADA)\s*$", re.I)

OCR_TYPOS = [
    (r"\bHelpinq\b", "Helping"),
    (r"\bpeopie\b", "people"),
    (r"\bhospitais\b", "hospitals"),
    (r"\borthey\b", "or they"),
    (r"\bAcoording\b", "According"),
    (r"\bNous:\s*Genders\b", "Nouns: Genders"),
    (r"€€€100", "100"),
    (r"€€€", ""),
    (r"\bTsnunami\b", "Tsunami"),
    (r"\bBrazii\b", "Brazil"),
    # A malformed opening quote in the source text layer is rendered as a
    # closing curly apostrophe; restore the editorial headline punctuation.
    (r"\bmedia\s+’destroying\b", "media 'destroying"),
]

HEADER_PATTERNS = [
    r"^\s*Interpreta[çc][ãa]o(?:\s+de\s+Texto)?\s+e\s+Vocabul[áa]rio(?:\s*[-–—]\s*.*)?$",
    r"^\s*(?:Col[ée]gio\s+Naval|EPCAR|EAM|EsSA|EEAr|EEAr\s+BCT|EsPCEx|AFA|EFOMM|Escola\s+Naval|ITA)\s*$",
    r"^\s*Textos?\s+para\s+(?:a|as)?\s*quest(?:[õo]es|[ãa]o|oes)?\s*\d+.*$",
    r"^\s*Instru[çc][õo]es?\s+para\s+(?:a|as)?\s*quest(?:[õo]es|[ãa]o)?\s*\d+.*$",
    r"^\s*Read\s+the\s+(?:following\s+)?(?:text|passage|poem|comic\s+strip|cartoon)(?:\s+below|\s+that\s+follows)?.*$",
    r"^\s*Leia\s+o\s+texto(?:\s+abaixo)?.*$",
]

SOURCE_RE = re.compile(
    r"(?:^\s*\(?(?:(?:Source|Fonte)\s*:|Adapted\s+from|Fragment\s+taken\s+from|Dispon[íi]vel|Available|http|www\.)|The\s+Economist|The\s+Actuary|BBC|Reuters|\b(?:19|20)\d{2}\b\s*\)?$)",
    re.I,
)

LABEL_RE = re.compile(r"^\s*(EXTRACT\s+\d+|TEXTO?\s+[IVX\d]+|PART\s+[IVX\d]+)\s*$", re.I)
EXTRACT_MARKER_RE = re.compile(r"^\s*\[\s*(?:EXTRACT|TEXTO?|PART)\s+\d+\s*\]\s*", re.I)
# A handful of pages in the source PDF contain a text-layer/footer artifact
# (``put 51``) immediately after the last option.  It is not learner content
# and must not become a shared support passage for the following questions.
PAGE_ARTIFACT_RE = re.compile(r"^\s*(?:put(?:\s+\d{1,3})?|\d{1,3})\s*$", re.I)
# Roman-numeral/letter/number prefixes are statement or option markers, never
# a learner-facing heading.  Keeping this check separate from the generic
# title heuristic prevents a list such as ``I- ... II- ...`` from becoming a
# faux support title when a shared passage is parsed.
SUPPORT_LIST_ITEM_RE = re.compile(r"^\s*(?:[IVXLCDM]+|[A-E]|\d{1,3})\s*[-–—.)]\s+", re.I)

RANGE_HEADER_RE = re.compile(
    r"Textos?\s+para\s+(?:a|as)?\s*quest(?:[õo]es|[ãa]o|oes)?\s*(\d+)(?:\s*(?:[–—e -]+)\s*(\d+))?",
    re.I,
)

PANAMA_HEADLINE_RE = re.compile(
    r"^The seven-decade journey to an expanded Panama Canal is coming to a close, despite one last obstacle\.?$",
    re.I,
)


def is_support_title_candidate(value: str) -> bool:
    """Conservatively identify a heading without stealing the first prose line.

    PDF text extraction frequently emits the first sentence of a passage as a
    standalone line.  Treating every short line as a title produced cards with
    duplicated/garbled headings.  A real heading in this corpus is short and
    starts like a heading; punctuation is allowed when a long body follows
    (for example ``Shipping industry faces new risks, says Allianz.``).
    """
    text = value.strip()
    if not text or len(text) > 140 or len(text.split()) > 24:
        return False
    if SUPPORT_LIST_ITEM_RE.match(text):
        return False
    if text[0] in {'"', "'", "“", "‘", "�", "-", "•"}:
        return False
    if not re.match(r"^[A-ZÀ-ÖØ-Þ0-9]", text):
        return False
    return True


def is_support_heading_line(lines: list[str]) -> bool:
    """Return true only when the first line is a genuine passage heading.

    Punctuation-free short headings are safe by themselves.  A punctuated
    line is promoted only when the next line is clearly prose, which avoids
    stealing one-sentence passages or Roman-numeral statement lists while
    still preserving editorial headlines present in the PDF.
    """
    if not lines or not is_support_title_candidate(lines[0]):
        return False
    first = lines[0].strip()
    if SUPPORT_LIST_ITEM_RE.match(first):
        return False
    following_lines = [line.strip() for line in lines[1:4] if line.strip()]
    # The Panama Canal headline is wrapped after ``is`` in the PDF text
    # layer.  Recognise the complete joined headline before the generic
    # lowercase-continuation guard so the wrapper extender can promote it.
    if following_lines and PANAMA_HEADLINE_RE.fullmatch(f"{first} {following_lines[0]}"):
        return True
    if not re.search(r"[.!?;:,/]", first):
        # Even punctuation-free candidates can be wrapped prose.  A lowercase
        # continuation is strong evidence that the first line is not a title.
        return not (following_lines and following_lines[0][:1].islower())
    # A trailing comma/colon is characteristic of a wrapped prose line (and
    # of poetry such as ``When the sun rose this morning,``), not a headline.
    if first.endswith((",", ";", ":", "/")):
        return False
    if len(lines) < 2:
        return False
    # Editorial headlines in the EFOMM material can be a full sentence and
    # are followed by a parenthetical byline.  The byline is a strong visual
    # boundary even when the headline ends with a period.
    if following_lines and re.match(r"^\(?\s*by\b", following_lines[0], re.I):
        return True
    # A wrapped PDF line can be only 50–70 characters wide.  Inspect the
    # first few physical lines as one prose sample rather than requiring the
    # first line alone to reach the threshold.
    following = " ".join(following_lines)
    if following_lines and following_lines[0][:1].islower():
        # A lowercase continuation (``the Highlands...`` / ``with the
        # food...``) proves that the candidate is a wrapped sentence, not a
        # standalone editorial heading.
        return False
    return len(following) >= max(80, len(first) * 1.4) and not any(
        SUPPORT_LIST_ITEM_RE.match(line) for line in following_lines
    )


def clean_support_title(value: str) -> str:
    """Keep support headlines typographically clean (no terminal full stop)."""
    return re.sub(r"\.{1,}\s*$", "", value.strip()).strip()


def extend_wrapped_support_title(title: str | None, lines: list[str]) -> str | None:
    """Join a heading split at a PDF line boundary (``... authorities in``)."""
    if not title or not lines:
        return title
    # A continuation is most reliable when the first line ends in a
    # connector/preposition and the next line is a short, punctuation-free
    # fragment.  Do not join ordinary prose sentences.
    if not re.search(r"\b(?:a|an|and|at|by|for|from|in|is|of|on|the|to|with)$", title, re.I):
        return title
    candidate = f"{title} {lines[0]}".strip()
    if is_support_title_candidate(candidate):
        lines.pop(0)
        return candidate
    return title


def clean_ocr(text: str) -> str:
    for pattern, replacement in OCR_TYPOS:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    return text


def format_statement_items(statement: str) -> str:
    """Format statements containing sequences of items like ( ) or Roman numerals with clean line breaks."""
    matches = list(re.finditer(r"\(\s*\)", statement))
    if len(matches) >= 2:
        lead_in = statement[:matches[0].start()].rstrip()
        item_positions = [m.start() for m in matches] + [len(statement)]
        items = []
        for i in range(len(matches)):
            start = item_positions[i]
            end = item_positions[i+1]
            item_text = statement[start:end].strip()
            items.append(item_text)
        return (lead_in + "\n\n" + "\n".join(items) if lead_in else "\n".join(items)).strip()
    
    roman_matches = list(re.finditer(r"(?:^|\s+)([IVX]+)\s*[-–—.]\s*", statement))
    if len(roman_matches) >= 2 and roman_matches[0].group(1) == "I":
        lead_in = statement[:roman_matches[0].start()].rstrip()
        item_positions = [m.start() for m in roman_matches] + [len(statement)]
        items = []
        for i in range(len(roman_matches)):
            start = item_positions[i]
            end = item_positions[i+1]
            item_text = statement[start:end].strip()
            items.append(item_text)
        return (lead_in + "\n\n" + "\n".join(items) if lead_in else "\n".join(items)).strip()

    return statement


def parse_support_blocks_with_range(raw_text: str) -> dict[str, Any] | None:
    raw_clean = clean_ocr(raw_text)
    range_match = RANGE_HEADER_RE.search(raw_clean)
    q_range = None
    if range_match:
        start_q = int(range_match.group(1))
        end_q = int(range_match.group(2) or start_q)
        q_range = (start_q, end_q)
        
    lines = [line.strip() for line in raw_clean.splitlines() if line.strip()]
    filtered_lines = []
    for line in lines:
        if PAGE_ARTIFACT_RE.fullmatch(line) or line in {"<", ">"}:
            continue
        # When a shared-text marker and its first heading are emitted on one
        # physical line (common in the last alternative of a question), strip
        # only the marker.  The broad prefix regex below is intentionally
        # limited to newline-delimited instructions; applying it here would
        # consume the first ~100 characters of the passage as if they were
        # part of the marker and leave the following questions disconnected.
        range_header = RANGE_HEADER_RE.match(line)
        if range_header:
            line = line[range_header.end():].strip()
        is_header = any(re.match(p, line, re.I) for p in HEADER_PATTERNS)
        if is_header or REDUNDANT_SUPPORT_RE.fullmatch(line):
            continue
        # A shared-passage marker can be concatenated with the first line of
        # the excerpt by the PDF text layer.  Drop only the marker, retaining
        # the actual passage after its closing parenthesis.
        line = REDUNDANT_SUPPORT_PREFIX_RE.sub("", line).strip()
        if line:
            filtered_lines.append(line)
        
    if not filtered_lines:
        return None
        
    sub_blocks = []
    current_label = None
    current_lines = []
    
    for line in filtered_lines:
        label_match = LABEL_RE.match(line)
        if label_match:
            if current_lines:
                sub_blocks.append((current_label, current_lines))
                current_lines = []
            current_label = label_match.group(1).upper()
        else:
            current_lines.append(line)
    if current_lines:
        sub_blocks.append((current_label, current_lines))
        
    if not sub_blocks:
        return None
        
    if len(sub_blocks) == 1:
        label, b_lines = sub_blocks[0]
        title = None
        source = None
        
        if len(b_lines) > 1 and (SOURCE_RE.search(b_lines[-1]) or (b_lines[-1].startswith("(") and b_lines[-1].endswith(")"))):
            source = b_lines.pop()
            if len(b_lines) > 1 and SOURCE_RE.search(b_lines[-1]) and not b_lines[-1].endswith("."):
                source = b_lines.pop() + " " + source
        elif len(b_lines) > 2 and (SOURCE_RE.search(b_lines[-2]) and b_lines[-1].endswith(")")):
            source = b_lines.pop(-2) + " " + b_lines.pop(-1)
            
        if is_support_heading_line(b_lines) and not bool(SOURCE_RE.search(b_lines[0])):
            title = clean_support_title(b_lines.pop(0))
            title = clean_support_title(extend_wrapped_support_title(title, b_lines) or title)
            
        paras = []
        cur_para = []
        for line in b_lines:
            if cur_para:
                prev = cur_para[-1]
                is_para_end = (
                    len(prev) < 70 and bool(re.search(r'[.!?]["\'’”)]?$', prev))
                    or bool(re.match(r'^\[\d+\]', line))
                )
                if is_para_end:
                    paras.append(" ".join(cur_para))
                    cur_para = []
            cur_para.append(line)
        if cur_para:
            paras.append(" ".join(cur_para))
            
        if not paras:
            return None
        res: dict[str, Any] = {"paragraphs": paras}
        if label:
            res["label"] = label
        if title:
            res["title"] = title
        if source:
            res["source"] = source
        if q_range:
            res["_range"] = q_range
        return res
    else:
        combined_paras = []
        titles = []
        sources = []
        for label, b_lines in sub_blocks:
            if not b_lines:
                continue
            extract_title = None
            extract_source = None
            if len(b_lines) > 1 and (SOURCE_RE.search(b_lines[-1]) or (b_lines[-1].startswith("(") and b_lines[-1].endswith(")"))):
                extract_source = b_lines.pop()
            if is_support_heading_line(b_lines):
                extract_title = clean_support_title(b_lines.pop(0))
                extract_title = clean_support_title(extend_wrapped_support_title(extract_title, b_lines) or extract_title)
            
            paras = []
            cur_para = []
            for line in b_lines:
                if cur_para:
                    prev = cur_para[-1]
                    if len(prev) < 70 and bool(re.search(r'[.!?]["\'’”)]?$', prev)):
                        paras.append(" ".join(cur_para))
                        cur_para = []
                cur_para.append(line)
            if cur_para:
                paras.append(" ".join(cur_para))
                
            header_prefix = f"[{label}]" if label else ""
            if extract_title:
                header_prefix += f" {extract_title}" if header_prefix else extract_title
            if header_prefix:
                combined_paras.append(header_prefix)
            combined_paras.extend(paras)
            if extract_source:
                combined_paras.append(f"({extract_source.strip('()')})")
                sources.append(extract_source)
            if extract_title:
                titles.append(extract_title)
                
        if not combined_paras:
            return None
        res = {
            "title": " / ".join(titles) if titles else None,
            "paragraphs": combined_paras,
            "source": "; ".join(sources) if sources else None,
        }
        if q_range:
            res["_range"] = q_range
        return {k: v for k, v in res.items() if v}


def sanitize_support(support: dict[str, Any] | None) -> dict[str, Any] | None:
    """Remove extraction artefacts while preserving title/body/source fields.

    Multi-extract passages are frequently emitted as ``[EXTRACT 1]`` and
    ``[EXTRACT 2]`` markers, with the first heading repeated in both the
    structured title and the paragraph stream.  Those are layout labels from
    the compilation, not learner-facing prose.  Keep the first heading as the
    card title, remove the duplicate marker/title, and leave subsequent
    headings as ordinary readable paragraphs.  Bibliographic fragments are
    compacted into one deduplicated source footer.
    """
    if not support:
        return None
    cleaned: dict[str, Any] = {key: value for key, value in support.items() if key == "_range"}
    raw_title = clean_support_title(str(support.get("title") or "").strip())
    has_extract_markers = any(EXTRACT_MARKER_RE.match(str(part)) for part in support.get("paragraphs") or [])
    title_candidates = [part.strip() for part in re.split(r"\s+/\s+", raw_title) if part.strip()] if has_extract_markers else [raw_title]
    title_candidates = [part for part in title_candidates if part]
    if title_candidates:
        cleaned["title"] = clean_support_title(title_candidates[0])
    for key in ("label", "author"):
        value = str(support.get(key) or "").strip()
        if not value:
            continue
        value = REDUNDANT_SUPPORT_PREFIX_RE.sub("", value).strip()
        if value and not REDUNDANT_SUPPORT_RE.fullmatch(value):
            cleaned[key] = value
    source_parts: list[str] = []

    def add_sources(value: str) -> None:
        # Semicolons are the separator used by the importer for multiple
        # extracts.  De-duplicate exact citations while retaining their order.
        for part in re.split(r"\s*;\s*", value):
            part = re.sub(r"\s+", " ", part).strip()
            part = re.sub(r"\)\s*$", "", part).strip()
            part = re.sub(r"^\(\s*", "", part).strip()
            # PDF URLs are commonly printed as ``<https://…>``.  The angle
            # brackets are typography, not part of the link; keeping them
            # would create a stray ``<`` paragraph when the citation is split.
            part = part.strip("<>").strip()
            if part and part not in source_parts:
                source_parts.append(part)

    add_sources(str(support.get("source") or ""))
    paragraphs: list[str] = []
    for paragraph in support.get("paragraphs") or []:
        value = str(paragraph).strip()
        value = REDUNDANT_SUPPORT_PREFIX_RE.sub("", value).strip()
        value = EXTRACT_MARKER_RE.sub("", value).strip()
        # A page break can leave the opening parenthesis of the next printed
        # citation attached to the final prose line.  It is not part of the
        # passage and should never be rendered as a dangling character.
        value = re.sub(r"\s+\($", "", value).strip()
        if value in {"(", ")", "<", ">"} or PAGE_ARTIFACT_RE.fullmatch(value):
            continue
        year_only = re.fullmatch(r"\(?\s*(?:19|20)\d{2}\s*\)?", value)
        if year_only:
            add_sources(value.strip("() "))
            continue
        terminal_date = re.search(r"\s+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\s*$", value)
        if terminal_date and terminal_date.start() > 0:
            # Publication dates can be concatenated to the final prose line
            # before an ``Adapted from`` citation in the PDF text layer.
            paragraphs.append(value[: terminal_date.start()].strip())
            add_sources(terminal_date.group(1))
            continue
        if re.fullmatch(r"\(?\s*\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\s*\)?", value):
            add_sources(value.strip("() "))
            continue
        if value and not REDUNDANT_SUPPORT_RE.fullmatch(value):
            # A parenthetical byline is often glued to the first body
            # sentence (``(by Author / date) The article ...``).  Keep the
            # attribution in the metadata row and leave only the article in
            # the readable paragraph stream.
            byline = re.match(r"^\(?\s*by\s+([^)]{2,120})\)?\s+(?=[A-ZÀ-ÖØ-Þ])", value, re.I)
            if byline and not cleaned.get("author"):
                cleaned["author"] = f"By {re.sub(r'\s+', ' ', byline.group(1)).strip()}"
                value = value[byline.end():].strip()
                if not value:
                    continue
            if re.match(r"^\s*[<]?\s*(?:Adapted\s+from|Fragment\s+taken\s+from|(?:Source|Fonte)\s*:|Available|Dispon[íi]vel|https?://|www\.)", value, re.I):
                add_sources(value)
                continue
            embedded = re.search(r"\b(?:Adapted\s+from|Fragment\s+taken\s+from|(?:Source|Fonte)\s*:|Available|Dispon[íi]vel)\b|https?://|www\.", value, re.I)
            if embedded and embedded.start() > 0:
                prefix = value[:embedded.start()].strip(" -–—()<>")
                citation = value[embedded.start():].strip()
                if prefix.lower().startswith("by ") and not cleaned.get("author"):
                    cleaned["author"] = prefix[3:].strip()
                elif prefix:
                    paragraphs.append(prefix)
                if citation:
                    add_sources(citation)
                continue
            plain_value = re.sub(r"\s+", " ", value).strip().lower()
            if cleaned.get("title") and plain_value == re.sub(r"\s+", " ", str(cleaned["title"])).strip().lower():
                # The first extract heading is already rendered as the card
                # title; showing it again as the first paragraph is a visible
                # duplication in the support box.
                continue
            if any(plain_value == re.sub(r"\s+", " ", candidate).strip().lower() for candidate in title_candidates[1:]):
                # Keep later extract headings, but without the [EXTRACT n]
                # implementation marker.  They remain readable separators
                # between the shared passage bodies.
                paragraphs.append(value)
                continue
            paragraphs.append(value)
    year_parts = [part for part in source_parts if re.fullmatch(r"(?:19|20)\d{2}", part)]
    if year_parts:
        # Some multi-extract pages emit ``(2011)`` as a standalone block and
        # the month/source line separately.  Reattach that year to citations
        # that end in a month so the footer remains bibliographically useful.
        year = year_parts[-1]
        source_parts = [part for part in source_parts if part != year]
        source_parts = [
            f"{part} {year}" if re.search(r",\s*(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)$", part, re.I) else part
            for part in source_parts
        ]
    # A malformed URL split can still leave the opening bracket as a tiny
    # prefix paragraph after the citation has been moved to ``source``.  Do
    # one final defensive pass so no visual-only punctuation reaches the UI.
    paragraphs = [
        paragraph for paragraph in paragraphs
        if paragraph.strip() not in {"<", ">"}
        and not PAGE_ARTIFACT_RE.fullmatch(paragraph.strip())
    ]
    if source_parts:
        cleaned["source"] = "; ".join(source_parts)
    if paragraphs:
        cleaned["paragraphs"] = paragraphs
    # A citation without readable paragraphs is provenance, not a support
    # card.  Keeping it as support creates an expandable empty block.
    if not cleaned.get("paragraphs"):
        return None
    return cleaned


def load_legacy_parser():
    path = Path(__file__).with_name("import_english_questions.py")
    spec = importlib.util.spec_from_file_location("legacy_english_importer", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load audited parser: {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def normalise_metadata(raw: str, group: dict[str, Any]) -> tuple[dict[str, Any], str]:
    """Parse only printed credits; return metadata and the unconsumed text."""
    value = raw.strip()
    match = re.match(r"^\(([^)]+)\)\s*", value)
    credit = match.group(1).strip() if match else ""
    remainder = value[match.end():].strip() if match else value
    if not credit:
        return {"board": "Compilação sem banca impressa", "source": "pdf-section"}, remainder

    adapted = bool(ADAPTED_RE.search(credit))
    if adapted:
        credit = ADAPTED_RE.sub("", credit).strip(" -–—")
    board = credit
    year: int | None = None
    year_match = BOARD_YEAR_RE.match(credit)
    if year_match:
        board = year_match.group("board").strip(" -–—")
        raw_year = int(year_match.group("year"))
        year = raw_year + (1900 if raw_year >= 50 else 2000) if raw_year < 100 else raw_year
    role_match = re.search(r"\b(?:CARGO|POSTO|FUN[CÇ][AÃ]O|MODALIDADE)\s*[:\-]\s*(.+)$", board, re.I)
    role = role_match.group(1).strip() if role_match else None
    if role_match:
        board = board[:role_match.start()].strip(" -–—")
    normalised = {
        "board": board or "Compilação sem banca impressa",
        "source": "pdf-header",
    }
    if year is not None:
        normalised["year"] = year
    if role:
        normalised["role"] = role
    if adapted:
        normalised["adapted"] = True
    return normalised, remainder


def parse_answer_keys(reader: PdfReader) -> tuple[dict[tuple[str, int], tuple[str, int]], list[dict[str, Any]]]:
    answers: dict[tuple[str, int], tuple[str, int]] = {}
    duplicates: list[dict[str, Any]] = []
    for group in GROUPS:
        for page_number in group["answers"]:
            text = reader.pages[page_number - 1].extract_text() or ""
            for number, letter in ANSWER_RE.findall(text):
                n = int(number)
                if 1 <= n <= group["count"]:
                    key = (group["id"], n)
                    if key in answers:
                        duplicates.append({"sectionId": group["id"], "questionNumber": n, "page": page_number})
                    else:
                        answers[key] = (letter.upper(), page_number)
    return answers, duplicates


def extract_editorial_totals(reader: PdfReader) -> dict[str, int]:
    """Read the declared reconciliation totals from the PDF's table of contents."""
    text = reader.pages[9].extract_text() or ""
    compact = re.sub(r"\s+", " ", text)
    reading_match = re.search(r"Interpreta(?:ção|o)\s+de\s+Texto\s+e\s+Vocabulário.*?\b(967)\b", compact, re.I)
    question_match = re.search(r"Total\s+de\s+quest(?:ões|es).*?\b(2270)\b", compact, re.I)
    exams_match = re.search(r"Número\s+de\s+provas\s+analisadas.*?\b(112)\b", compact, re.I)
    if not (reading_match and question_match and exams_match):
        raise RuntimeError("Tabela editorial da página 10 não pôde ser reconciliada")
    return {
        "questions": int(question_match.group(1)),
        "readingVocabulary": int(reading_match.group(1)),
        "grammar": int(question_match.group(1)) - int(reading_match.group(1)),
        "subjects": len(GROUPS) - sum(1 for group in GROUPS if group.get("kind") == "reading") + 1,
        "exams": int(exams_match.group(1)),
    }


def validate_editorial_totals(
    reader: PdfReader,
    all_records: list[dict[str, Any]],
    sections: list[dict[str, Any]],
    answers: dict[tuple[str, int], tuple[str, int]],
    answer_duplicates: list[dict[str, Any]],
) -> dict[str, Any]:
    declared = extract_editorial_totals(reader)
    if declared != EDITORIAL_TOTALS:
        raise RuntimeError(f"Totais declarados inesperados na tabela editorial: {declared}")
    computed_questions = sum(int(group["count"]) for group in GROUPS)
    computed_reading = sum(int(group["count"]) for group in GROUPS if group.get("kind") == "reading")
    computed_grammar = computed_questions - computed_reading
    expected_keys = {
        (group["id"], number)
        for group in GROUPS
        for number in range(1, int(group["count"]) + 1)
    }

    if computed_questions != EDITORIAL_TOTALS["questions"] or len(all_records) != computed_questions:
        raise RuntimeError("A soma das posições da tabela não fecha com as questões extraídas")
    if computed_reading != EDITORIAL_TOTALS["readingVocabulary"] or computed_grammar != EDITORIAL_TOTALS["grammar"]:
        raise RuntimeError("A divisão leitura/vocabulário versus gramática não fecha com a tabela editorial")
    if len({group["id"] for group in GROUPS}) != 40 or len(sections) != 40:
        raise RuntimeError("Os 40 agrupamentos editoriais não foram reconciliados")
    if set(answers) != expected_keys or answer_duplicates:
        raise RuntimeError("Os gabaritos não cobrem exatamente cada posição, sem duplicatas")
    if any(section["detected"] != section["expected"] for section in sections):
        raise RuntimeError("Uma seção não fechou o número esperado de questões")
    return {
        "declared": dict(EDITORIAL_TOTALS),
        "computed": {
            "questions": computed_questions,
            "readingVocabulary": computed_reading,
            "grammar": computed_grammar,
            "subjects": EDITORIAL_TOTALS["subjects"],
            "exams": EDITORIAL_TOTALS["exams"],
            "answerPositions": len(answers),
            "answerBlocks": len(GROUPS),
        },
        "answerDuplicates": answer_duplicates,
        "status": "passed",
    }


def remove_authorial_questions(records: list[dict[str, Any]]) -> int:
    removed = 0
    for record in records:
        metadata = record.get("examMetadata") or {}
        board = str(metadata.get("board") or record.get("banca") or "")
        if not AUTHORIAL_BOARD_RE.search(board):
            continue
        removed += 1
        quality = record.setdefault("quality", {})
        quality["status"] = "rejected"
        quality["warnings"] = ["Questão autoral removida por política de direitos autorais."]
        record["authorialRemoved"] = True
        record["removalReason"] = "authorial-content"
        record["statement"] = ""
        record["options"] = []
        record["support"] = None
        record["media"] = []
        record["banca"] = "Conteúdo removido"
        record["examMetadata"] = {"board": "Conteúdo removido", "source": "pdf-section"}
    return removed


def apply_manual_record_fixes(records: list[dict[str, Any]]) -> None:
    """Apply only documented, source-confirmed extraction repairs."""
    for record in records:
        fix = MANUAL_RECORD_FIXES.get(assignment_key(record))
        if not fix:
            continue
        for field, value in fix.items():
            record[field] = value
        quality = record.setdefault("quality", {})
        warnings = quality.setdefault("warnings", [])
        note = "Enunciado recomposto a partir da camada textual da página de origem."
        if note not in warnings:
            warnings.append(note)
        evidence = quality.setdefault("evidence", [])
        if not any(item.get("field") == "statement" and item.get("method") == "manual-source-repair" for item in evidence):
            evidence.append({
                "field": "statement",
                "page": record.get("provenance", {}).get("questionPage", 0),
                "method": "manual-source-repair",
            })
        field_confidence = quality.setdefault("fieldConfidence", {})
        field_confidence["statement"] = {"confidence": 0.99, "method": "manual-source-repair"}


def clean_group_text(text: str, parser: Any, group: dict[str, Any]) -> str:
    value = text.replace("\r", "")
    value = clean_ocr(value)
    value = re.sub(r"(?im)^\s*(?:Gabarito|Sumário)\s*$", "", value)
    value = re.sub(r"(?m)^\s*\d{1,3}\s*$", "", value)
    value = re.sub(r"(?im)^\s*(?:Interpretação de Texto e Vocabulário|Interpretação e Vocabulário|Gramática)(?:\s*[-–—]\s*.*)?$", "", value)
    value = parser.repair_extraction(value)
    return value.strip()


def build_record(
    raw: str,
    number: int,
    page: int,
    group: dict[str, Any],
    parser: Any,
    answers: dict[tuple[str, int], tuple[str, int]],
    active_support: dict[str, Any] | None,
    pdf_hash: str,
) -> tuple[dict[str, Any], dict[str, Any] | None, str | None]:
    raw = clean_group_text(raw, parser, group)
    metadata, raw_without_credit = normalise_metadata(raw, group)
    statement_text, options, trailing = parser.split_options(raw_without_credit)
    options, trailing = split_option_support_boundary(options, trailing)
    statement_text = clean_ocr(parser.repair_extraction(statement_text)).strip()
    statement_text = format_statement_items(statement_text)
    
    support = active_support
    if not support_applies_to_question(support, number):
        support = None

    inline_payload_appended = False
    statement_text, inline_support = parser.promote_inline_support(statement_text)
    if not inline_support and not support:
        statement_text, inline_support = split_inline_reading_payload(statement_text, parser)
    if inline_support:
        cleaned_inline = (
            inline_support
            if inline_support.get("_inlinePayload")
            else parse_support_blocks_with_range("\n\n".join(inline_support.get("paragraphs", [])))
        )
        if cleaned_inline:
            if support and support_is_question_payload(cleaned_inline):
                # I–IV/( ) statements are part of the question, not a second
                # support card.  Preserve them in the prompt while retaining
                # the validated shared passage (q6, q37 and similar layouts).
                payload = "\n\n".join(
                    str(part).strip()
                    for part in (cleaned_inline.get("paragraphs") or [])
                    if str(part).strip()
                )
                statement_text = "\n\n".join(part for part in (statement_text, payload) if part).strip()
                inline_payload_appended = True
            elif not support or not support_is_question_payload(cleaned_inline):
                # A genuine question-specific reading excerpt supersedes a
                # preceding shared passage (for example quoted lyrics).
                support = cleaned_inline

    if not inline_payload_appended:
        split_statement, leading_support = split_leading_reading_payload(statement_text, parser)
        if leading_support:
            statement_text = split_statement
            support = leading_support

    if group.get("kind") == "reading" and not support:
        paragraphs = parser.paragraphs_from_text(statement_text)
        instruction_index = next((i for i, p in enumerate(paragraphs) if parser.is_instruction(p)), None)
        if instruction_index is not None and instruction_index > 0:
            parsed_supp = parse_support_blocks_with_range("\n\n".join(paragraphs[:instruction_index]))
            if parsed_supp:
                support = parsed_supp
                statement_text = "\n\n".join(paragraphs[instruction_index:]).strip()

    if support:
        if support_starts_with_prose_question_word(support):
            captured = None
        else:
            support, captured = parser.split_support_command(support)
        if captured and parser.is_redundant_support_instruction(statement_text):
            statement_text = captured
        if support and parser.support_is_instruction_only(support):
            statement_text = "\n\n".join(
                part for part in ("\n\n".join(support.get("paragraphs", [])), statement_text) if part
            ).strip()
            support = None
        if support and not inline_payload_appended:
            statement_text = parser.strip_statement_support_preamble(statement_text, True)

    if support and not statement_text.strip():
        recovered_statement, recovered_support = recover_statement_from_support(support, parser)
        if recovered_statement:
            statement_text = format_statement_items(recovered_statement)
            support = recovered_support

    if support and support_is_question_payload(support):
        payload = "\n\n".join(str(part).strip() for part in (support.get("paragraphs") or []) if str(part).strip())
        statement_text = "\n\n".join(part for part in (statement_text, payload) if part).strip()
        support = None

    if trailing.strip():
        parsed_trailing = parse_support_blocks_with_range(trailing)
        if parsed_trailing and group.get("kind") == "reading":
            active_support = parsed_trailing

    answer, answer_page = answers.get((group["id"], number), (None, None))
    warnings: list[str] = []
    if answer is None:
        warnings.append("Gabarito não localizado para a posição da seção.")
        answer = "A"
    if len(options) not in (4, 5):
        warnings.append(f"Quantidade de alternativas extraídas: {len(options)}.")
    if not statement_text.strip():
        warnings.append("Enunciado vazio.")
    if answer and not any(option["letter"] == answer.upper() for option in options):
        warnings.append("Gabarito não possui alternativa correspondente.")
    if any(ch in statement_text or ch in " ".join(o["text"] for o in options) for ch in ("\ufffd", "†", "¢")):
        warnings.append("Caractere potencialmente corrompido detectado.")
    if metadata.get("source") == "pdf-section":
        warnings.append("Banca/ano não impressos na questão; mantida como crédito de seção.")
    if any(NEXT_SUPPORT_MARKER_RE.search(str(option.get("text", ""))) for option in options):
        warnings.append("Fragmento da passagem seguinte vazou para uma alternativa.")

    options = [
        {
            **option,
            "text": clean_ocr(option["text"]).strip(),
            "correct": option["letter"] == answer.upper(),
        }
        for option in options
    ]
    evidence = [
        {"field": "statement", "page": page, "method": "native-text"},
        {"field": "options", "page": page, "method": "native-text"},
        {"field": "answer", "page": answer_page or page, "method": "deterministic"},
        {"field": "metadata", "page": page, "method": "deterministic"},
    ]
    if support:
        evidence.append({"field": "support", "page": page, "method": "native-text"})
    fatal_warnings = {
        warning for warning in warnings
        if warning.startswith((
            "Gabarito não localizado",
            "Quantidade de alternativas",
            "Enunciado vazio",
            "Gabarito não possui",
            "Caractere potencialmente corrompido",
            "Fragmento da passagem seguinte",
        ))
    }
    subject_id = group["id"]
    # Unified card subject title: avoid repeating board name twice in header tags
    display_subject_title = "Interpretação e Vocabulário" if group.get("kind") == "reading" else group["title"]
    
    record: dict[str, Any] = {
        "id": f"ep-{pdf_hash[:12]}-{group['id']}-q{number}",
        "corpusId": "english_preview",
        "subjectId": subject_id,
        "subjectTitle": display_subject_title,
        "listId": "english_preview",
        "listTitle": "Inglês Preview",
        "questionNumber": number,
        "provenance": {
            "pdf": "Apostila de Inglês (CN, EPCAR, EAM, EsSA, EEAR, EsPCEx, AFA, EFOMM, EN e ITA) - Atualizada.pdf",
            "questionPage": page,
            "answerPage": answer_page,
            "sectionId": group["id"],
            "evidence": evidence,
        },
        "quality": {
            "status": "quarantined" if fatal_warnings else "warning" if warnings else "verified",
            "warnings": warnings,
            "evidence": evidence,
            "fieldConfidence": {
                "statement": {"confidence": 0.82, "method": "native-text"},
                "options": {"confidence": 0.86, "method": "native-text"},
                "answer": {"confidence": 1.0 if answer_page else 0.0, "method": "deterministic"},
                "metadata": {"confidence": 0.96 if metadata.get("year") else 0.7, "method": "deterministic"},
            },
        },
        "statement": statement_text,
        "options": options,
        "correctLetter": answer.upper(),
        "banca": metadata["board"],
        "examMetadata": metadata,
        "language": "en",
    }
    if support:
        record["support"] = support
    return record, active_support, trailing


def parse_groups(
    reader: PdfReader,
    parser: Any,
    answers: dict[tuple[str, int], tuple[str, int]],
    pdf_hash: str,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    records: list[dict[str, Any]] = []
    section_rows: list[dict[str, Any]] = []
    for group in GROUPS:
        last_page = max(group["end"], min(group["answers"]))
        page_text = "\n\n".join(reader.pages[n - 1].extract_text() or "" for n in range(group["start"], last_page + 1))
        answer_heading = re.search(r"(?im)^\s*Gabarito\b", page_text)
        if answer_heading:
            page_text = page_text[:answer_heading.start()]
        page_offsets: list[tuple[int, int]] = []
        cursor = 0
        for n in range(group["start"], last_page + 1):
            text = reader.pages[n - 1].extract_text() or ""
            page_offsets.append((cursor, n))
            cursor += len(text) + 2
        matches = list(QUESTION_RE.finditer(page_text))
        ordered_matches: list[re.Match[str]] = []
        expected_number = 1
        for candidate in matches:
            candidate_number = int(candidate.group(1))
            if candidate_number == expected_number:
                ordered_matches.append(candidate)
                expected_number += 1
            elif candidate_number < expected_number:
                continue
        matches = ordered_matches
        active_support: dict[str, Any] | None = None
        initial = page_text[:matches[0].start()] if matches else page_text
        if group.get("kind") == "reading" and initial.strip():
            active_support = parse_support_blocks_with_range(clean_group_text(initial, parser, group))
        parsed_count = 0
        for index, match in enumerate(matches):
            number = int(match.group(1))
            if number < 1 or number > group["count"]:
                continue
            end = matches[index + 1].start() if index + 1 < len(matches) else len(page_text)
            raw = page_text[match.end():end]
            page = max((n for offset, n in page_offsets if offset <= match.start()), default=group["start"])
            record, active_support, trailing = build_record(raw, number, page, group, parser, answers, active_support, pdf_hash)
            records.append(record)
            parsed_count += 1
        section_rows.append({
            "sectionId": group["id"],
            "title": group["title"],
            "expected": group["count"],
            "detected": parsed_count,
            "questionPages": [group["start"], group["end"]],
            "answerPages": group["answers"],
            "complete": parsed_count == group["count"],
        })
    backfill_shared_support(records)
    # Normalize after backfill so every question receives the same clean
    # passage, without repeating "Texto para ..." / "Leia" directions.
    for record in records:
        if record.get("support"):
            record["support"] = sanitize_support(record.get("support"))
    # Clean private temporary range before final usage
    for record in records:
        if record.get("support") and "_range" in record["support"]:
            del record["support"]["_range"]
    return records, section_rows


def backfill_shared_support(records: list[dict[str, Any]]) -> None:
    """Apply a recovered shared passage to earlier questions in its range."""
    by_section: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        section = str((record.get("provenance") or {}).get("sectionId") or "")
        by_section[section].append(record)
    for section_records in by_section.values():
        for donor in section_records:
            support = donor.get("support")
            if not support:
                continue
            q_range = support.get("_range")
            if not q_range:
                continue
            start, end = q_range
            clean_donor_support = {k: v for k, v in support.items() if k != "_range"}
            for target in section_records:
                number = int(target.get("questionNumber", 0))
                if start <= number <= end and not target.get("support"):
                    target["support"] = json.loads(json.dumps(clean_donor_support, ensure_ascii=False))
                    evidence = target.get("quality", {}).get("evidence", [])
                    if not any(item.get("field") == "support" for item in evidence):
                        evidence.append({
                            "field": "support",
                            "page": target.get("provenance", {}).get("questionPage", 0),
                            "method": "native-text",
                        })


def normalised_fingerprint(record: dict[str, Any]) -> str:
    value = " ".join([
        record.get("statement", ""),
        *(option.get("text", "") for option in record.get("options", [])),
    ])
    return re.sub(r"[^a-z0-9]+", "", value.lower())


VISUAL_REFERENCE_RE = re.compile(
    r"(?:\b(?:in|on|according\s+to|read|observe|look\s+at)\s+(?:the\s+)?(?:cartoon|comic\s+strip|tirinha)\b|"
    r"\b(?:a|the)\s+comic\s+strip\b|\b(?:a|the|uma)\s+charge\b|\btirinha\b|"
    r"\b(?:figure|image|picture)\s+(?:below|above|following)\b|"
    r"\b(?:in|on|look\s+at|observe)\s+(?:the\s+)?picture\b|\b(?:na|n[ao])\s+figura\b|"
    r"\bcity\s+map\b|\b(?:observe|look\s+at)\s+the\s+.*\bmap\b|"
    r"\b(?:read|leia)\s+(?:the\s+)?(?:cartoon|comic|tirinha|charge|an[úu]ncio)\b|"
    r"\bleia\s+o\s+an[úu]ncio\b)",
    re.I,
)

# The text layer sometimes assigns a question to the previous column/page
# and cannot express that one visual is shared by several questions.  These
# audited assignments come from rendered-page inspection.  The key is stable
# across imports because it uses the section id and printed question number.
# They also document context images whose answer depends on the artwork even
# when the extracted statement does not repeat the word "cartoon".
VISUAL_IMAGE_ASSIGNMENTS: dict[str, tuple[int, int]] = {
    "preview_reading_eear:q1": (43, 0),
    "preview_reading_eear:q2": (43, 1),
    "preview_reading_eear:q4": (43, 2),
    "preview_reading_eear:q49": (49, 0),
    "preview_reading_eear:q54": (49, 1),
    "preview_reading_eear:q55": (49, 1),
    "preview_reading_eear_bct:q50": (69, 0),
    "preview_reading_ita:q62": (186, 0),
    "preview_reading_ita:q19": (178, 0),
    "preview_reading_ita:q20": (178, 0),
    "preview_reading_ita:q21": (178, 0),
    "preview_reading_ita:q22": (178, 0),
    "preview_reading_ita:q57": (184, 0),
    "preview_reading_ita:q101": (195, 0),
    "preview_reading_ita:q63": (186, 0),
    "preview_adjectives:q8": (222, 0),
    "preview_adjectives:q21": (223, 0),
    "preview_adjectives:q22": (223, 1),
    "preview_pronouns_demonstrative:q18": (270, 0),
    "preview_verbs:q75": (286, 0),
    "preview_modal_verbs:q20": (323, 1),
    "preview_modal_verbs:q23": (324, 0),
    "preview_question_tags:q9": (346, 1),
    "preview_reported_speech:q6": (350, 0),
    "preview_grammar_classes:q91": (390, 1),
    "preview_grammar_classes:q92": (390, 1),
}

VISUAL_PAGE_OVERRIDES: dict[str, int] = {
    "preview_reading_eear_bct:q50": 69,
    "preview_reading_efomm:q34": 142,
    "preview_modal_verbs:q23": 324,
    "preview_adjectives:q8": 222,
    "preview_adjectives:q21": 223,
    "preview_adjectives:q22": 223,
}

# A small number of source pages in the apostila refer to an artwork that is
# not embedded in the PDF (or contain more than one candidate image).  These
# corrections were verified against the corresponding exam publications on
# the web.  The assets are committed, cropped WebP files; the importer never
# downloads remote content during a build.
EXTERNAL_VISUAL_CORRECTIONS: dict[str, dict[str, Any]] = {
    "preview_reading_epcar:q83": {
        "assetId": "english-preview/ep-029a154daaf7-preview_reading_epcar-q83-external-epcar-2022.webp",
        "assetUrl": "/assets/english-preview/ep-029a154daaf7-preview_reading_epcar-q83-external-epcar-2022.webp",
        "source": "https://raesidecartoon.com/vault/global-warming-climate-change/",
        "verificationUrl": "https://www.fab.mil.br/ingresso/arquivos/provas/CPCAR_2023_versa%E2%95%A0%C3%A2o_A.pdf",
        "sourcePage": 4,
        "crop": {"x": 28.4399985 / 595.32, "y": 92.28000275 / 841.92, "width": 268.3200075 / 595.32, "height": 213.71999325 / 841.92},
        "width": 537,
        "height": 427,
        "hash": "external-epcar-2022-cartoon",
        "clearsWarnings": ("A questão solicita um elemento visual ausente no PDF; recorte oficial necessário.",),
    },
    "preview_adjectives:q25": {
        "assetId": "english-preview/ep-029a154daaf7-preview_adjectives-q25-external-eear-2022.webp",
        "assetUrl": "/assets/english-preview/ep-029a154daaf7-preview_adjectives-q25-external-eear-2022.webp",
        "source": "https://www.grammarly.com/blog/10-interesting-english-facts-guest/",
        "verificationUrl": "https://ingresso.eear.fab.mil.br/SOO/escolaridade/CFS%202%202022/prova_cfs%202%202022_cod_01.pdf",
        "sourcePage": 8,
        "crop": {"x": 46.5 / 595.22, "y": 372.0 / 842.0, "width": 227.27999999999997 / 595.22, "height": 119.27999999999997 / 842.0},
        "width": 455,
        "height": 239,
        "hash": "external-eear-2022-longest-word",
        "clearsWarnings": ("Há mais de um recorte visual possível na página; atribuição ambígua.",),
    },
}

# The original Preview answer key has one malformed entry (E although only
# A–D are printed).  Independent exam publications identify D as the official
# answer.  Keeping this correction explicit prevents the importer from ever
# guessing a key from the question's semantics.
WEB_QUESTION_CORRECTIONS: dict[str, dict[str, Any]] = {
    "preview_pronouns_relative:q17": {
        "correctLetter": "D",
        "sources": [
            "https://www.concursosmilitares.com.br/provas-anteriores/aeronautica/afa/afa2013.pdf",
            "https://mosaiko.com.br/portfolio/pensi/wp-content/uploads/2014/08/gabarito_AFA2013_ingles.pdf",
        ],
        "originalAnswer": "E",
    },
}

# The Numbers section's question 19 has a split text layer in the source PDF:
# the introductory direction is emitted as the command and the actual
# question is emitted after the quoted support passage. Keep this explicit,
# evidence-backed repair in the deterministic importer instead of allowing a
# blank command to reach the studyable corpus.
MANUAL_RECORD_FIXES: dict[str, dict[str, Any]] = {
    "preview_numbers:q19": {
        "statement": "How many numerals appear in the sentence?",
    },
}

NEXT_SUPPORT_MARKER_RE = re.compile(
    r"\s+Texto\s+para\s+(?=(?:a|as)\s+quest)",
    re.I,
)

EMPTY_STATEMENT_COMMAND_RE = re.compile(
    r"\b(?:According\s+to\s+the\s+text|All\s+the\s+sentences|The\s+(?:underlined|adjective|phrasal\s+verb|demonstrative|word|following|correct)|"
    r"Mark\s+the\s+option|Change\s+the\s+sentence|Complete\s+the\s+dialogue|What(?:['’]s|\s+is)\s+the\s+(?:idea|meaning)|"
    r"Which\s+option|Choose\s+the|Assinale|Marque|Indique|A\s+alternativa)\b",
    re.I,
)


def split_option_support_boundary(options: list[dict[str, Any]], trailing: str) -> tuple[list[dict[str, Any]], str]:
    if not options:
        return options, trailing
    cleaned = [dict(option) for option in options]
    for index in range(len(cleaned) - 1, -1, -1):
        text = str(cleaned[index].get("text", ""))
        match = NEXT_SUPPORT_MARKER_RE.search(text)
        if not match:
            continue
        option_text = text[:match.start()].strip()
        support_tail = text[match.start():].strip()
        cleaned[index]["text"] = option_text
        trailing = "\n\n".join(part for part in (support_tail, trailing) if part.strip())
        break
    return cleaned, trailing


INLINE_SUPPORT_COMMAND_RE = re.compile(
    # Keep this deliberately narrow: ``Choose ...: It is ...`` often denotes
    # fill-in-the-blank content, not a passage.  The boundary splitter is for
    # reading directions whose wording reliably introduces an excerpt.
    r"^(?:according|based|read|observe|consider|considere|leia|ap[óo]s\s+a\s+leitura)\b",
    re.I,
)


TRAILING_SUPPORT_COMMAND_RE = re.compile(
    r"(?is)(?P<command>(?:According\s+to\s+(?:it|the\s+text|the\s+article|the\s+passage)[^\n]{0,180}"
    r"|Based\s+on\s+the\s+text[^\n]{0,180}|It\s+is\s+(?:true|false)\s+to\s+say\s+that"
    r"|The\s+text\s+above\s+can\s+be\s+considered"
    r"|The\s+(?:word|expression|quotation)\b[^\n]{0,180}"
    r"|What\s+can\s+be\s+inferred\s+from\s+the\s+text"
    r"|Which\s+of\s+the\s+following\b[^\n]{0,180}))\s*:?\s*$",
)


def split_inline_reading_payload(statement: str, parser: Any) -> tuple[str, dict[str, Any] | None]:
    """Separate a long passage that follows a question command and colon.

    A few PDF text layers flatten the support passage into the statement (for
    example ``... statements are true, EXCEPT: My name is Patrick...``).  Only
    split when the prefix is a short, recognisable command, the boundary is a
    colon, and the suffix contains multiple prose sentences.  This keeps
    ordinary one-line questions intact and never fabricates a passage.
    """
    value = statement.replace("\r", "").strip()
    if len(value) < 180:
        return statement, None
    for boundary in re.finditer(r":(?=\s*[A-ZÀ-ÖØ-Þ])", value):
        prefix = value[: boundary.end()].strip()
        body = value[boundary.end() :].strip()
        if not (12 <= len(prefix) <= 220 and len(body) >= 100):
            continue
        if not INLINE_SUPPORT_COMMAND_RE.match(prefix):
            continue
        # Require an operative command ending before the passage.  This
        # avoids treating arbitrary prose containing a colon as support.
        if not re.search(
            r"\b(?:except|following|below|true|false|correct(?:ly)?|statements?|question|text|passage)\s*:\s*$",
            prefix,
            re.I,
        ):
            continue
        if len(re.findall(r"[.!?](?:\s|$)", body)) < 2:
            continue
        parsed = parse_support_blocks_with_range(body)
        if not parsed:
            parsed = {"paragraphs": [parser.repair_extraction(body)]}
        elif parsed.get("title"):
            # Inline payloads have no editorial heading boundary.  The generic
            # support parser may mistake a wrapped first sentence for a title;
            # restore it to the prose stream so no words disappear.
            parsed = {
                **parsed,
                "paragraphs": [
                    " ".join([str(parsed["title"]), *(parsed.get("paragraphs") or [])]).strip()
                ],
            }
            parsed.pop("title", None)
        parsed["_inlinePayload"] = True
        return prefix, parsed
    return statement, None


def split_leading_reading_payload(statement: str, parser: Any) -> tuple[str, dict[str, Any] | None]:
    """Move a passage that precedes a trailing reading command into support."""
    value = statement.replace("\r", "").strip()
    if len(value) < 180:
        return statement, None
    match = TRAILING_SUPPORT_COMMAND_RE.search(value)
    if not match or match.start() < 100:
        return statement, None
    body = value[: match.start()].strip()
    command = match.group("command").strip().rstrip(":").strip()
    if value[match.start() :].rstrip().endswith(":"):
        command += ":"
    if len(body) < 80 or len(command) < 12:
        return statement, None
    # A shared passage is already carried by ``active_support`` for this
    # question.  In that layout, a short quoted context such as
    # ``In lines 1–2 ... the word in bold`` is part of the command, not a
    # second support card.  Returning no split here preserves the complete
    # prompt while allowing the shared excerpt to remain attached.
    if re.match(r"^(?:In|On)\s+lines?\b", body, re.I) or re.search(
        r"\b(?:word|expression)\s+in\s+(?:bold|italics?|underline)|\bunderlined\s+word\b",
        body,
        re.I,
    ):
        return statement, None
    parsed = parse_support_blocks_with_range(body)
    if not parsed:
        parsed = {"paragraphs": [parser.repair_extraction(body)]}
    return command, parsed


def recover_statement_from_support(support: dict[str, Any], parser: Any) -> tuple[str, dict[str, Any] | None]:
    paragraphs = support.get("paragraphs") or []
    if not paragraphs:
        return "", support
    text = "\n\n".join(str(paragraph) for paragraph in paragraphs).strip()
    matches = list(EMPTY_STATEMENT_COMMAND_RE.finditer(text))
    if matches:
        match = matches[-1]
        prefix = text[:match.start()].strip(" \n\r\"'“”•–—")
        command = text[match.start():].strip(" \n\r\"'“”•–—")
        if prefix and command and len(command) >= 12:
            parsed_support = parse_support_blocks_with_range(prefix)
            if not parsed_support:
                parsed_support = {"paragraphs": [parser.repair_extraction(prefix)]}
            return command, parsed_support
    if len(paragraphs) == 1 and len(text) <= 320 and "?" in text:
        return text.lstrip("•–—").strip(), None
    return "", support


def support_applies_to_question(support: dict[str, Any] | None, number: int) -> bool:
    if not support:
        return True
    q_range = support.get("_range")
    if q_range:
        return q_range[0] <= number <= q_range[1]
    return True


def support_is_question_payload(support: dict[str, Any] | None) -> bool:
    if not support:
        return False
    text = "\n".join(str(part).strip() for part in (support.get("paragraphs") or [])).strip()
    if not text:
        return False
    if re.match(r"^(?:\(\s*\)|[IVX]+\s*[-–—.)]|\d{1,3}\s*[.)])", text, re.I):
        return True
    return bool(re.search(r"\b(?:choose|mark|assinale|marque|indique)\s+(?:the|a|o|a\s+opção|a\s+alternativa)", text, re.I)) and len(text) < 900


def support_starts_with_prose_question_word(support: dict[str, Any] | None) -> bool:
    """Guard against treating a short poem/prose line as a command."""
    if not support:
        return False
    first = str((support.get("paragraphs") or [""])[0]).strip()
    return bool(
        re.match(r"^(?:When|Where|Who|Why|How)\b", first, re.I)
        and not re.search(r"[?:]$", first)
    )


def needs_visual(record: dict[str, Any]) -> bool:
    # Only the question prompt is evidence that an image is required.  A
    # support passage may legitimately mention words such as "charge",
    # "cartoon" or "picture" in ordinary prose; treating those as visual
    # requirements quarantines otherwise valid reading questions.
    text = str(record.get("statement", ""))
    return bool(VISUAL_REFERENCE_RE.search(text))


def assignment_key(record: dict[str, Any]) -> str:
    section = str((record.get("provenance") or {}).get("sectionId") or record.get("subjectId") or "")
    return f"{section}:q{record.get('questionNumber')}"


def apply_visual_page_override(record: dict[str, Any]) -> None:
    page = VISUAL_PAGE_OVERRIDES.get(assignment_key(record))
    if not page:
        return
    provenance = record.setdefault("provenance", {})
    provenance["questionPage"] = page
    for evidence in record.get("quality", {}).get("evidence", []):
        if evidence.get("field") != "answer":
            evidence["page"] = page


def crop_and_attach_media(
    record: dict[str, Any],
    source_image: dict[str, Any],
    page: Any,
    page_number: int,
    image_index: int,
    rendered: Any,
    output_dir: Path,
) -> Any:
    """Render one semantic image crop and attach it to the question.

    The same crop may be attached to several questions that share a passage
    or tirinha.  The filename remains question-specific to keep provenance
    and cache invalidation deterministic.
    """
    scale_x = rendered.width / page.width
    scale_y = rendered.height / page.height
    # pdfplumber's image box is already the semantic boundary.  Do not add a
    # page-text margin: a few layouts place the question number immediately
    # above the artwork, and padding would leak that text into the crop.
    left = max(0, int(float(source_image["x0"]) * scale_x))
    top = max(0, int(float(source_image["top"]) * scale_y))
    right = min(rendered.width, int(float(source_image["x1"]) * scale_x))
    bottom = min(rendered.height, int(float(source_image["bottom"]) * scale_y))
    crop = rendered.crop((left, top, right, bottom)).convert("RGB")
    if crop.width < 24 or crop.height < 24:
        raise ValueError("recorte muito pequeno")
    digest = hashlib.sha256(crop.tobytes()).hexdigest()[:16]
    filename = f"{Path(str(record['id'])).name}-p{page_number}-{image_index}-{digest}.webp"
    path = output_dir / filename
    crop.save(path, format="WEBP", quality=82, method=6)
    record["media"] = [{
        "id": f"{record['id']}-visual-{image_index + 1}",
        "assetId": f"english-preview/{filename}",
        "assetUrl": f"/assets/english-preview/{filename}",
        "kind": "figure",
        "placement": "statement",
        "page": page_number,
        "crop": {
            "x": float(source_image["x0"]) / page.width,
            "y": float(source_image["top"]) / page.height,
            "width": float(source_image["width"]) / page.width,
            "height": float(source_image["height"]) / page.height,
        },
        "width": crop.width,
        "height": crop.height,
        "mimeType": "image/webp",
        "altText": f"Recorte visual da questão {record['questionNumber']}",
        "caption": "Recorte visual da questão",
        "hash": digest,
        "confidence": 0.98,
    }]
    return rendered


def attach_cropped_media(records: list[dict[str, Any]], pdf_path: Path, pdf_hash: str) -> None:
    output_dir = ROOT / "public" / "assets" / "english-preview"
    output_dir.mkdir(parents=True, exist_ok=True)
    by_page: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        if record.get("authorialRemoved") or record.get("quality", {}).get("status") == "rejected":
            continue
        apply_visual_page_override(record)
        key = assignment_key(record)
        if not needs_visual(record) and key not in VISUAL_IMAGE_ASSIGNMENTS:
            continue
        by_page[int(record["provenance"]["questionPage"])].append(record)

    with pdfplumber.open(str(pdf_path)) as document:
        for page_number, page_records in by_page.items():
            page = document.pages[page_number - 1]
            candidates = [
                image for image in page.images
                if not str(image.get("name", "")).startswith("X")
                and float(image.get("width", 0)) < 500
                and float(image.get("height", 0)) < 500
                and float(image.get("width", 0)) > 20
                and float(image.get("height", 0)) > 20
            ]
            visual_records = [record for record in page_records if needs_visual(record) or assignment_key(record) in VISUAL_IMAGE_ASSIGNMENTS]
            if not visual_records:
                continue
            explicit_records = [record for record in visual_records if assignment_key(record) in VISUAL_IMAGE_ASSIGNMENTS]
            explicit_pairs: list[tuple[dict[str, Any], dict[str, Any], int]] = []
            unresolved_explicit: list[dict[str, Any]] = []
            for record in explicit_records:
                expected_page, candidate_index = VISUAL_IMAGE_ASSIGNMENTS[assignment_key(record)]
                # A page override is also a guard against stale provenance.
                if expected_page != page_number:
                    continue
                if candidate_index < len(candidates):
                    explicit_pairs.append((candidates[candidate_index], record, candidate_index))
                else:
                    unresolved_explicit.append(record)
            for record in unresolved_explicit:
                record["quality"]["status"] = "quarantined"
                record["quality"]["warnings"].append("A questão solicita um elemento visual ausente no PDF; recorte oficial necessário.")

            remaining_records = [record for record in visual_records if record not in explicit_records]
            if len(candidates) == 0 and remaining_records:
                for record in remaining_records:
                    record["quality"]["status"] = "quarantined"
                    record["quality"]["warnings"].append("A questão solicita um elemento visual ausente no PDF; recorte oficial necessário.")
                continue

            left_text = page.crop((0, 0, page.width / 2, page.height)).extract_text() or ""
            right_text = page.crop((page.width / 2, 0, page.width, page.height)).extract_text() or ""

            col1_records: list[dict[str, Any]] = []
            col2_records: list[dict[str, Any]] = []
            for r in remaining_records:
                q_num = r["questionNumber"]
                q_marker = f"{q_num})"
                if q_marker in left_text and q_marker not in right_text:
                    col1_records.append(r)
                elif q_marker in right_text:
                    col2_records.append(r)
                else:
                    col1_records.append(r)

            col1_imgs = sorted([img for img in candidates if float(img.get("x0", 0)) < page.width / 2], key=lambda x: float(x.get("top", 0)))
            col2_imgs = sorted([img for img in candidates if float(img.get("x0", 0)) >= page.width / 2], key=lambda x: float(x.get("top", 0)))

            pairs: list[tuple[dict[str, Any], dict[str, Any], int]] = explicit_pairs

            if len(col1_records) == len(col1_imgs) and len(col1_records) > 0:
                for img, rec in zip(col1_imgs, col1_records):
                    pairs.append((img, rec, candidates.index(img)))
            elif len(col1_records) > 0:
                for rec in col1_records:
                    rec["quality"]["status"] = "quarantined"
                    rec["quality"]["warnings"].append("Há mais de um recorte visual possível na página; atribuição ambígua.")

            if len(col2_records) == len(col2_imgs) and len(col2_records) > 0:
                for img, rec in zip(col2_imgs, col2_records):
                    pairs.append((img, rec, candidates.index(img)))
            elif len(col2_records) > 0:
                for rec in col2_records:
                    rec["quality"]["status"] = "quarantined"
                    rec["quality"]["warnings"].append("Há mais de um recorte visual possível na página; atribuição ambígua.")

            rendered = None
            for source_image, record, image_index in pairs:
                try:
                    if rendered is None:
                        rendered = page.to_image(resolution=144).original
                    rendered = crop_and_attach_media(record, source_image, page, page_number, image_index, rendered, output_dir)
                except Exception as exc:
                    record["quality"]["status"] = "quarantined"
                    record["quality"]["warnings"].append(f"Falha ao gerar recorte visual: {exc}")


def attach_external_visual_corrections(records: list[dict[str, Any]]) -> None:
    """Attach pre-verified crops recovered from the official exam sources.

    Remote pages are recorded as provenance only.  Runtime data always points
    to a local asset so a release cannot fail because a third-party site is
    unavailable or changes its HTML.
    """
    output_dir = ROOT / "public" / "assets" / "english-preview"
    for record in records:
        correction = EXTERNAL_VISUAL_CORRECTIONS.get(assignment_key(record))
        if not correction or record.get("authorialRemoved"):
            continue
        asset_path = ROOT / "public" / "assets" / correction["assetId"]
        quality = record.setdefault("quality", {})
        warnings = [
            warning
            for warning in quality.get("warnings", [])
            if warning not in correction.get("clearsWarnings", ())
        ]
        if not asset_path.exists():
            quality["status"] = "quarantined"
            quality["warnings"] = [*warnings, "Recorte externo verificado não está disponível no pacote de release."]
            continue
        record["media"] = [{
            "id": f"{record['id']}-visual-external",
            "assetId": correction["assetId"],
            "assetUrl": correction["assetUrl"],
            "kind": "figure",
            "placement": "statement",
            "page": correction["sourcePage"],
            "crop": correction["crop"],
            "width": correction["width"],
            "height": correction["height"],
            "mimeType": "image/webp",
            "altText": f"Recorte visual da questão {record['questionNumber']}",
            "caption": "Recorte visual da questão",
            "source": correction["source"],
            "hash": correction["hash"],
            "confidence": 0.99,
        }]
        provenance = record.setdefault("provenance", {})
        provenance["externalVisualSource"] = {
            "url": correction["verificationUrl"],
            "page": correction["sourcePage"],
            "assetSource": correction["source"],
            "method": "official-exam-pdf",
        }
        quality["warnings"] = list(dict.fromkeys(warnings))
        quality["status"] = "verified" if not quality["warnings"] else quality.get("status", "warning")
        quality.setdefault("fieldConfidence", {})["media"] = {
            "confidence": 0.99,
            "method": "independent-pass",
        }


def apply_web_question_corrections(records: list[dict[str, Any]]) -> None:
    """Apply only corrections backed by an independently published key."""
    for record in records:
        correction = WEB_QUESTION_CORRECTIONS.get(assignment_key(record))
        if not correction or record.get("authorialRemoved"):
            continue
        answer = str(correction["correctLetter"]).upper()
        if not any(option.get("letter") == answer for option in record.get("options", [])):
            # Keep a malformed correction quarantined rather than hiding a
            # mismatch in a generated answer key.
            record.setdefault("quality", {}).setdefault("warnings", []).append(
                "Correção web não corresponde às alternativas impressas."
            )
            record["quality"]["status"] = "quarantined"
            continue
        quality = record.setdefault("quality", {})
        quality["warnings"] = [
            warning for warning in quality.get("warnings", [])
            if warning != "Gabarito não possui alternativa correspondente."
        ]
        record["correctLetter"] = answer
        record["options"] = [
            {**option, "correct": option.get("letter") == answer}
            for option in record.get("options", [])
        ]
        provenance = record.setdefault("provenance", {})
        provenance["webAnswerCorrection"] = {
            "originalAnswer": correction.get("originalAnswer"),
            "correctedAnswer": answer,
            "sources": correction["sources"],
            "method": "independent-pass",
        }
        quality.setdefault("fieldConfidence", {})["answer"] = {
            "confidence": 0.99,
            "method": "independent-pass",
        }
        quality["status"] = "verified" if not quality.get("warnings") else "warning"


def prune_orphaned_media(records: list[dict[str, Any]]) -> int:
    output_dir = ROOT / "public" / "assets" / "english-preview"
    if not output_dir.exists():
        return 0
    referenced = {
        Path(str(media.get("assetId", ""))).name
        for record in records
        if not record.get("authorialRemoved")
        for media in (record.get("media") or [])
        if media.get("assetId")
    }
    removed = 0
    for asset in output_dir.glob("*.webp"):
        if asset.name in referenced:
            continue
        asset.unlink()
        removed += 1
    return removed


def load_existing_fingerprints() -> dict[str, str]:
    path = ROOT / "src" / "data" / "englishQuestionBank.ts"
    if not path.exists():
        return {}
    source = path.read_text(encoding="utf-8")
    match = re.search(r"JSON\.parse\((.+?)\)\s+as QuestionBankItem\[\]", source, re.S)
    if not match:
        return {}
    try:
        records = json.loads(json.loads(match.group(1)))
    except (TypeError, ValueError, json.JSONDecodeError):
        return {}
    return {
        normalised_fingerprint(record): record.get("id", "")
        for record in records
        if len(normalised_fingerprint(record)) >= 40
    }


def deduplicate(records: list[dict[str, Any]], existing: dict[str, str]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    seen: dict[str, str] = {}
    canonical: list[dict[str, Any]] = []
    duplicates: list[dict[str, Any]] = []
    for record in records:
        if record.get("authorialRemoved") or record.get("quality", {}).get("status") == "rejected":
            continue
        fingerprint = normalised_fingerprint(record)
        if len(fingerprint) < 40:
            canonical.append(record)
            continue
        previous = seen.get(fingerprint) or existing.get(fingerprint)
        if previous:
            record["quality"] = {
                **record.get("quality", {}),
                "status": "quarantined",
                "warnings": [*record.get("quality", {}).get("warnings", []), f"Duplicata da questão canônica {previous}; mantida somente no manifesto."],
            }
            record["duplicateOf"] = previous
            duplicates.append(record)
        else:
            seen[fingerprint] = record["id"]
            canonical.append(record)
    return canonical, duplicates


def emit(
    records: list[dict[str, Any]],
    all_records: list[dict[str, Any]],
    sections: list[dict[str, Any]],
    pdf_hash: str,
    reconciliation: dict[str, Any],
) -> None:
    OUT_DATA.parent.mkdir(parents=True, exist_ok=True)
    OUT_DATA_DIR.mkdir(parents=True, exist_ok=True)
    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    # A support donor can be copied during range backfill after its first
    # normalization pass.  Normalize once more immediately before emission so
    # dates, citations and other metadata fragments cannot leak into the body
    # rendered by the UI.
    for record in all_records:
        if record.get("support"):
            record["support"] = sanitize_support(record["support"])
    records_by_section: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        section_id = str((record.get("provenance") or {}).get("sectionId") or record["subjectId"])
        records_by_section[section_id].append(record)
    all_by_section: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in all_records:
        section_id = str((record.get("provenance") or {}).get("sectionId") or record["subjectId"])
        all_by_section[section_id].append(record)
    for section in sections:
        section_records = all_by_section.get(section["sectionId"], [])
        statuses = [record.get("quality", {}).get("status") for record in section_records]
        section.update({
            "extracted": len(section_records),
            "verified": statuses.count("verified"),
            "warning": statuses.count("warning"),
            "quarantined": statuses.count("quarantined"),
            "rejected": statuses.count("rejected"),
            "duplicates": sum(1 for record in section_records if record.get("duplicateOf")),
        })
    loaders: list[str] = []
    for group in GROUPS:
        section_id = group["id"]
        name = "PREVIEW_" + re.sub(r"[^A-Za-z0-9]", "_", section_id).upper() + "_QUESTIONS"
        payload = json.dumps(records_by_section.get(section_id, []), ensure_ascii=False, indent=2)
        (OUT_DATA_DIR / f"{section_id}.ts").write_text(
            "// Gerado por src/scratch/import_english_preview.py.\n"
            "import type { QuestionBankItem } from '../questionBank';\n\n"
            f"export const {name}: QuestionBankItem[] = JSON.parse({json.dumps(payload, ensure_ascii=False)}) as QuestionBankItem[];\n",
            encoding="utf-8",
        )
        loaders.append(f"() => import('./englishPreview/{section_id}').then(module => module.{name})")
    OUT_DATA.write_text(
        "// Loader assíncrono do corpus Inglês Preview.\n"
        "import type { QuestionBankItem } from './questionBank';\n"
        + "export async function loadEnglishPreviewQuestions(): Promise<QuestionBankItem[]> {\n"
        + "  const loaders: Array<() => Promise<QuestionBankItem[]>> = [\n"
        + "    " + ",\n    ".join(loaders) + "\n"
        + "  ];\n"
        + "  const sections = await Promise.all(loaders.map(load => load()));\n"
        + "  return sections.flat();\n"
        + "}\n",
        encoding="utf-8",
    )
    visual_audit = [
        {
            "questionId": record["id"],
            "questionPage": record["provenance"].get("questionPage"),
            "status": record.get("quality", {}).get("status"),
            "assetIds": [media["assetId"] for media in record.get("media", [])],
            "warnings": record.get("quality", {}).get("warnings", []),
            "officialSourceRecovered": bool(record.get("provenance", {}).get("externalVisualSource")),
            "source": (record.get("provenance", {}).get("externalVisualSource") or {}).get("assetSource"),
        }
        for record in all_records
        if (needs_visual(record) or record.get("media")) and record.get("quality", {}).get("status") != "rejected"
    ]
    manifest = {
        "corpusId": "english_preview",
        "fileName": "Apostila de Inglês (CN, EPCAR, EAM, EsSA, EEAR, EsPCEx, AFA, EFOMM, EN e ITA) - Atualizada.pdf",
        "fileHash": pdf_hash,
        "totalPages": 394,
        "expectedQuestions": 2270,
        "detectedQuestions": len(all_records),
        "publishedQuestions": len(records),
        "expectedAnswerBlocks": 40,
        "editorialTotals": reconciliation,
        "sections": sections,
        "duplicateCount": sum(1 for record in all_records if record.get("duplicateOf")),
        "receivedPages": list(range(1, 395)),
        "processedPages": list(range(1, 395)),
        "reprocessedPages": [],
        "rejectedPages": [],
        "extractionMethods": {str(page): "native-text" for page in range(1, 395)},
        "questionCountDetected": len(all_records),
        "verifiedCount": sum(1 for r in records if r.get("quality", {}).get("status") == "verified"),
        "quarantinedCount": sum(1 for r in all_records if r.get("quality", {}).get("status") == "quarantined"),
        "rejectedCount": sum(1 for r in all_records if r.get("quality", {}).get("status") == "rejected"),
        "authorialRemovedCount": sum(1 for r in all_records if r.get("authorialRemoved")),
        "coverage": 1.0,
        "extractedMediaCount": sum(len(record.get("media", [])) for record in all_records),
        "visualAudit": visual_audit,
        "quality": {
            "verified": sum(1 for r in records if r.get("quality", {}).get("status") == "verified"),
            "warning": sum(1 for r in records if r.get("quality", {}).get("status") == "warning"),
            "quarantined": sum(1 for r in all_records if r.get("quality", {}).get("status") == "quarantined"),
            "rejected": sum(1 for r in all_records if r.get("quality", {}).get("status") == "rejected"),
        },
    }
    OUT_MANIFEST.write_text(
        "// Manifesto auditável do corpus Inglês Preview.\n"
        f"export const ENGLISH_PREVIEW_MANIFEST = {json.dumps(manifest, ensure_ascii=False, indent=2)} as const;\n",
        encoding="utf-8",
    )
    OUT_REPORT.write_text(json.dumps({**manifest, "rows": all_records}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# Auditoria do Inglês Preview",
        "",
        f"- Páginas contabilizadas: **{manifest['totalPages']}**",
        f"- Questões esperadas pelo PDF: **{manifest['expectedQuestions']}**",
        f"- Questões detectadas: **{manifest['detectedQuestions']}**",
        f"- Questões estudáveis após deduplicação: **{manifest['publishedQuestions']}**",
        f"- Blocos de gabarito: **{manifest['expectedAnswerBlocks']}**",
        f"- Reconciliação editorial: **{manifest['editorialTotals']['status']}** — {manifest['editorialTotals']['declared']['readingVocabulary']} leitura/vocabulário + {manifest['editorialTotals']['declared']['grammar']} gramática; {manifest['editorialTotals']['declared']['subjects']} assuntos; {manifest['editorialTotals']['declared']['exams']} provas",
        f"- Verificadas: **{manifest['quality']['verified']}**",
        f"- Com aviso: **{manifest['quality']['warning']}**",
        f"- Em quarentena: **{manifest['quality']['quarantined']}**",
        f"- Removidas por política autoral: **{manifest['authorialRemovedCount']}**",
        f"- Referências visuais auditadas: **{len(visual_audit)}** ({sum(bool(row['assetIds']) for row in visual_audit)} recortadas; {sum(not row['assetIds'] for row in visual_audit)} sem ativo comprovado)",
        "",
        "## Seções",
        "",
        "| Seção | Esperadas | Extraídas | Verificadas | Aviso | Duplicadas | Isoladas | Rejeitadas | Estado |",
        "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
    ]
    lines.extend(
        f"| {row['title']} (`{row['sectionId']}`) | {row['expected']} | {row['extracted']} | {row['verified']} | {row['warning']} | {row['duplicates']} | {row['quarantined']} | {row['rejected']} | {'OK' if row['complete'] else 'REVISAR'} |"
        for row in sections
    )
    lines.extend([
        "",
        "## Auditoria de imagens",
        "",
        "Somente figuras com associação inequívoca foram recortadas. Quando a arte foi recuperada de uma prova publicada, a fonte externa fica registrada na proveniência técnica; a interface mostra apenas a legenda curta.",
        "",
        "| Questão | Página | Estado | Ativo | Motivo |",
        "| --- | ---: | --- | --- | --- |",
    ])
    lines.extend(
        f"| `{row['questionId']}` | {row['questionPage'] or '—'} | {row['status']} | {'; '.join(row['assetIds']) if row['assetIds'] else '—'} | {'; '.join(row['warnings']) if row['warnings'] else '—'} |"
        for row in visual_audit
    )
    OUT_REPORT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser_args = argparse.ArgumentParser()
    parser_args.add_argument("pdf", nargs="?", type=Path, default=DEFAULT_PDF)
    args = parser_args.parse_args()
    if not args.pdf.exists():
        raise SystemExit(f"PDF não encontrado: {args.pdf}")
    reader = PdfReader(str(args.pdf))
    if len(reader.pages) != 394:
        raise RuntimeError(f"Esperadas 394 páginas, encontrado {len(reader.pages)}")
    pdf_hash = hashlib.sha256(args.pdf.read_bytes()).hexdigest()
    parser = load_legacy_parser()
    answers, answer_duplicates = parse_answer_keys(reader)
    all_records, sections = parse_groups(reader, parser, answers, pdf_hash)
    reconciliation = validate_editorial_totals(reader, all_records, sections, answers, answer_duplicates)
    apply_manual_record_fixes(all_records)
    authorial_removed = remove_authorial_questions(all_records)
    expected = reconciliation["declared"]["questions"]
    for record in all_records:
        record["provenance"]["sourceDocumentHash"] = pdf_hash
    attach_cropped_media(all_records, args.pdf, pdf_hash)
    # Resolve the small set of visual/answer ambiguities only after the local
    # PDF pass.  This keeps the normal importer offline and makes every web
    # correction explicit in provenance.
    attach_external_visual_corrections(all_records)
    apply_web_question_corrections(all_records)
    published, duplicates = deduplicate(all_records, load_existing_fingerprints())
    # Duplicates remain as provenance rows in the manifest but are removed
    # from the studyable corpus, including their image payloads.  This keeps
    # the asset directory and UI free of duplicate visual content.
    for duplicate in duplicates:
        duplicate["media"] = []
    pruned_media = prune_orphaned_media(all_records)
    published = [
        record for record in published
        if record.get("quality", {}).get("status") in {"verified", "warning"}
    ]
    emit(published, all_records, sections, pdf_hash, reconciliation)
    print(json.dumps({
        "pages": len(reader.pages),
        "expected": expected,
        "detected": len(all_records),
        "published": len(published),
        "answers": len(answers),
        "duplicates": len(duplicates),
        "authorialRemoved": authorial_removed,
        "orphanedMediaRemoved": pruned_media,
        "sectionsIncomplete": sum(1 for row in sections if not row["complete"]),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
