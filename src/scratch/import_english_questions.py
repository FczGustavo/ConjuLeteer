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
]


def repair_extraction(value: str) -> str:
    value = value.replace("\u00a0", " ").replace("\u2007", " ").replace("\u202f", " ")
    value = value.replace("\ufffd", "")
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
    value = re.sub(r"(?<=\w)\s*-(?=\s*\w)", "-", value)
    value = re.sub(r"(?<=\w)-\s+(?=\w)", "-", value)
    value = re.sub(r"[ \t]+", " ", value)
    return value.strip()


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
        if len(group) >= 3 and all(len(line) <= 105 for line in group) and all(not re.search(r"[.!?;:]$", line) for line in group):
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
    return bool(re.match(
        r"(?:What|Which|Who|Where|When|Why|How|According|In the text|The text|The author|Based on|It can be inferred|Choose|Mark|Indicate|Complete|Assinale|Indique|Marque|Leia|Observe|Considere|Julgue|Analise|Aponte|Em relação|De acordo|Na frase|O vocábulo|A palavra|A expressão|A principal|Infere-se|Para responder)",
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


def build_support(support_paragraphs: list[str], active: dict | None = None) -> dict | None:
    if not support_paragraphs:
        return active
    blocks = [repair_extraction(p) for p in support_paragraphs if p.strip()]
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
    if blocks and len(blocks[0]) <= 140 and not is_instruction(blocks[0]) and not is_source(blocks[0]):
        support["title"] = blocks.pop(0)
    if blocks and is_byline(blocks[0]):
        support["author"] = blocks.pop(0)
    if blocks and is_source(blocks[-1]):
        support["source"] = blocks.pop()
    support["paragraphs"] = blocks
    if not any(support.get(k) for k in ("label", "title", "author", "source")) and not support["paragraphs"]:
        return active
    return support


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
            boundary = re.search(r"\n\s*\n", option_text)
            if boundary:
                trailing = option_text[boundary.end():]
                option_text = option_text[:boundary.start()]
        option_text = repair_extraction(re.sub(r"\s+", " ", option_text))
        options.append({"letter": match.group(1).upper(), "text": option_text})
    return repair_extraction(statement), options, trailing


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
                next_support = build_support(paragraphs_from_text(trailing_text), active_support.get(subject_id))
                if next_support:
                    pending_support[subject_id] = next_support
                    active_support[subject_id] = next_support
        if support:
            support = json.loads(json.dumps(support, ensure_ascii=False))

        records.append({
            "id": f"{subject_id}-q{local_number}",
            "subjectId": subject_id,
            "subjectTitle": title,
            "listId": subject_id,
            "listTitle": title,
            "questionNumber": local_number,
            "support": support,
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
            "language": "en",
        })
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
        record["quality"] = {"status": "warning" if warnings else "verified", "warnings": warnings}


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
        f"export const ENGLISH_QUESTION_BANK: QuestionBankItem[] = JSON.parse({serialized_payload}) as QuestionBankItem[];\n",
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
            "correctLetter": record["correctLetter"],
            "optionCount": len(record["options"]),
            "quality": record["quality"],
        })
    OUT_JSON.write_text(json.dumps({"pdf": records[0]["provenance"]["pdf"], "count": len(records), "rows": rows}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    counts: dict[str, int] = {}
    for record in records:
        counts[record["subjectTitle"]] = counts.get(record["subjectTitle"], 0) + 1
    warnings = [row for row in rows if row["quality"]["status"] == "warning"]
    lines = [
        "# Auditoria do banco de Inglês",
        "",
        f"- Fonte: `{records[0]['provenance']['pdf']}`",
        f"- Questões importadas: **{len(records)}**",
        f"- Questões com `verified`: **{len(records) - len(warnings)}**",
        f"- Questões com `warning`: **{len(warnings)}**",
        f"- Gabaritos localizados nas páginas 190–196: **{sum(1 for row in rows if row['answerPage'])}**",
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
        "output": str(OUT_TS),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
