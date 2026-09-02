"""Import the military English question compilation into the native bank.

The PDF is a fixed, two-part book: 1,500 questions followed by a consolidated
answer key.  This importer deliberately does not call an LLM.  It extracts the
question records, associates each record with its topic/page, parses the answer
key, and emits a deterministic TypeScript data module plus an audit report.
"""

from __future__ import annotations

import argparse
import json
import re
from bisect import bisect_right
from pathlib import Path
from typing import Iterable

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_PDF = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")
OUT_TS = ROOT / "src" / "data" / "englishQuestionBank.ts"
OUT_JSON = ROOT / "reports" / "english-question-audit.json"
OUT_MD = ROOT / "reports" / "english-question-audit.md"


# Source pages are 1-based PDF pages.  The index in the book lists the exact
# counts and start page for every subdivision, which is more reliable than
# trying to infer a topic from a page footer after text extraction.
TOPICS = [
    ("english_adjectives_adverbs", "Adjectives and Adverbs", "Adjectives & Adverbs", 120, 2),
    ("english_pronouns", "Pronouns", "Pronouns", 150, 15),
    ("english_quantifiers_intensifiers", "Quantifiers and Intensifiers", "Quantifiers & Intensifiers", 35, 33),
    ("english_verbs", "Verbs", "Verbs", 180, 37),
    ("english_modal_auxiliaries", "Modal Auxiliaries", "Modal Auxiliaries", 75, 58),
    ("english_active_passive", "Active and Passive Voice", "Active & Passive Voice", 100, 67),
    ("english_direct_indirect", "Direct and Indirect Speech", "Direct & Indirect Speech", 35, 79),
    ("english_conditionals", "Conditionals", "Conditionals", 44, 84),
    ("english_question_tags", "Question Tags", "Question Tags", 20, 90),
    ("english_rejoinders", "Rejoinders", "Rejoinders", 6, 92),
    ("english_articles", "Articles", "Articles", 24, 93),
    ("english_plural_nouns", "Plural of the Nouns", "Plural of Nouns", 20, 96),
    ("english_genitive_case", "Genitive Case", "Genitive Case", 18, 99),
    ("english_numbers", "Numbers", "Numbers", 8, 101),
    ("english_prepositions", "Prepositions", "Prepositions", 90, 102),
    ("english_conjunctions", "Conjunctions", "Conjunctions", 125, 113),
    ("english_subjunctive_imperative_infinitive_gerund", "Subjunctive, Imperative, Infinitive and Gerund", "Subjunctive, Imperative, Infinitive & Gerund", 20, 129),
    ("english_phrasal_verbs", "Phrasal Verbs", "Phrasal Verbs", 18, 131),
    ("english_false_cognates", "False Cognate Words", "False Cognates", 18, 133),
    ("english_mixed_topics", "Mixed Topics", "Mixed Topics", 25, 135),
    ("english_idioms_vocabulary", "Idioms and Vocabulary", "Idioms & Vocabulary", 30, 139),
    ("english_synonyms_antonyms", "Synonyms and Antonyms", "Synonyms & Antonyms", 35, 143),
    ("english_reading_review", "Reading Skills and General Review", "Reading & General Review", 124, 148),
    ("english_translations", "Translations", "Translations", 180, 177),
]

TOPIC_BY_ID = {item[0]: item for item in TOPICS}
QUESTION_RE = re.compile(r"(?m)^\s*(\d{3})(?:\s*\|\s*|\.\s+)([^\n]*)")
OPTION_RE = re.compile(r"(?m)^\s*([a-fA-F])\s*\)\s*")
PAGE_FOOTER_RE = re.compile(r"Professor Jefferson Celestino da Costa\s*\d{1,3}", re.I)
AUTHORIAL_BOARD_RE = re.compile(
    r"(?:\bJFS\b|j(?:e|ef)f?erson\s+celestino|\bjerfeson\b|"
    r"(?:mateus\s+)?germano|cola\s+da\s+web|"
    r"quest[^\s]{0,3}\s+in[^\s]{0,3}dita|\bautoral\b)",
    re.I,
)


