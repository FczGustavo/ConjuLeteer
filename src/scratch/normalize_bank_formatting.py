"""Normalize presentation artifacts in the imported question bank.

This is intentionally conservative: it only repairs markup/spacing artifacts
introduced by PDF text extraction and never changes options, answers or IDs.
"""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
BANK_PATH = ROOT / "src" / "data" / "questionBank.ts"

HEADER_RE = re.compile(
    r"^(?:Portugu[eê]s|Acentua[cç][aã]o|Estrutura(?:\s+da\s+palavra)?|"
    r"Novo acordo ortogr[aá]fico|S[ií]laba e fonemas|Processos de forma[cç][aã]o de palavras|"
    r"Verbos|Classes(?: de palavras)?|Pronomes|Sujeito|Sintaxe|Morfologia|"
    r"Significa[cç][aã]o|Empregos|Coloca[cç][aã]o pronominal)\b",
    re.I,
)

MANUAL_MARKS: dict[tuple[str, int, str], list[tuple[str, str]]] = {
    ("pdf_1_fonetica", 18, "statement"): [("alcançou recorde", "alcançou **recorde**"), ("prêmio Nobel", "prêmio **Nobel**")],
    ("pdf_1_fonetica", 19, "statement"): [("cassino", "**cassino**"), ("beije", "**beije**"), ("Cólquida", "**Cólquida**")],
    ("pdf_1_fonetica", 50, "statement"): [("o amador", "o **amador**"), ("desejar", "**desejar**"), ("desejada", "**desejada**")],
    ("pdf_1_fonetica", 71, "statement"): [("o ai", "o **ai**"), ("que voa", "que **voa**")],
    ("pdf_1_fonetica", 72, "statement"): [("doze reféns", "doze **reféns**"), ("os tréns", "os **tréns**"), ("armazéns", "**armazéns**")],
    ("pdf_1_fonetica", 73, "statement"): [("Tapsia", "**Tapsia**")],
    ("pdf_1_fonetica", 78, "statement"): [("abelha rainha", "**abelha rainha**")],
    ("pdf_1_fonetica", 81, "statement"): [("que a convidou", "que **a** convidou"), ("irem a casa", "irem **a casa**"), ("iriam a pé", "iriam **a pé**"), ("a casa fica", "a **casa** fica"), ("a poucos", "a **poucos**")],
    ("pdf_2_acentuacao", 70, "option:C"): [("é mesmo", "<u>é</u> mesmo")],
    ("pdf_2_acentuacao", 71, "option:B"): [("dádivas", "<u>dádivas</u>")],
    ("pdf_2_acentuacao", 71, "option:C"): [("equívoco", "<u>equívoco</u>")],
    ("pdf_2_acentuacao", 72, "option:A"): [("colérico", "<u>colérico</u>")],
    ("pdf_3_formacao", 63, "option:B"): [("notícia de que", "notícia <u>de que</u>")],
    ("pdf_3_formacao", 89, "option:B"): [("do remar", "do <u>remar</u>")],
    ("pdf_3_formacao", 89, "option:D"): [("a busca", "a <u>busca</u>")],
    ("pdf_3_formacao", 91, "option:A"): [("de livraria", "de <u>livraria</u>")],
    ("pdf_3_formacao", 91, "option:C"): [("a crueldade", "a <u>crueldade</u>")],
    ("pdf_3_formacao", 91, "option:D"): [("calma ferocidade", "calma <u>ferocidade</u>")],
    ("pdf_4_classes_var", 26, "option:A"): [("não o fez", "não <u>o</u> fez")],
    ("pdf_4_classes_var", 40, "option:A"): [("de fora", "<u>de fora</u>")],
    ("pdf_4_classes_var", 40, "option:C"): [("do mar", "<u>do mar</u>")],
    ("pdf_4_classes_var", 40, "option:E"): [("do brejo", "<u>do brejo</u>")],
    ("pdf_4_classes_var", 42, "option:A"): [("São muitos", "São <u>muitos</u>")],
    ("pdf_4_classes_var", 42, "option:B"): [("ninguém", "<u>ninguém</u>")],
    ("pdf_4_classes_var", 42, "option:E"): [("para nada", "para <u>nada</u>")],
    ("pdf_4_classes_var", 45, "option:C"): [("para se decidir", "para <u>se</u> decidir")],
    ("pdf_4_classes_var", 45, "option:D"): [("barcos se fazem", "barcos <u>se</u> fazem")],
    ("pdf_4_classes_var", 65, "option:B"): [("uns doze", "uns <u>doze</u>")],
    ("pdf_5_classes_invar", 1, "option:C"): [("Depois a", "Depois <u>a</u>")],
    ("pdf_5_classes_invar", 8, "option:A"): [("não o fez", "não <u>o</u> fez")],
    ("pdf_5_classes_invar", 18, "option:C"): [("pela primeira vez", "<u>pela primeira vez</u>")],
    ("pdf_5_classes_invar", 18, "option:E"): [("pobre tarde de homem", "<u>pobre tarde de homem</u>")],
    ("pdf_6_pronomes", 1, "option:C"): [("esperá-lo", "esperá-<u>lo</u>")],
    ("pdf_6_pronomes", 12, "option:E"): [("médico lhe", "médico <u>lhe</u>")],
    ("pdf_6_pronomes", 15, "option:B"): [("cancelar a linha", "cancelar a <u>linha</u>")],
    ("pdf_6_pronomes", 15, "option:D"): [("na época", "na <u>época</u>")],
    ("pdf_6_pronomes", 42, "option:D"): [("apoio da FAPERJ", "<u>apoio da FAPERJ</u>")],
    ("pdf_6_pronomes", 44, "option:C"): [("com que", "<u>com que</u>")],
    ("pdf_6_pronomes", 54, "option:B"): [("sociedade-que", "sociedade<u>-</u>que")],
    ("pdf_6_pronomes", 66, "option:C"): [("olhou-me", "olhou-<u>me</u>")],
    ("pdf_6_pronomes", 70, "option:B"): [("em que te achas", "em que <u>te</u> achas")],
    ("pdf_6_pronomes", 83, "option:A"): [("e isto", "e <u>isto</u>")],
    ("pdf_6_pronomes", 83, "option:C"): [("de semelhante", "de <u>semelhante</u>")],
    ("pdf_6_pronomes", 83, "option:E"): [("Foi esse", "Foi <u>esse</u>")],
    ("pdf_6_pronomes", 92, "option:E"): [("sabê-lo", "sabê-<u>lo</u>")],
    ("pdf_7", 10, "option:B"): [("ferira-me", "<u>ferira-me</u>")],
    ("pdf_7", 10, "option:E"): [("Estivera", "<u>Estivera</u>")],
    ("pdf_1_fonetica", 74, "statement"): [("da noite", "da <u>noite</u>"), ("tênues", "<u>tênues</u>"), ("de luar", "de <u>luar</u>")],
    ("pdf_6_pronomes", 66, "option:E"): [("informavam-me", "informavam-<u>me</u>")],
    ("pdf_6_pronomes", 68, "option:A"): [("me dirá", "<u>me</u> dirá")],
    ("pdf_6_pronomes", 68, "option:B"): [("integrou-se", "<u>integrou-se</u>")],
    ("pdf_6_pronomes", 68, "option:C"): [("acenando-lhe", "<u>acenando-lhe</u>")],
    ("pdf_6_pronomes", 68, "option:D"): [("fascinava-me", "fascinava-<u>me</u>")],
    ("pdf_6_pronomes", 68, "option:E"): [("Vi-a", "<u>Vi-a</u>")],
    ("pdf_7", 6, "readingText"): [("Bons tempos aqueles em que a família em férias, no extenso litoral brasileiro, escolhia para locar uma casa ou um resort por conta da proximidade com o mar, pelo acesso ao comércio e pelas belezas naturais ao redor.", "<u>Bons tempos aqueles em que a família em férias, no extenso litoral brasileiro, escolhia para locar uma casa ou um resort por conta da proximidade com o mar, pelo acesso ao comércio e pelas belezas naturais ao redor.</u>")],
    ("pdf_16", 5, "statement"): [("não impediu", "não **impediu**"), ("marujos recém-desembarcados gravassem", "marujos recém-desembarcados **gravassem**"), ("a seguir, imprimissem", "a seguir, **imprimissem**")],
    ("pdf_16", 14, "statement"): [("tempo fora", "tempo **fora**"), ("não fosse", "não **fosse**"), ("estaria", "**estaria**")],
    ("pdf_16", 20, "readingText"): [("avó, não só", "avó, ______ não só")],
    ("pdf_16", 28, "readingText"): [("Voltem logo", "**Voltem** logo"), ("pais exigem", "pais **exigem**"), ("que estejam", "que **estejam**"), ("não podem", "não **podem**")],
    ("pdf_17", 22, "statement"): [("formas verbais fazia", "formas verbais **fazia**"), ("eram e haverá", "**eram** e **haverá**")],
    ("pdf_17", 23, "statement"): [("“Perderíamos", "“**Perderíamos**")],
    ("pdf_17", 24, "option:A"): [("Dividimos", "<u>Dividimos</u>")],
    ("pdf_17", 24, "option:B"): [("Falaram", "<u>Falaram</u>")],
    ("pdf_17", 24, "option:C"): [("Pusemos", "<u>Pusemos</u>")],
    ("pdf_17", 24, "option:D"): [("Agrediram", "<u>Agrediram</u>")],
    ("pdf_17", 27, "statement"): [("Quando mais", "Quando ______ mais"), ("aviões, certamente, maior", "aviões, certamente, ______ maior")],
    ("pdf_4_classes_var", 23, "readingText"): [("das vitórias-régias", "das <u>vitórias-régias</u>")],
    ("pdf_16", 1, "statement"): [("ninguém nesse caso", "ninguém ______ nesse caso"), ("ele os documentos", "ele ______ os documentos"), ("a banca\nexaminadora", "a banca ______\nexaminadora")],
    ("pdf_17", 12, "statement"): [("se o resultado.", "se ______ o resultado."), ("ele aqui.", "ele ______ aqui.")],
}