# pypdf correctly decodes the PDF's accented glyphs, but the text layer also
# contains a small, repeatable set of words split by a font span boundary.
# Repair only known extraction artefacts; ordinary spaces are never collapsed
# by a broad word-joining heuristic.
SPLIT_WORD_REPAIRS = [
    (r"\bt he\b", "the"), (r"\bT he\b", "The"), (r"\bth e\b", "the"),
    (r"\ban d\b", "and"), (r"\bAn d\b", "And"), (r"\bmo re\b", "more"),
    (r"\bse em\b", "seem"), (r"\bha ve\b", "have"), (r"\bfe el\b", "feel"),
    (r"\bsh ould\b", "should"), (r"\bwhic h\b", "which"), (r"\bwit h\b", "with"),
    (r"\bU niversity\b", "University"), (r"\bUn ited\b", "United"),
    (r"\bn ew\b", "new"), (r"\bb efore\b", "before"), (r"\bobj e cts\b", "objects"),
    (r"\bobj e cts\b", "objects"), (r"\bvio lent\b", "violent"), (r"\bra dio\b", "radio"),
    (r"\bg et\b", "get"), (r"\bfil ling\b", "filling"), (r"\bad ded\b", "added"),
    (r"\bth emselves\b", "themselves"), (r"\bb een\b", "been"), (r"\bplac es\b", "places"),
    (r"\baffe ct\b", "affect"), (r"\btheor ies\b", "theories"), (r"\bh e\b", "he"),
    (r"\bha s\b", "has"), (r"\bgoo d\b", "good"), (r"\bd o\b", "do"),
    (r"\bhav e\b", "have"), (r"\bwh ether\b", "whether"), (r"\bAltho ugh\b", "Although"),
    (r"\bint o\b", "into"), (r"\bT hese\b", "These"), (r"\bTh ese\b", "These"),
    (r"\bTho se\b", "Those"), (r"\bcountr ies\b", "countries"), (r"\bT he\b", "The"),
    (r"\breali ze\b", "realize"), (r"\balt ernatives\b", "alternatives"),
    (r"\bget ting\b", "getting"), (r"\bH owever\b", "However"), (r"\babo ut\b", "about"),
    (r"\bChan ces\b", "Chances"), (r"\bYo u\b", "You"), (r"\bsta rt\b", "start"),
    (r"\bo nce\b", "once"), (r"\bchildr en\b", "children"), (r"\bbo dy\b", "body"),
    (r"\bno t\b", "not"), (r"\bcontin ue\b", "continue"), (r"\bworki ng\b", "working"),
    (r"\bdev elop\b", "develop"), (r"\bAme ricans\b", "Americans"), (r"\btha n\b", "than"),
    (r"\bsp ecialist\b", "specialist"), (r"\bbusine ss\b", "business"), (r"\bt hat\b", "that"),
    (r"\bPerfe ct\b", "Perfect"), (r"\bF ive\b", "Five"), (r"\bbelie ve\b", "believe"),
    (r"\bcompan hias\b", "companhias"), (r"\bdepoi s\b", "depois"), (r"\bcontin ue\b", "continue"),
    (r"\bcompl eta\b", "completa"), (r"\bf orma\b", "forma"), (r"\bqu e\b", "que"),
    (r"\bi n\b", "in"), (r"\bQUALI TY\b", "QUALITY"), (r"\bf rom\b", "from"),
    (r"\bempl oyee\b", "employee"), (r"\bapre senta\b", "apresenta"),
    (r"\bprob lems\b", "problems"), (r"\bnewsp aper\b", "newspaper"),
    (r"\bprim arily\b", "primarily"), (r"\binforma tion\b", "information"),
    (r"\bdevelo ping\b", "developing"), (r"\bexpe cted\b", "expected"),
    (r"\batte mpted\b", "attempted"), (r"\bco mmunity\b", "community"),
    (r"\bchar les\b", "Charles"), (r"\binspecto r\b", "inspector"),
    (r"\bfinger print\b", "fingerprint"), (r"\bd ied\b", "died"), (r"\bb ad\b", "bad"),
    # Additional high-confidence font-span splits found while auditing all
    # 1,500 records.  These are individual lexical repairs, never a broad
    # "remove spaces" heuristic (which would corrupt legitimate phrases).
    (r"\bconductin g\b", "conducting"), (r"\bso mething\b", "something"),
    (r"\bprotein s\b", "proteins"), (r"\bsimpl e\b", "simple"),
    (r"\bgoal s\b", "goals"), (r"\bshap e\b", "shape"),
    (r"\bact ion\b", "action"), (r"\bBrita in\b", "Britain"),
    (r"\benjoyin g\b", "enjoying"), (r"\bSometime s\b", "Sometimes"),
    (r"\bsentenc e\b", "sentence"), (r"\bn uclear\b", "nuclear"),
    (r"\bsyndro me\b", "syndrome"), (r"\bobje cts\b", "objects"),
    (r"\bre late\b", "relate"), (r"\bp assed\b", "passed"),
    (r"\bsituation s\b", "situations"), (r"\bunles s\b", "unless"),
    (r"\bq uiet\b", "quiet"), (r"\bc orrect\b", "correct"),
    (r"\bc hallenged\b", "challenged"), (r"\bdrama tic\b", "dramatic"),
    (r"\ba lternative\b", "alternative"), (r"\bdoctor s\b", "doctors"),
    (r"\bac quisition\b", "acquisition"), (r"\bcritic s\b", "critics"),
    (r"\bhap pened\b", "happened"), (r"\brep lacement\b", "replacement"),
    (r"\bi nvite\b", "invite"), (r"\bre sponsible\b", "responsible"),
    (r"\bvirtu al\b", "virtual"), (r"\bjump ed\b", "jumped"),
    (r"\bc omplete\b", "complete"), (r"\bwith in\b", "within"),
    (r"\bthe refore\b", "therefore"), (r"\bp rocesses\b", "processes"),
    (r"\bg etting\b", "getting"), (r"\brestauran t\b", "restaurant"),
    (r"\brabbi t\b", "rabbit"), (r"\benoug h\b", "enough"),
    (r"\bgr eece\b", "Greece"), (r"\bjus tified\b", "justified"),
    (r"\bnum ber\b", "number"), (r"\bbe have\b", "behave"),
    (r"\bcorrec t\b", "correct"), (r"\bremarkabl e\b", "remarkable"),
    (r"\bcorre ct\b", "correct"), (r"\brail road\b", "railroad"),
    # Keep the genuine Portuguese phrase "por tal" ("for such") intact;
    # it was previously mistaken for the English noun "portal".
    (r"\bl eaders\b", "leaders"),
    (r"\bstoppe d\b", "stopped"), (r"\bre ceived\b", "received"),
    (r"\bdefr aud\b", "defraud"), (r"\bChar les\b", "Charles"),
    (r"\btellin g\b", "telling"), (r"\bancien t\b", "ancient"),
    (r"\bpeo ple\b", "people"), (r"\bdev elop\b", "develop"),
    (r"\bbe st\b", "best"), (r"\bab out\b", "about"),
    (r"\bab road\b", "abroad"), (r"\bp ercent\b", "percent"),
    (r"\bfound ing\b", "founding"), (r"\bg uiding\b", "guiding"),
    (r"\bacc urately\b", "accurately"), (r"\bRai ders\b", "Raiders"),
    (r"\bStan ford\b", "Stanford"), (r"\bbull ying\b", "bullying"),
    (r"\bElect ron\b", "Electron"), (r"\bd iscovered\b", "discovered"),
    (r"\bsh opper\b", "shopper"), (r"\bs talking\b", "stalking"),
    (r"\bconclud es\b", "concludes"), (r"\bpr ofessions\b", "professions"),
    (r"\bsubstitut ed\b", "substituted"), (r"\bdisgra ce\b", "disgrace"),
    (r"\bTol kien\b", "Tolkien"), (r"\bcurio us\b", "curious"),
    (r"\bin correctly\b", "incorrectly"), (r"\bcl osures\b", "closures"),
    (r"\bromance s\b", "romances"), (r"\bstay ed\b", "stayed"),
    (r"\brejecte d\b", "rejected"), (r"\bhe lped\b", "helped"),
    (r"\bmous e\b", "mouse"), (r"\bfinal ly\b", "finally"),
    (r"\ba lternativa\b", "alternativa"), (r"\bal ternativa\b", "alternativa"),
    (r"\bc ompletes\b", "completes"),
    (r"\bFortu nately\b", "Fortunately"), (r"\bcompl etes\b", "completes"),
    (r"\bEri c\b", "Eric"), (r"\bbea m\b", "beam"), (r"\bob ey\b", "obey"),
    (r"\bus ed\b", "used"), (r"\bcit y\b", "city"), (r"\bcyni cal\b", "cynical"),
    (r"\bmak e\b", "make"), (r"\bHig h\b", "High"), (r"\bth eir\b", "their"),
    (r"\blogistic ally\b", "logistically"), (r"\bar e\b", "are"),
    (r"\bb e\b", "be"), (r"\bissu e\b", "issue"), (r"\bpos ters\b", "posters"),
    (r"\blear n\b", "learn"), (r"\bintrig uing\b", "intriguing"),
    (r"\bDecembe r\b", "December"), (r"\brecoil s\b", "recoils"),
    (r"\bpla yers\b", "players"), (r"\bo ut\b", "out"), (r"\br ise\b", "rise"),
    (r"\bi dea\b", "idea"), (r"\br esearch\b", "research"), (r"\ba nd\b", "and"),
    (r"\bConcerto s\b", "Concertos"),
    # In the source, the following two English phrases lose a space inside
    # the article due to a font boundary; constrain the repair to their
    # unmistakable lexical context so Portuguese "a não" remains untouched.
    (r"\ba n account\b", "an account"), (r"\ba n answer\b", "an answer"),
    (r"\bYou re ally\b", "You're really"),
    # Portuguese command/alternative text has the same font-boundary issue;
    # keep accents intact while joining only the observed lexical fragments.
    (r"\bopçã o\b", "opção"), (r"\bconclu íram\b", "concluíram"),
    (r"\bmagisté rio\b", "magistério"), (r"\beducaçã o\b", "educação"),
    (r"\bcompanh ias\b", "companhias"), (r"\bvisi tado\b", "visitado"),
    (r"\bcomunica r-se\b", "comunicar-se"), (r"\bata ques\b", "ataques"),
    (r"\bp eri[óo]dico\b", "periódico"), (r"\bapr esenta\b", "apresenta"),
    (r"\bc orreta\b", "correta"), (r"\bdepa rtment\b", "department"),
    (r"\bPa raguai\b", "Paraguai"), (r"\bstud ent\b", "student"),
    (r"\bpo deria\b", "poderia"), (r"\batribu iu\b", "atribuiu"),
    (r"\bd octor\b", "doctor"), (r"\be ncontrando\b", "encontrando"),
    (r"\baproxim a\b", "aproxima"), (r"\bequip amentos\b", "equipamentos"),
    (r"\bextra ído\b", "extraído"), (r"\bmagisté rio\b", "magistério"),
    (r"\bc entury\b", "century"), (r"\balternativ a\b", "alternativa"),
    (r"\bp reenche\b", "preenche"), (r"\bpreen che\b", "preenche"),
    (r"\bpree nche\b", "preenche"), (r"\bcorre sponde\b", "corresponde"),
    (r"\bweathe r\b", "weather"), (r"\bactu al\b", "actual"),
    (r"\bsa ys\b", "says"), (r"\bt heir\b", "their"),
    (r"\bgovern ments\b", "governments"), (r"\baltern ativa\b", "alternativa"),
    (r"\bfil l\b", "fill"), (r"\bl ady\b", "lady"), (r"\bpod e\b", "pode"),
    (r"\bo pções\b", "opções"), (r"\bopta m\b", "optam"),
    (r"\bnã o\b", "não"), (r"\brefor ços\b", "reforços"),
    (r"\bfinancia l\b", "financial"), (r"\bdiscre etly\b", "discretely"),
    (r"\bcorretament e\b", "corretamente"), (r"\bcompu lsive\b", "compulsive"),
    (r"\bcanc elled\b", "cancelled"), (r"\bco mfortable\b", "comfortable"),
    (r"\bfiref ighter\b", "firefighter"), (r"\btr ustworthy\b", "trustworthy"),
    (r"\bfunçã o\b", "função"), (r"\btivess e\b", "tivesse"),
    (r"\bam ateur\b", "amateur"), (r"\bse curity\b", "security"),
    (r"\bco rridors\b", "corridors"), (r"\bquantid ade\b", "quantidade"),
    (r"\bespeci alista\b", "especialista"), (r"\bdifí cil\b", "difícil"),
    (r"\bscie ntists\b", "scientists"), (r"\btur tles\b", "turtles"),
    (r"\bpa ssado\b", "passado"), (r"\ba s palavras\b", "as palavras"),
    (r"\bJ ew\b", "Jew"),
    # Final pass from the visual audit of the English reading pages.  These
    # fragments are unambiguous font-span splits in the source PDF (the
    # surrounding wording confirms the joined lexical form).
    (r"\bkid s\b", "kids"), (r"\bw onders\b", "wonders"),
    (r"\bexamp le\b", "example"), (r"\bsens ors\b", "sensors"),
    (r"\batt ention\b", "attention"),
    (r"\bp erfect\b", "perfect"), (r"\bp eriod\b", "period"),
    (r"\bcommerci al\b", "commercial"), (r"\bs pirit\b", "spirit"),
    (r"\btwen ty\b", "twenty"), (r"\bpromi sed\b", "promised"),
    (r"\bpromis ed\b", "promised"), (r"\ba ppropriately\b", "appropriately"),
    (r"\bex plores\b", "explores"), (r"\bn ight\b", "night"),
    (r"\bou r\b", "our"),
]


def repair_extraction(value: str) -> str:
    value = value.replace("\u00a0", " ").replace("\u2007", " ").replace("\u202f", " ")
    value = value.replace("\ufffd", "")
    value = value.replace("\uf0e3", "©")
    value = value.replace("\u2016", "\"")
    # Normalize glued blanks in text while keeping intentional suffix blanks intact
    value = re.sub(r"effective_{2,}\s*_{2,}", "effective__________", value)
    # One isolated font glyph in the source is a cent-sign codepoint where
    # the printed page contains a dash ("and — yet").
    value = re.sub(r"\s*\u00a2\s*", " — ", value)
    value = re.sub(r"[ \t]+", " ", value)
    def preserve_case(match: re.Match[str], replacement: str) -> str:
        """Apply a lexical repair while preserving sentence/title casing."""
        compact = re.sub(r"\s+", "", match.group(0))
        if compact.isupper():
            return replacement.upper()
        if compact[:1].isupper():
            return replacement[:1].upper() + replacement[1:]
        return replacement.lower()

    for pattern, replacement in SPLIT_WORD_REPAIRS:
        value = re.sub(
            pattern,
            lambda match, replacement=replacement: preserve_case(match, replacement),
            value,
            flags=re.I,
        )
    value = re.sub(r"\s+([,.;:!?])", r"\1", value)
    # Join a hyphenated word only when the dash is attached to its left-hand
    # word.  Keep editorial separators such as ``word - word`` intact, and
    # preserve one-letter labels/grades such as ``D- por``.
    def join_hyphenated_word(match: re.Match[str]) -> str:
        left, right = match.group(1), match.group(2)
        if len(left) == 1 and left.isupper():
            return match.group(0)
        return f"{left}-{right}"

    value = re.sub(r"([A-Za-zÀ-ÿ]+)-[ \t]+([A-Za-zÀ-ÿ]+)(?!\s*\))", join_hyphenated_word, value)
    # The PDF frequently places a space before a hyphen because the dash and
    # the adjacent word were emitted by different font spans (``high
    # -fidelity``, ``off -the-grid``).  Join only multi-letter words; a
    # one-letter label followed by a dash is an editorial separator and must
    # remain untouched.
    value = re.sub(
        # ``word -ING`` is intentional source notation (the suffix is not a
        # hyphenated lexical word), so keep that space.  Likewise, an
        # em-dash-style ``own - and`` separator must not become ``own-and``.
        r"(?<![A-Za-zÀ-ÿ])([A-Za-zÀ-ÿ]{2,})[ \t]+-[ \t]*(?!ING\b|and\b)([A-Za-zÀ-ÿ]{2,})(?![A-Za-zÀ-ÿ])",
        r"\1-\2",
        value,
        flags=re.IGNORECASE,
    )
    value = re.sub(r"\bown-and\b", "own — and", value, flags=re.IGNORECASE)
    value = re.sub(r"\bChristie[’'\x92]s\b", "Christie's", value)
    value = value.replace("Christies", "Christie's")
    # Keep numeric values exactly as printed.  A previous workaround prefixed
    # every occurrence of 100/1m with a currency glyph, corrupting ordinary
    # percentages, counts and answer options.
    value = re.sub(r"[ \t]+", " ", value)
    return value.strip()


# Question headers in the source use a compact ``BOARD YEAR`` form.  A few
# institutions omit the space (``UNIRIO1995``), use a two-digit year
# (``ESPCEX 99``), or append the editorial marker ``ADAPTED``.  Keep this
# parser deliberately conservative: if a header does not contain a year we
# preserve its text as the board credit instead of guessing one.
EXAM_HEADER_RE = re.compile(
    r"^(?P<board>.*?)(?P<year>(?:19|20)\d{2}|\d{2})\s*$",
    re.IGNORECASE,
)
ADAPTED_SUFFIX_RE = re.compile(r"(?:\s*[–—-]\s*|\s+)ADAPTED\s*$", re.IGNORECASE)
ROLE_RE = re.compile(r"\b(?:CARGO|POSTO|FUN[CÇ][AÃ]O)\s*[:\-]\s*(?P<role>.+)$", re.IGNORECASE)

BOARD_NORMALIZATIONS = {
    "ESPCEX": "EsPCEx",
    "Espcex": "EsPCEx",
    "EOMM": "EFOMM",
    "EEAR": "EEAr",
    "IME/CG": "IME",
    "UECE/2ª FASE": "UECE",
    "UFV/PASES": "UFV",
    "PUCRIO": "PUC-Rio",
    "PUCPR": "PUC-PR",
    "PUCRS": "PUC-RS",
    "PUCSP": "PUC-SP",
    "PUCMG": "PUC-MG",
    "PUCCAMP": "PUCCAMP",
    "UFSCAR": "UFSCar",
}


def parse_exam_metadata(header: str, *, is_translation: bool = False) -> dict:
    """Return structured source credits without inventing missing metadata."""
    if is_translation:
        return {
            "board": "Compilação de concursos militares",
            "source": "pdf-section",
        }

    cleaned = repair_extraction(header)
    adapted = bool(ADAPTED_SUFFIX_RE.search(cleaned))
    if adapted:
        cleaned = ADAPTED_SUFFIX_RE.sub("", cleaned).strip()

    match = EXAM_HEADER_RE.match(cleaned)
    if not match:
        # This branch is audited and surfaced in the report.  It retains the
        # printed credit while making the missing year explicit.
        board = BOARD_NORMALIZATIONS.get(cleaned, cleaned)
        result = {"board": board, "source": "pdf-header"}
    else:
        board = match.group("board").strip(" -–—")
        raw_year = int(match.group("year"))
        # The only two-digit year in this PDF is ESPCEX 99.  Apply the usual
        # century window while retaining the printed value in ``banca``.
        year = raw_year + (1900 if raw_year >= 50 else 2000) if raw_year < 100 else raw_year
        role = None
        role_match = ROLE_RE.search(board)
        if role_match:
            role = role_match.group("role").strip()
            board = board[: role_match.start()].strip(" -–—")

        board = BOARD_NORMALIZATIONS.get(board, board)
        result = {"board": board, "year": year, "source": "pdf-header"}
        if role:
            result["role"] = role

    if adapted:
        result["adapted"] = True
    return result


def clean_lines(value: str) -> list[str]:
    """Remove book headers/footers while retaining meaningful blank lines."""
    value = PAGE_FOOTER_RE.sub("", value)
    value = re.sub(r"\n\s*\d{1,3}\s*(?=\n|$)", "\n", value)
    lines: list[str] = []
    for raw in value.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        line = repair_extraction(raw)
        if re.fullmatch(r"(?:1ST|2ND) Part(?:\s*\|\s*|\s+)?(?:Grammar Skills|Reading Skills)(?:\s*\|)?", line, re.I):
            continue
        if line in {"Grammar Skills", "Reading Skills", "and General Review", "Answers"}:
            continue
        if line and line.lower() in {topic[1].lower() for topic in TOPICS}:
            continue
        lines.append(line)
    # Trim runs of blank lines but keep one blank line as a paragraph boundary.
    result: list[str] = []
    blank = False
    for line in lines:
        if line:
            result.append(line)
            blank = False
        elif not blank:
            result.append("")
            blank = True
    while result and not result[0]:
        result.pop(0)
    while result and not result[-1]:
        result.pop()
    return result


def paragraphs_from_text(value: str) -> list[str]:
    lines = clean_lines(value)
    groups: list[list[str]] = []
    current: list[str] = []
    for line in lines:
        if line:
            current.append(line)
        elif current:
            groups.append(current)
            current = []
    if current:
        groups.append(current)
    paragraphs: list[str] = []
    for group in groups:
        # Preserve poetry/dialogue/numbered lists; ordinary visual line wraps
        # become one readable paragraph.
        short_line_group = (
            len(group) >= 4
            and all(len(line) <= 105 for line in group)
            and sum(len(line) for line in group) / len(group) <= 70
            and not all(re.search(r"[.!?;:]$", line) for line in group)
        )
        if (
            (len(group) >= 3 and all(len(line) <= 105 for line in group) and all(not re.search(r"[.!?;:]$", line) for line in group))
            or short_line_group
        ):
            paragraphs.append("\n".join(group))
        else:
            # Some PDF pages encode paragraph spacing only as a slightly
            # shorter line followed by a new sentence; pypdf consequently
            # returns one long group with no blank line.  Recover those
            # high-confidence visual boundaries without splitting ordinary
            # wrapped prose: a boundary needs a finished sentence, a new
            # paragraph starter, a short preceding line and enough content
            # before it to be a real paragraph.
            current: list[str] = []
            for line in group:
                if current:
                    previous = current[-1]
                    starter = re.match(
                        r"(?:The|This|That|These|Those|Up|In|He|She|It|They|And|But|However|Although|For|One|Another|Finally|According|Research|When|While|As|On|Meanwhile)\b",
                        line,
                        re.I,
                    )
                    accumulated = len(" ".join(current))
                    boundary = (
                        accumulated >= 160
                        and len(previous) <= 85
                        and bool(re.search(r"[.!?][\"'’”)]?$", previous))
                        and bool(starter)
                    )
                    if boundary:
                        paragraphs.append(repair_extraction(" ".join(current)))
                        current = []
                current.append(line)
            if current:
                paragraphs.append(repair_extraction(" ".join(current)))
    return [p for p in paragraphs if p]