def repair_bold_markers(value: str) -> str:
    positions = [m.start() for m in re.finditer(r"\*\*", value)]
    if len(positions) % 2:
        last = positions[-1]
        value = value[:last] + value[last + 2 :]
    # A single star is not a supported marker and is a common PDF residue.
    return re.sub(r"(?<!\*)\*(?!\*)", "", value)


def repair_markup(value: str) -> str:
    value = value.replace("</u</u>>", "</u></u>").replace("<</u>/u>", "</u></u>")
    value = re.sub(r"\*\*<u>([^<\n]*)\*?</u>\*?", r"<u>\1</u>", value)
    value = re.sub(r"\*\*<u>([^<\n]*)\*\*?</u>", r"<u>\1</u>", value)
    value = re.sub(r"<u>([^<\n]*)\*\*([^<\n]*)</u>([^*\n]*)\*\*", r"<u>\1\2</u>\3", value)
    value = re.sub(r"<u>([^<\n]*)</u>\*+([\wÀ-ÿ])", r"<u>\1\2</u>", value)
    value = re.sub(r"<u>([\s\S]*?)</u>", lambda m: f"<u>{m.group(1).replace('*', '')}</u>", value)
    value = re.sub(r"\bTexto\s+([IVX]+)<u>([^<\n]+)</u>", r"Texto \1\n\2", value)
    value = re.sub(r"\bTexto\s+([IVX]+)(?=[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ])", r"Texto \1\n", value)
    value = re.sub(r"(\d{1,2}\s*[§º°])(?=\S)", r"\1 ", value)
    value = re.sub(r"\beo\b", "e o", value)
    value = re.sub(r"\bea\b", "e a", value)
    value = re.sub(r"\beA\b", "e A", value)
    value = re.sub(r"\bEo\b", "E o", value)
    value = re.sub(r"\bEa\b", "E a", value)
    value = re.sub(r"\béa\b", "é a", value, flags=re.I)
    value = re.sub(r"\bu\s+mpronome\b", "um pronome", value, flags=re.I)
    value = re.sub(r"\bu\s+mverbo\b", "um verbo", value, flags=re.I)
    value = re.sub(r"\bE\s+muma\b", "Em uma", value)
    value = re.sub(r"\btransformar\s+se\b", "transformar-se", value, flags=re.I)
    value = re.sub(r"\bfiorescia\b", "florescia", value, flags=re.I)
    value = re.sub(r"\bfiores\b", "flores", value, flags=re.I)
    value = value.replace("Refiexo", "Reflexo").replace("Iogo", "logo").replace("Garlos", "Carlos")
    for bad, good in (
        ("previlégios", "privilégios"),
        ("herbâceas", "herbáceas"),
        ("fundamentaispara", "fundamentais para"),
        ("influênciadores", "influenciadores"),
        ("difinitivamente", "definitivamente"),
        ("serumano", "ser humano"),
        ("Balltico", "Báltico"),
        ("seestabelece", "se estabelece"),
        ("empurrandoo", "empurrando o"),
        ("retribuido", "retribuído"),
    ):
        value = value.replace(bad, good)
    value = re.sub(r"\b0 termo\b", "O termo", value)
    value = re.sub(r"J&€\s*0", "Já o", value, flags=re.I)
    value = re.sub(r"\s+¢€?\s+", " — ", value)
    value = re.sub(r"\s+€\s+(?=(?:formado|isso|contudo)\b)", " é ", value, flags=re.I)
    value = value.replace("†", "?")
    value = "\n".join(repair_bold_markers(line) for line in value.split("\n"))
    return value