def is_instruction(value: str) -> bool:
    plain = value.strip()
    # Long paragraphs beginning with a question word are usually prose (for
    # example, a lyric line beginning with "When"), not commands.  Keep the
    # command detector focused on short editorial directions.
    if len(plain) > 180:
        return False
    return bool(re.match(
        r"(?:What|Which|Who|Where|When|Why|How|According|In the text|In the context|The text|The author|Based on|It can be inferred|Choose|Mark|Indicate|Complete|The correct|The same|The underlined|Assinale|Indique|Marque|Leia|Observe|Considere|Julgue|Analise|Aponte|Em relação|De acordo|Na frase|No contexto|O espaço|Qual|A lacuna|As lacunas|O vocábulo|A palavra|A expressão|A principal|Infere-se|Para responder)",
        plain,
        re.I,
    ))


def is_byline(value: str) -> bool:
    words = value.split()
    return 2 <= len(words) <= 9 and not re.search(r"[.!?:;(),\d]", value) and all(
        w.lower() in {"a", "an", "and", "da", "de", "do", "dos", "das", "the", "of"}
        or w[:1].isupper() for w in words
    )


def is_source(value: str) -> bool:
    return bool(re.match(r"(?:Source|Fonte|Adapted|Disponível|Available|http|www\.)", value, re.I)
                or re.search(r"\b(?:adapted from|extracted from|the economist|time\.com|bbc|reuters)\b", value, re.I)
                or re.match(r"\([^\n]{2,180}\b(?:19|20)\d{2}\b[^\n]*\)$", value))


def is_redundant_support_instruction(value: str) -> bool:
    """Return true for a standalone reading direction, never for prose."""
    plain = re.sub(r"\s+", " ", value).strip()
    return bool(re.fullmatch(
        r"(?:Read(?:\s+the)?\s+(?:following\s+)?(?:text|excerpt|fragment|sentence|dialogue|lyrics)(?:\s+below|\s+that\s+follows)?|"
        r"Read\s+(?:this|the\s+following)\s+(?:sentence|dialogue|text|excerpt|fragment|lyrics)|"
        r"Read\s+the\s+sentence\s+below|"
        r"Observe(?:\s+the)?\s+(?:following\s+)?(?:text|fragment)?|"
        r"Consider\s+the\s+following(?:\s+text|\s+sentences)?|"
        r"Leia(?:\s+o\s+)?(?:texto|trecho|excerto|fragmento)|"
        r"Leia\s+atentamente(?:\s+o\s+seguinte\s+texto)?|"
        r"Para\s+responder\s+(?:à|a)\s+questão)\s*[:.]?",
        plain,
        re.I,
    ))


def clean_support_blocks(blocks: list[str]) -> list[str]:
    cleaned: list[str] = []
    for block in blocks:
        value = repair_extraction(block).strip()
        # The source PDF uses a replacement glyph for bullets separating the
        # excerpt from its command.  It is a visual separator, never part of
        # the support prose, so discard it only at a block boundary.
        value = re.sub(r"^[\uFFFD\u2013\u2014•]\s*", "", value)
        if not value or is_redundant_support_instruction(value):
            continue
        cleaned.append(value)
    return cleaned


def build_support(support_paragraphs: list[str], active: dict | None = None) -> dict | None:
    if not support_paragraphs:
        return active
    blocks = clean_support_blocks(support_paragraphs)
    if not blocks:
        return active
    support: dict = {"paragraphs": []}
    if re.fullmatch(r"Texto\s+[IVX]+", blocks[0], re.I):
        support["label"] = re.sub(r"^Texto", "TEXTO", blocks[0], flags=re.I)
        blocks = blocks[1:]
    # A reading title is sometimes followed immediately by its body in the
    # extracted text (the first heading in the PDF ends in a question mark).
    if blocks and len(blocks[0]) > 180:
        title_match = re.match(r"^(.{1,140}\?)(?:\s+)(.+)$", blocks[0])
        if title_match and not is_instruction(title_match.group(1)):
            support["title"] = title_match.group(1).strip()
            blocks[0] = title_match.group(2).strip()
    if (
        blocks
        and len(blocks[0]) <= 140
        and len(blocks[0].split()) <= 12
        and not re.search(r"[.!?;:]$", blocks[0])
        and not re.match(r"^[\"“']", blocks[0])
        and not is_instruction(blocks[0])
        and not is_source(blocks[0])
    ):
        support["title"] = blocks.pop(0)
    if blocks and is_byline(blocks[0]):
        support["author"] = blocks.pop(0)
    if blocks and is_source(blocks[-1]):
        support["source"] = blocks.pop()
    support["paragraphs"] = blocks
    # A bare URL/citation (common after a cartoon or image-only question) is
    # provenance, not a readable support excerpt.  Do not render it as an
    # empty support card; an already active passage may still be reused.
    if not support["paragraphs"]:
        # A citation/URL by itself identifies an image or a source page but
        # is not readable support.  In particular, it must not resurrect the
        # previous passage through ``active`` (which produced phantom cards
        # on image-only questions).
        return None
    return support


def sanitize_support(support: dict | None) -> dict | None:
    """Keep titles/body/source in separate fields for every rendered card.

    Some reading passages contain an ``Adapted from …`` line between two
    extracts.  Leaving that line in ``paragraphs`` makes the source look like
    prose and is especially confusing when the same passage is shared by many
    questions.  Move source-only blocks to the footer while retaining all
    original citations.
    """
    if not support:
        return None
    result = {key: value for key, value in support.items() if key in {"label", "title", "author"}}
    paragraphs: list[str] = []
    sources: list[str] = []
    existing_source = str(support.get("source") or "").strip()
    if existing_source:
        sources.append(existing_source)
    for block in support.get("paragraphs") or []:
        value = repair_extraction(str(block)).strip()
        if not value or is_redundant_support_instruction(value):
            continue
        if is_source(value):
            sources.append(value)
        else:
            # OCR often joins a byline and its citation into one line
            # (``By Author Adapted from https://…``).  Split at the citation
            # marker so the visible card keeps the byline/body hierarchy.
            embedded = re.search(r"\b(?:Adapted\s+from|Source|Fonte|Available|Dispon[íi]vel)\b|https?://|www\.", value, re.I)
            if embedded and embedded.start() > 0:
                prefix = value[:embedded.start()].strip(" -–—")
                citation = value[embedded.start():].strip()
                if prefix.lower().startswith("by ") and not result.get("author"):
                    result["author"] = prefix[3:].strip()
                elif prefix:
                    paragraphs.append(prefix)
                if citation:
                    sources.append(citation)
                continue
            paragraphs.append(value)
    if paragraphs:
        result["paragraphs"] = paragraphs
    if sources:
        # Preserve order and avoid duplicating an identical citation.
        result["source"] = "; ".join(dict.fromkeys(sources))
    return result if result.get("paragraphs") else None


def strip_statement_support_preamble(statement: str, has_support: bool) -> str:
    """Remove a redundant reading lead-in once the excerpt has its own card.

    Keep the actual command (for example, ``fill in the gaps`` or ``it may
    be inferred``); only the visual instruction to read a passage is removed.
    """
    if not has_support:
        return statement
    value = repair_extraction(statement).strip()
    if not value:
        return value
    # ``Read ... piece from extract 1 “...” It may be inferred that:``
    # repeats both the reading lead-in and a quotation already present in the
    # support card.  Preserve the operative command.
    command = re.search(
        r"\b(It\s+may\s+be\s+inferred\s+that:|It\s+is\s+correct\s+to\s+say\s+that:|"
        r"The\s+principal\s+idea\b[^:]*:)",
        value,
        re.I,
    )
    if command and re.match(r"(?:Read|Leia|Após\s+a\s+leitura)\b", value, re.I):
        return value[command.start():].strip()
    # Keep a useful suffix in compound commands such as "Read the text and
    # fill in the gaps..." while removing only the redundant first clause.
    compound = re.match(
        r"^(?:Read|Leia|Observe|Considere|Considerando)\b[^\n:]{0,180}?(?:\band\b|\be\b)\s+(.+)$",
        value,
        re.I | re.S,
    )
    if compound and len(compound.group(1).strip()) >= 8:
        result = compound.group(1).strip()
        return result[:1].upper() + result[1:] if result else result
    # Portuguese ``Após a leitura do texto, é ...`` has an operative
    # predicate after the comma; keep it and remove the boilerplate.
    after_reading = re.match(
        r"^Após\s+a\s+leitura\s+(?:do|da)\s+(?:texto|trecho),?\s*(.+)$",
        value,
        re.I | re.S,
    )
    if after_reading:
        result = after_reading.group(1).strip()
        return result[:1].upper() + result[1:] if result else result
    value = re.sub(
        r"^Leia\s+atentamente\s+todo\s+o\s+per[ií]odo\s+transcrito\s+abaixo,?\s*",
        "",
        value,
        flags=re.I,
    ).strip()
    # When a command was recovered from the support tail, the PDF can leave
    # its original ``Leia/Read ...:`` lead-in as a separate trailing block.
    # Remove that block while retaining the operative command before it.
    chunks = re.split(r"\n{2,}", value)
    if len(chunks) > 1:
        chunks = [
            chunk.strip()
            for chunk in chunks
            if not re.fullmatch(r"(?:Read|Leia|Observe)\b[\s\S]{0,180}?:?", chunk.strip(), re.I)
        ]
        value = "\n\n".join(chunk for chunk in chunks if chunk)
    # Standalone leads (the excerpt itself is now in support) should not
    # leave an empty-looking statement card.
    if is_redundant_support_instruction(value):
        return ""
    if value and value[0].islower():
        value = value[0].upper() + value[1:]
    return value


def split_support_command(support: dict) -> tuple[dict, str | None]:
    """Detach an instruction accidentally captured after a support excerpt."""
    paragraphs = list(support.get("paragraphs", []))
    if len(paragraphs) < 2:
        return support, None
    index = next(
        (i for i, paragraph in enumerate(paragraphs) if i > 0 and is_instruction(paragraph)),
        None,
    )
    if index is None:
        return support, None
    command = "\n\n".join(paragraphs[index:]).strip()
    support = {**support, "paragraphs": paragraphs[:index]}
    if not support["paragraphs"]:
        return {}, command
    return support, command


def support_is_instruction_only(support: dict) -> bool:
    paragraphs = support.get("paragraphs") or []
    if not paragraphs:
        return True
    return all(
        is_instruction(paragraph)
        or re.match(r"^(?:[IVX]+|\d{1,3})[.)]?\s", paragraph, re.I)
        for paragraph in paragraphs
    )


def promote_inline_support(statement: str) -> tuple[str, dict | None]:
    """Move a clearly delimited reading passage out of the question command.

    The English PDF has several pages where the support excerpt and the
    command share one text layer.  A blank line followed by ``�`` (the PDF's
    bullet glyph) or a known command starter is a high-confidence boundary.
    """
    value = statement.replace("\r", "").strip()
    if len(value) < 100:
        return statement, None
    starts_reading = bool(re.match(r"(?:Read|Leia|Observe|Consider|Considere|Considerando|Após\s+a\s+leitura)\b", value, re.I))
    # A bullet/dash is emitted between the excerpt and its question command.
    # Choose the last candidate whose suffix looks like an operative command;
    # this also handles commands beginning with "According", "The", "It"
    # and Portuguese interrogatives that were previously left in support.
    marker = None
    marker_candidates = list(re.finditer(r"\n\s*[\uFFFD\u2013\u2014•]\s*", value))
    command_starter = re.compile(
        r"(?:Which|What|Who|Where|When|Why|How|According|The|It|A|An|This|Fill|Complete|"
        r"Assinale|Indique|Marque|Em\s+relação|De\s+acordo|A\s+principal|Agora|No\s+contexto)\b",
        re.I,
    )
    for candidate in reversed(marker_candidates):
        prefix = value[:candidate.start()].strip()
        suffix = value[candidate.end():].strip()
        if len(prefix) >= 24 and len(suffix) >= 10 and command_starter.match(suffix):
            marker = candidate
            break
    if marker:
        body = value[:marker.start()].strip()
        command = value[marker.end():].strip()
        # For "Consider(e) a frase ..." records, only the quoted excerpt is
        # support; the surrounding sentence is an instruction and belongs to
        # the command area.
        if re.match(r"(?:Consider|Considere)\b", body, re.I):
            quoted = re.search(r"[\"“](.{20,260}?)[\"”]", body, re.S)
            if quoted:
                body = quoted.group(0)
        # Remove a leading reading direction from the excerpt side.
        if starts_reading and ":" in body.split("\n", 1)[0]:
            first_line, _, rest = body.partition("\n")
            head, excerpt = first_line.split(":", 1)
            body = (excerpt.strip() + ("\n" + rest if rest else "")).strip()
        if len(body) < 40 or len(command) < 10:
            return statement, None
        return command, build_support(paragraphs_from_text(body))
    if starts_reading:
        # Some Portuguese source pages end the reading instruction with a
        # period rather than a colon before the blank line that starts the
        # excerpt (``Leia o texto ... correta.``).
        header_match = re.search(r"(?:[:.]\s*)(?=\n|$)", value[:300])
        if header_match:
            command = value[: header_match.start() + 1].strip()
            body = value[header_match.end():].strip()
            if len(body) >= 80:
                body_paragraphs = paragraphs_from_text(body)
                instruction_index = next(
                    (i for i, paragraph in enumerate(body_paragraphs) if i > 0 and is_instruction(paragraph)),
                    None,
                )
                if instruction_index is not None:
                    support_body = "\n\n".join(body_paragraphs[:instruction_index])
                    command_body = "\n\n".join(body_paragraphs[instruction_index:])
                    parsed_support = build_support(paragraphs_from_text(support_body))
                    if parsed_support:
                        return command_body, parsed_support
                parsed_support = build_support(body_paragraphs)
                if parsed_support:
                    if support_is_instruction_only(parsed_support):
                        # A short image/cartoon prompt has no textual support;
                        # retain the complete prompt as the statement.
                        return statement, None
                    return command, parsed_support
    return statement, None


def choose_option_group(content: str) -> tuple[int, list[re.Match[str]]]:
    matches = list(OPTION_RE.finditer(content))
    if not matches:
        return -1, []
    starts = [idx for idx, match in enumerate(matches) if match.group(1).lower() == "a"]
    groups: list[tuple[int, list[re.Match[str]]]] = []
    for start in starts:
        # Some originals list six question words before presenting the actual
        # alternatives, and a handful of exams print alternatives out of
        # alphabetical order (a, b, c, e, d).  The final A marker is the
        # unambiguous beginning of the answer set; retain every marker after
        # it instead of requiring a perfect alphabetical sequence.
        end = starts[starts.index(start) + 1] if starts.index(start) + 1 < len(starts) else len(matches)
        group = matches[start:end]
        if len(group) >= 2:
            groups.append((start, group))
    if groups:
        # A few questions contain a preliminary a)-f) list followed by the
        # actual alternatives.  The final contiguous group is the answer set.
        return groups[-1]
    return 0, matches


def split_options(content: str) -> tuple[str, list[dict], str]:
    _, matches = choose_option_group(content)
    if not matches:
        return repair_extraction(content), [], ""
    first = matches[0].start()
    statement = content[:first]
    options: list[dict] = []
    trailing = ""
    for idx, match in enumerate(matches):
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(content)
        option_text = content[match.end():end]
        # Reading passages frequently begin after the last alternative in the
        # same extracted block.  A blank-line boundary is the reliable visual
        # separator; keep that tail for the next question's shared support.
        if idx == len(matches) - 1:
            # Prefer the explicit shared-text marker before normalizing
            # whitespace.  If we collapse the option first, the marker and
            # the passage heading lose their line structure and the support
            # parser can no longer recover a title (or may attach the passage
            # to the previous option).
            marker_boundary = re.search(r"\s+(?=Texto\s+para\s+(?:a|as)\s+quest)", option_text, re.I)
            boundary = marker_boundary or re.search(r"\n\s*\n", option_text)
            if boundary:
                trailing = option_text[boundary.start():].strip()
                option_text = option_text[:boundary.start()]
        option_text = repair_extraction(re.sub(r"\s+", " ", option_text))
        options.append({"letter": match.group(1).upper(), "text": option_text})
    return repair_extraction(statement), options, trailing