def repair_reading(value: str) -> str:
    value = repair_markup(value)
    lines = value.split("\n")
    while len(lines) > 1 and HEADER_RE.match(lines[0].strip()) and len(lines[0].strip()) < 180:
        lines.pop(0)
    if len(lines) == 1:
        line = lines[0].strip()
        citation_at = re.search(r"\s(?=\()", line)
        if citation_at and HEADER_RE.match(line[: citation_at.start()].strip()):
            lines[0] = line[citation_at.start() + 1 :]
    # Keep source and a following command in different visual blocks.
    result: list[str] = []
    for line in lines:
        if re.match(r"^Fonte\b", line, re.I):
            line = re.sub(r"\s+(?=(?:Leia|Observe|Considere|Assinale|Marque|Julgue|Indique)\b)", "\n", line, count=1, flags=re.I)
        result.extend(re.split(r"\s+(?=\(?(?:Dispon[ií]vel|Acesso em:?)\b)", line, maxsplit=1, flags=re.I))
    return "\n".join(result)


def apply_manual_marks(question: dict) -> None:
    key = (question.get("listId"), question.get("questionNumber"))
    for (list_id, number, field), replacements in MANUAL_MARKS.items():
        if key != (list_id, number):
            continue
        if field == "statement":
            target = question.get("statement", "")
            for old, new in replacements:
                if old in target and new not in target:
                    target = target.replace(old, new, 1)
            question["statement"] = target
        elif field == "readingText":
            target = question.get("readingText", "")
            for old, new in replacements:
                if old in target and new not in target:
                    target = target.replace(old, new, 1)
            question["readingText"] = target
        elif field.startswith("option:"):
            letter = field.split(":", 1)[1]
            for option in question.get("options", []):
                if option.get("letter") != letter:
                    continue
                target = option.get("text", "")
                for old, new in replacements:
                    if old in target and new not in target:
                        target = target.replace(old, new, 1)
                option["text"] = target


def main() -> None:
    source = BANK_PATH.read_text(encoding="utf-8")
    marker = "export const QUESTION_BANK"
    start = source.index(" = ", source.index(marker)) + 3
    prefix, payload = source[:start], source[start:]
    data = json.loads(payload.rstrip().removesuffix(";"))
    for question in data:
        for field in ("statement",):
            question[field] = repair_markup(question.get(field, ""))
        for option in question.get("options", []):
            option["text"] = repair_markup(option.get("text", ""))
        if question.get("readingText"):
            question["readingText"] = repair_reading(question["readingText"])
        apply_manual_marks(question)
        key = (question.get("listId"), question.get("questionNumber"))
        if key == ("pdf_17", 23):
            question["statement"] = re.sub(
                r"“(Perderi\N{COMBINING ACUTE ACCENT}?amos|Perderíamos)",
                r"“**\1**",
                question["statement"],
                count=1,
            )
        if key == ("pdf_17", 27):
            question["statement"] = question["statement"].replace(
                "“Quando\nmais aperfeiçoados",
                "“Quando ______ mais aperfeiçoados",
            )
    BANK_PATH.write_text(prefix + json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"normalized {len(data)} questions")


if __name__ == "__main__":
    main()