# The printed book uses real bold/underline spans for these targets, but a
# PDF text extraction exposes only the characters and drops the visual style.
# Keep the audit deterministic: targets are copied from the rendered source
# pages and are marked only in the field where the source places them.
EDITORIAL_HIGHLIGHTS: dict[tuple[str, int], list[tuple[str, str, str]]] = {
    ("english_adjectives_adverbs", 6): [("statement", "THE SMALLEST", "underline")],
    ("english_adjectives_adverbs", 7): [("statement", "MAIS INTERESSANTE", "underline")],
    ("english_adjectives_adverbs", 49): [("statement", "THE BEST", "underline"), ("statement", "THE NEWEST", "underline")],
    ("english_adjectives_adverbs", 54): [("support:1", "FASTER THAN", "bold")],
    ("english_pronouns", 31): [("support:2", "THE TITANIC", "underline"), ("support:2", "THE BABY OF OUR UPSTAIRS NEIGHBORS", "underline"), ("support:2", "MY PET", "underline")],
    ("english_pronouns", 61): [("statement", "ANY", "underline")],
    ("english_pronouns", 87): [("statement", "WHO", "underline")],
    ("english_pronouns", 88): [("statement", "THAT", "underline")],
    ("english_pronouns", 113): [("statement", "that", "underline")],
    ("english_quantifiers_intensifiers", 25): [("statement", "relatively small amount of heat", "bold")],
    ("english_verbs", 37): [("support:1", "led", "underline")],
    ("english_verbs", 92): [("option:A", "hope to capitalize", "underline"), ("option:B", "shall run", "underline"), ("option:C", "will face", "underline"), ("option:D", "expect a fight", "underline"), ("option:E", "is trying to pack", "underline")],
    ("english_verbs", 128): [("statement", "HAVE already CONVERGED", "underline")],
    ("english_verbs", 174): [("support:1", "had we known", "bold"), ("support:1", "would not have changed", "bold")],
    ("english_modal_auxiliaries", 53): [("statement", "might have occurred", "underline")],
    ("english_modal_auxiliaries", 55): [("statement", "MUST", "bold"), ("statement", "CAN", "bold")],
    ("english_modal_auxiliaries", 73): [("support:1", "must", "underline"), ("support:1", "can", "underline"), ("support:1", "may", "underline"), ("support:1", "should", "underline")],
    ("english_active_passive", 22): [("statement", "so that you can't be seen", "underline")],
    ("english_active_passive", 45): [("statement", "EPHEDRA HAS BEEN LINKED TO A NUMBER OF STROKES", "bold")],
    ("english_active_passive", 99): [("support:1", "I will tell someone to do it", "underline")],
    ("english_conditionals", 11): [("statement", "if you are otherwise healthy, just call your doctor", "underline")],
    ("english_conditionals", 25): [("statement", "If this dental dream becomes a reality, stem cells will be taken from the patient, cultured in a lab and then reimplanted under the gum in the patient's jaw where the tooth is missing.", "underline")],
    ("english_plural_nouns", 11): [("statement", "mouse and louse", "underline")],
    ("english_genitive_case", 9): [("statement", "THE BEHAVIOR OF DEPRESSED CHILDREN", "bold")],
    ("english_conjunctions", 2): [("statement", "DESPITE", "bold")],
    ("english_conjunctions", 8): [("support:1", "because", "bold")],
    ("english_conjunctions", 33): [("support:1", "even", "underline")],
    ("english_conjunctions", 51): [("support:1", "LIKE", "underline")],
    ("english_conjunctions", 74): [("support:1", "ALTHOUGH", "bold")],
    ("english_conjunctions", 75): [("statement", "BESIDES", "underline")],
    ("english_conjunctions", 92): [("statement", "according to", "underline")],
    ("english_conjunctions", 95): [("statement", "Inasmuch as", "bold")],
    ("english_conjunctions", 96): [("support:1", "for", "bold")],
    ("english_conjunctions", 111): [("statement", "but", "bold"), ("statement", "while", "bold")],
    ("english_conjunctions", 124): [("statement", "much-publicized", "bold"), ("statement", "shorter-term", "bold"), ("statement", "bus-only", "bold")],
    ("english_conjunctions", 125): [("support:1", "Hence", "underline")],
    ("english_subjunctive_imperative_infinitive_gerund", 19): [("option:A", "depending", "bold"), ("option:B", "Knowing", "bold"), ("option:C", "Using", "bold"), ("option:D", "finding", "bold"), ("option:E", "wondering", "bold")],
    ("english_phrasal_verbs", 17): [("support:2", "bought", "underline")],
    ("english_mixed_topics", 13): [("statement", "WINDS", "bold"), ("statement", "ITS", "bold")],
    ("english_idioms_vocabulary", 26): [("statement", "run a tight ship", "bold")],
    ("english_idioms_vocabulary", 30): [("support:1", "double-dip recession", "bold"), ("support:1", "silver bullets", "bold")],
    ("english_synonyms_antonyms", 1): [("statement", "peasant", "underline")],
    ("english_synonyms_antonyms", 2): [("statement", "deduced", "underline")],
    ("english_synonyms_antonyms", 8): [("statement", "overwhelmed", "underline")],
    ("english_synonyms_antonyms", 14): [("statement", "conducting", "bold"), ("statement", "harsh", "bold"), ("statement", "thrive", "bold")],
    ("english_synonyms_antonyms", 17): [("statement", "SKIFF", "underline"), ("statement", "EVASIVE", "underline"), ("statement", "THWARTED", "underline"), ("statement", "RAMPANT", "underline")],
    ("english_synonyms_antonyms", 18): [("statement", "hailed", "bold")],
    ("english_synonyms_antonyms", 20): [("statement", "hallmarks", "underline")],
    ("english_synonyms_antonyms", 22): [("statement", "cables", "bold"), ("statement", "tart", "bold")],
    ("english_synonyms_antonyms", 24): [("statement", "tough", "bold"), ("statement", "term", "bold"), ("statement", "subtle", "bold"), ("statement", "turn", "bold")],
    ("english_synonyms_antonyms", 26): [("statement", "entirely", "underline"), ("statement", "from a", "underline"), ("statement", "hazard", "underline"), ("statement", "approximately", "underline")],
    ("english_synonyms_antonyms", 27): [("statement", "reliably", "underline")],
    ("english_synonyms_antonyms", 28): [("support:1", "austere", "underline")],
    ("english_synonyms_antonyms", 29): [("support:1", "dons", "bold"), ("support:1", "the reins", "bold"), ("support:1", "hammered", "bold"), ("support:1", "championed", "bold")],
    ("english_synonyms_antonyms", 30): [("statement", "far", "underline")],
    ("english_synonyms_antonyms", 34): [("statement", "response", "underline")],
    ("english_synonyms_antonyms", 35): [("support:2", "perceptions", "underline")],
    ("english_reading_review", 8): [("statement", "receitas", "bold")],
    ("english_reading_review", 46): [("statement", "observadoras", "bold")],
    ("english_reading_review", 54): [("support:1", "on the verge of", "bold")],
    ("english_reading_review", 79): [("support:3", "cope", "bold"), ("support:3", "gauge", "bold"), ("support:3", "threatening", "bold"), ("support:3", "dire", "bold")],
    ("english_reading_review", 91): [("statement", "conducting", "bold"), ("statement", "harsh", "bold"), ("statement", "thrive", "bold")],
    ("english_reading_review", 95): [("statement", "used", "bold"), ("statement", "building", "bold")],
}


def normalize_question_blanks_and_statements(record: dict) -> None:
    """Normalize gap and blank formatting across statements."""
    qid = record["id"]
    statement = record["statement"]

    if qid == "english_adjectives_adverbs-q40":
        statement = statement.replace("| 1", "______ [1]")
        statement = statement.replace("| 2", "______ [2]")
        statement = statement.replace("| 3", "______ [3]")
        statement = statement.replace("| 4", "______ [4]")
        statement = statement.replace("| 5", "______ [5]")
    elif qid == "english_pronouns-q40":
        statement = statement.replace("changing (I) composition", "changing ______ [I] composition")
        statement = statement.replace("changing (II) teeth", "changing ______ [II] teeth")
    elif qid == "english_quantifiers_intensifiers-q18":
        statement = statement.replace("Would you like (I) pizza", "Would you like ______ [I] pizza")
        statement = statement.replace("Would you like (II) other thing", "Would you like ______ [II] other thing")
    elif qid == "english_verbs-q175":
        statement = statement.replace("dos verbos I e II.", "dos verbos ______ [I] e ______ [II].")
        statement = statement.replace('é III.', 'é ______ [III].')
    elif qid == "english_direct_indirect-q16":
        if not statement.endswith("______"):
            statement = re.sub(r":\s*$", ": ______", statement)
    elif qid == "english_direct_indirect-q29":
        statement = statement.replace("that (1) that much", "that ______ [1] that much")
        statement = statement.replace("said it (2) a dirty liar", "said it ______ [2] a dirty liar")
    elif qid == "english_direct_indirect-q30":
        statement = statement.replace("1. I told him:\n2. I didn't know:", "1. I told him: ______\n2. I didn't know: ______")
        if statement.endswith("2. I didn't know:"):
            statement = statement + " ______"
    elif qid == "english_numbers-q8":
        statement = statement.replace("leaves I.", "leaves ______ [I].")
        statement = statement.replace("goes II times.", "goes ______ [II] times.")
        statement = statement.replace("is III.", "is ______ [III].")
    elif qid == "english_conjunctions-q43":
        if not statement.endswith("______"):
            statement = re.sub(r":\s*$", ": ______", statement)
    elif qid == "english_conjunctions-q77":
        if not statement.endswith("______"):
            statement = re.sub(r":\s*$", ": ______", statement)
    elif qid == "english_conjunctions-q109":
        statement = statement.replace("Charles... Mary are brother... sister.", "Charles ______ Mary are brother ______ sister.")
    elif qid == "english_reading_review-q50":
        statement = statement.replace("“The microwave oven…”", "“The microwave oven…” ______")

    record["statement"] = statement


def mark_editorial_highlights(record: dict) -> None:
    """Restore source bold/underline spans lost by the PDF text layer."""
    targets = EDITORIAL_HIGHLIGHTS.get((record["subjectId"], record["questionNumber"]), [])
    if not targets:
        return

    def mark(value: str, target: str, style: str) -> tuple[str, bool]:
        if not value:
            return value, False
        # Whitespace in a target can cross a PDF line boundary.
        target_re = re.escape(target).replace(r"\ ", r"\s+")
        pattern = re.compile(rf"(?<![A-Za-zÀ-ÿ]){target_re}(?![A-Za-zÀ-ÿ])", re.I)
        wrapper = ("<u>" if style == "underline" else "**")
        closing = "</u>" if style == "underline" else "**"
        marked, count = pattern.subn(lambda match: f"{wrapper}{match.group(0)}{closing}", value)
        return marked, count > 0

    notes: list[dict[str, str]] = []
    for location, target, style in targets:
        if location == "statement":
            record["statement"], changed = mark(record["statement"], target, style)
        elif location.startswith("option:"):
            letter = location.split(":", 1)[1]
            option = next((item for item in record["options"] if item["letter"] == letter), None)
            if option:
                option["text"], changed = mark(option["text"], target, style)
            else:
                changed = False
        elif location.startswith("support:"):
            index = int(location.split(":", 1)[1]) - 1
            paragraphs = (record.get("support") or {}).get("paragraphs", [])
            if 0 <= index < len(paragraphs):
                paragraphs[index], changed = mark(paragraphs[index], target, style)
            else:
                changed = False
        else:
            changed = False
        if not changed:
            record.setdefault("quality", {"status": "warning", "warnings": []})["warnings"].append(
                f"Destaque editorial não localizado no campo {location}: {target}."
            )
        else:
            notes.append({"target": location.replace(":", ".paragraph:") if location.startswith("support:") else location, "reason": "marca visual conferida no PDF de origem"})
    if notes:
        record["emphasisNotes"] = notes


def topic_for_index(index: int) -> tuple[str, str, str, int]:
    cursor = 0
    for subject_id, title, short_title, count, _start_page in TOPICS:
        if cursor <= index < cursor + count:
            return subject_id, title, short_title, index - cursor + 1
        cursor += count
    raise IndexError(index)


def answer_key(reader: PdfReader) -> tuple[dict[tuple[str, int], str], dict[tuple[str, int], int]]:
    topic_lookup = {re.sub(r"[^a-z]", "", title.lower()): subject_id for subject_id, title, *_ in TOPICS}
    topic_lookup["quantifiersadintensifiers"] = "english_quantifiers_intensifiers"
    topic_lookup["quantifiersandintensifiers"] = "english_quantifiers_intensifiers"
    answers: dict[tuple[str, int], str] = {}
    pages: dict[tuple[str, int], int] = {}
    current: str | None = None
    pending_numbers: list[int] = []
    for page_number in range(190, 197):
        for raw in (reader.pages[page_number - 1].extract_text() or "").splitlines():
            # Answer pages contain compact runs such as ``B E C ...``.  Do
            # not run the lexical OCR-repair table here: entries like
            # ``b e`` are valid answer tokens and would otherwise collapse
            # two letters into a word (``BE``), shifting the key.  Only trim
            # layout whitespace and the repeated page footer.
            line = PAGE_FOOTER_RE.sub("", raw)
            line = re.sub(r"\s+", " ", line).strip()
            if not line or PAGE_FOOTER_RE.search(line):
                continue
            compact = re.sub(r"[^A-Za-z]", "", line).lower()
            if compact in topic_lookup:
                current = topic_lookup[compact]
                pending_numbers = []
                continue
            if current is None:
                continue
            if re.fullmatch(r"(?:\d{3}|-)(?:\s+(?:\d{3}|-)){1,9}", line):
                pending_numbers = [int(token) for token in line.split() if token != "-"]
                continue
            if pending_numbers and re.fullmatch(r"(?:[A-E]|-)(?:\s+(?:[A-E]|-)){1,9}", line, re.I):
                letters = [token.upper() for token in line.split() if token != "-"]
                for number, letter in zip(pending_numbers, letters):
                    answers[(current, number)] = letter
                    pages[(current, number)] = page_number
                pending_numbers = []
    return answers, pages


def question_page_from_offsets(offsets: list[int], position: int) -> int:
    # offsets are zero-based within the concatenated question pages, whose
    # first element is PDF page 2.
    return bisect_right(offsets, position) + 1


def parse_questions(reader: PdfReader) -> list[dict]:
    page_texts = [(reader.pages[i].extract_text() or "") for i in range(1, 189)]
    all_text = "\n\n".join(page_texts)
    page_offsets: list[int] = []
    cursor = 0
    for page_number, text in enumerate(page_texts, 1):
        page_offsets.append(cursor)
        cursor += len(text) + 2
    matches = list(QUESTION_RE.finditer(all_text))
    if len(matches) != 1500:
        raise RuntimeError(f"Expected 1500 question headers, found {len(matches)}")
    records: list[dict] = []
    active_support: dict[str, dict] = {}
    pending_support: dict[str, dict] = {}
    topic_first_match_index = 0
    topic_cursor = 0
    topic_first_match_index_by_id: dict[str, int] = {}
    for subject_id, _title, _short, count, _start_page in TOPICS:
        topic_first_match_index_by_id[subject_id] = topic_cursor
        topic_cursor += count
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(all_text)
        subject_id, title, short_title, local_number = topic_for_index(index)
        is_translation = subject_id == "english_translations"
        header_tail = match.group(2).strip()
        raw = (header_tail + "\n" if is_translation else "") + all_text[match.end():end]
        page = question_page_from_offsets(page_offsets, match.start())
        cleaned_raw = "\n".join(clean_lines(raw))
        statement_text, options, trailing_text = split_options(cleaned_raw)
        exam_metadata = parse_exam_metadata(header_tail, is_translation=is_translation)

        # Reading passages are shared by several questions.  A passage is the
        # long preamble before a command; once found, it is carried forward
        # until another passage starts.
        support = pending_support.pop(subject_id, None)
        if subject_id == "english_reading_review":
            # The first passage in a reading subdivision appears before the
            # first question header; subsequent passages are captured as the
            # tail of the preceding question block.
            if index == topic_first_match_index_by_id[subject_id]:
                page_start_offset = page_offsets[TOPIC_BY_ID[subject_id][4] - 2]
                initial_passage = all_text[page_start_offset:match.start()]
                support = build_support(paragraphs_from_text(initial_passage), support)
                if support:
                    active_support[subject_id] = support
            pre_end = cleaned_raw.find("a)") if "a)" in cleaned_raw else len(cleaned_raw)
            pre_paragraphs = paragraphs_from_text(cleaned_raw[:pre_end])
            instruction_index = next((i for i, paragraph in enumerate(pre_paragraphs) if is_instruction(paragraph)), None)
            if instruction_index is not None and instruction_index > 0:
                support = build_support(pre_paragraphs[:instruction_index], active_support.get(subject_id))
                active_support[subject_id] = support or active_support.get(subject_id)
                statement_text = repair_extraction("\n\n".join(pre_paragraphs[instruction_index:]))
            else:
                support = support or active_support.get(subject_id)
            if trailing_text.strip():
                trailing_blocks = paragraphs_from_text(trailing_text)
                next_support = build_support(trailing_blocks, active_support.get(subject_id))
                if next_support:
                    pending_support[subject_id] = next_support
                    active_support[subject_id] = next_support
                elif trailing_blocks and all(is_source(block) for block in clean_support_blocks(trailing_blocks)):
                    # A source-only line normally belongs to an image/cartoon
                    # question.  It is a boundary, not a continuation of the
                    # previous literary passage.
                    pending_support.pop(subject_id, None)
                    active_support.pop(subject_id, None)
        # Run this before falling back to a shared passage: a question may
        # contain its own quoted sentence/lyrics even when the preceding
        # question had an active support card (e.g. q14 and q122).
        statement_text, inline_support = promote_inline_support(statement_text)
        if inline_support:
            support = inline_support
        elif not support:
            support = None
        if support:
            support, captured_command = split_support_command(support)
            if captured_command:
                if is_redundant_support_instruction(statement_text):
                    statement_text = captured_command
                else:
                    statement_text = "\n\n".join(part for part in (captured_command, statement_text) if part).strip()
            if not support or support_is_instruction_only(support):
                # A question-specific instruction (or an image-only prompt)
                # is not a support passage.  Put it back in the statement and
                # suppress the empty/phantom support card.
                if support:
                    statement_text = "\n\n".join(
                        part for part in ("\n\n".join(support.get("paragraphs", [])), statement_text) if part
                    ).strip()
                support = None
        if support:
            statement_text = strip_statement_support_preamble(statement_text, True)
        if support:
            support = sanitize_support(support)

        record = {
            "id": f"{subject_id}-q{local_number}",
            "corpusId": "english_public",
            "subjectId": subject_id,
            "subjectTitle": title,
            "listId": subject_id,
            "listTitle": title,
            "questionNumber": local_number,
            "provenance": {
                "pdf": "1500 Questões de Inglês para Concursos Militares.pdf",
                "questionPage": page,
                "answerPage": 190,
            },
            "quality": {"status": "verified", "warnings": []},
            "statement": statement_text,
            "options": options,
            "correctLetter": "A",
            "banca": "Compilação de concursos militares" if is_translation else repair_extraction(header_tail),
            "examMetadata": exam_metadata,
            "language": "en",
        }
        if support:
            record["support"] = support
        records.append(record)
    return records


def validate_and_attach(records: list[dict], answers: dict[tuple[str, int], str], answer_pages: dict[tuple[str, int], int]) -> None:
    for record in records:
        key = (record["subjectId"], record["questionNumber"])
        answer = answers.get(key)
        warnings: list[str] = []
        if answer is None:
            warnings.append("Gabarito não localizado na seção Answers.")
        else:
            record["correctLetter"] = answer
            record["provenance"]["answerPage"] = answer_pages.get(key, 190)
        if len(record["options"]) not in (4, 5):
            warnings.append(f"Quantidade de alternativas extraídas: {len(record['options'])}.")
        if not record["statement"].strip():
            warnings.append("Enunciado vazio.")
        if answer and not any(option["letter"] == answer for option in record["options"]):
            warnings.append("Gabarito não possui alternativa correspondente.")
        # One source page repeats the printed "a)" marker for all five
        # alternatives.  The alternatives are visually distinct rows, so
        # restore their semantic labels in order (A–E) before attaching the
        # official key.  This keeps the displayed letters and answer mapping
        # usable while documenting the normalization in the importer itself.
        letters = [option["letter"] for option in record["options"]]
        if len(set(letters)) != len(letters) and len(record["options"]) in (4, 5):
            for index, option in enumerate(record["options"]):
                option["letter"] = chr(ord("A") + index)
        support_values = []
        if record.get("support"):
            support_values = [
                record["support"].get(key, "")
                for key in ("label", "title", "author", "source")
            ] + list(record["support"].get("paragraphs", []))
        all_text = " ".join([record["statement"], *(option["text"] for option in record["options"]), *support_values])
        if any(char in all_text for char in ("�", "†", "¢", "€")):
            warnings.append("Caractere corrompido detectado.")
        record["options"] = [
            {**option, "correct": option["letter"] == record["correctLetter"]}
            for option in record["options"]
        ]
        board_text = str(record.get("examMetadata", {}).get("board") or record.get("banca") or "")
        is_authorial = bool(AUTHORIAL_BOARD_RE.search(board_text))
        is_translation = record["subjectId"] == "english_translations"
        if is_authorial:
            record["authorialRemoved"] = True
            record["removalReason"] = "authorial-content"
            record["quality"] = {
                "status": "rejected",
                "warnings": [
                    "Questão autoral removida por política de direitos autorais; não é exibida nem estudável."
                ],
            }
            # Keep only the technical provenance and answer-key position; no
            # authorial prompt, alternatives or support is shipped to learners.
            record["statement"] = ""
            record["options"] = []
            record["support"] = None
            record["emphasisNotes"] = []
            continue
        if is_translation:
            warnings.append(
                "Publicação isolada: o PDF não informa banca/ano e a auditoria localizou frases idênticas em fontes lexicográficas de terceiros."
            )
            record["quality"] = {"status": "quarantined", "warnings": warnings}
        else:
            record["quality"] = {"status": "warning" if warnings else "verified", "warnings": warnings}
        normalize_question_blanks_and_statements(record)
        # Restore the visual spans only after structural validation so a
        # missing source target can never be hidden by the quality reset above.
        mark_editorial_highlights(record)
        editorial_warnings = record.get("quality", {}).get("warnings", [])
        if editorial_warnings:
            record["quality"] = {
                **record["quality"],
                "status": "warning" if record["quality"].get("status") == "verified" else record["quality"].get("status"),
                "warnings": list(dict.fromkeys(editorial_warnings)),
            }


def emit(records: list[dict]) -> None:
    OUT_TS.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    # Keep generated data readable and reviewable in git.  The type import is
    # the only executable code in this generated module.
    payload = json.dumps(records, ensure_ascii=False, indent=2)
    serialized_payload = json.dumps(payload, ensure_ascii=False)
    OUT_TS.write_text(
        "// Gerado por src/scratch/import_english_questions.py — fonte: PDF de 1.500 questões.\n"
        "import type { QuestionBankItem } from './questionBank';\n\n"
        "import { ENGLISH_QUESTION_MEDIA } from './englishQuestionMedia';\n\n"
        f"export const ENGLISH_QUESTION_BANK: QuestionBankItem[] = JSON.parse({serialized_payload}) as QuestionBankItem[];\n"
        "\n"
        "// Public English media is reviewed separately and merged by stable question id.\n"
        "for (const question of ENGLISH_QUESTION_BANK) {\n"
        "  const media = ENGLISH_QUESTION_MEDIA[question.id];\n"
        "  if (media) question.media = media;\n"
        "}\n",
        encoding="utf-8",
    )

    rows = []
    for record in records:
        rows.append({
            "id": record["id"],
            "subjectId": record["subjectId"],
            "subjectTitle": record["subjectTitle"],
            "questionNumber": record["questionNumber"],
            "questionPage": record["provenance"]["questionPage"],
            "answerPage": record["provenance"]["answerPage"],
            "banca": record["banca"],
            "examMetadata": record["examMetadata"],
            "correctLetter": record["correctLetter"],
            "optionCount": len(record["options"]),
            "authorialRemoved": bool(record.get("authorialRemoved")),
            "quality": record["quality"],
        })
    pdf_headers = sum(1 for record in records if record["examMetadata"]["source"] == "pdf-header")
    section_credits = sum(1 for record in records if record["examMetadata"]["source"] == "pdf-section")
    years = sum(1 for record in records if record["examMetadata"].get("year") is not None)
    roles = sum(1 for record in records if record["examMetadata"].get("role"))
    OUT_JSON.write_text(json.dumps({
        "pdf": records[0]["provenance"]["pdf"],
        "count": len(records),
        "metadata": {
            "pdfHeaderCredits": pdf_headers,
            "sectionCredits": section_credits,
            "years": years,
            "roles": roles,
        },
        "rows": rows,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    counts: dict[str, int] = {}
    for record in records:
        counts[record["subjectTitle"]] = counts.get(record["subjectTitle"], 0) + 1
    warnings = [row for row in rows if row["quality"]["status"] == "warning"]
    quarantined = [row for row in rows if row["quality"]["status"] == "quarantined"]
    rejected = [row for row in rows if row["quality"]["status"] == "rejected"]
    lines = [
        "# Auditoria do banco de Inglês",
        "",
        f"- Fonte: `{records[0]['provenance']['pdf']}`",
        f"- Questões importadas: **{len(records)}**",
        f"- Questões com `verified`: **{sum(1 for row in rows if row['quality']['status'] == 'verified')}**",
        f"- Questões com `warning`: **{len(warnings)}**",
        f"- Questões com `quarantined`: **{len(quarantined)}**",
        f"- Questões autorais removidas (`rejected`): **{len(rejected)}**",
        f"- Gabaritos localizados nas páginas 190–196: **{sum(1 for row in rows if row['answerPage'])}**",
        f"- Créditos de banca extraídos de cabeçalhos do PDF: **{pdf_headers}**",
        f"- Créditos de seção (sem banca/ano impressos): **{section_credits}**",
        f"- Anos identificados no PDF: **{years}**",
        f"- Cargos identificados no PDF: **{roles}**",
        "",
        "## Subdivisões",
        "",
        "| Assunto | Questões |",
        "| --- | ---: |",
    ]
    lines.extend(f"| {title} | {counts.get(title, 0)} |" for _id, title, _short, _count, _page in TOPICS)
    if warnings:
        lines.extend(["", "## Avisos", ""])
        lines.extend(f"- `{row['id']}`: {'; '.join(row['quality']['warnings'])}" for row in warnings)
    else:
        lines.extend(["", "Nenhuma inconsistência estrutural foi encontrada."])
    if quarantined:
        lines.extend([
            "",
            "## Itens isolados por proveniência e direitos autorais",
            "",
            f"Um total de **{len(quarantined)} questões** permanece em quarentena técnica e não é publicado no banco de estudos. Questões autorais são removidas separadamente (`rejected`) e mantidas apenas como posição técnica do manifesto.",
        ])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", nargs="?", type=Path, default=DEFAULT_PDF)
    args = parser.parse_args()
    if not args.pdf.exists():
        raise SystemExit(f"PDF não encontrado: {args.pdf}")
    reader = PdfReader(str(args.pdf))
    if len(reader.pages) != 197:
        raise RuntimeError(f"Esperadas 197 páginas, encontrado {len(reader.pages)}")
    answers, answer_pages = answer_key(reader)
    records = parse_questions(reader)
    validate_and_attach(records, answers, answer_pages)
    emit(records)
    print(json.dumps({
        "questions": len(records),
        "topics": len(TOPICS),
        "answers": sum(1 for record in records if (record["subjectId"], record["questionNumber"]) in answers),
        "warnings": sum(1 for record in records if record["quality"]["status"] == "warning"),
        "quarantined": sum(1 for record in records if record["quality"]["status"] == "quarantined"),
        "metadata": {
            "pdfHeaderCredits": sum(1 for record in records if record["examMetadata"]["source"] == "pdf-header"),
            "sectionCredits": sum(1 for record in records if record["examMetadata"]["source"] == "pdf-section"),
            "years": sum(1 for record in records if record["examMetadata"].get("year") is not None),
            "roles": sum(1 for record in records if record["examMetadata"].get("role")),
        },
        "output": str(OUT_TS),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
