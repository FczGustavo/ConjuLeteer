"""Build the offline verb catalogue from a curated military-exam seed.

The PDFs determine the priority score, while the conjugation source supplies the
forms.  The generated TypeScript is committed so the application never needs a
network request for the Multi-Tempos session.
"""

from __future__ import annotations

import json
import re
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "lists"
OUTPUT = ROOT / "src" / "data" / "expandedVerbs.ts"

# Existing entries are intentionally kept in canonicalVerbs.ts.  This list is
# the second tier of the catalogue and is de-duplicated before generation.
VERBS = [
    # Alta incidência geral
    "ser", "estar", "ter", "haver", "fazer", "dizer", "trazer", "querer",
    "poder", "saber", "dar", "ir", "ler", "crer", "ouvir", "dormir", "sentir",
    "pedir", "medir", "mentir", "servir", "seguir", "conseguir", "cobrir",
    "descobrir", "fugir", "vestir", "investir", "despir", "repetir", "preferir",
    "ferir", "aderir", "advertir", "divertir", "rir", "sair",
    # Famílias derivadas de pôr, ver, vir, ter, fazer, dizer e trazer
    "propor", "supor", "dispor", "impor", "expor", "depor", "transpor", "antepor",
    "opor", "advir", "convir", "provir", "sobrevir", "revir", "antever", "entrever",
    "rever", "conter", "deter", "obter", "reter", "entreter", "sustentar", "abster",
    "ater", "refazer", "desfazer", "satisfazer", "perfazer", "contradizer", "predizer",
    "bendizer", "maldizer", "retrazer",
    # Verbos regulares recorrentes nos enunciados e comandos dos PDFs
    "aceitar", "acrescentar", "alcançar", "aparecer", "apoiar", "apresentar", "avaliar",
    "buscar", "começar", "chegar", "colocar", "conhecer", "construir", "continuar",
    "criar", "dever", "escolher", "escrever", "esperar", "explicar", "existir",
    "funcionar", "ganhar", "gostar", "guardar", "incluir", "indicar", "iniciar", "levar",
    "marcar", "mudar", "necessitar", "observar", "oferecer", "organizar",
    "participar", "passar", "pensar", "perder", "possuir", "praticar", "preparar",
    "procurar", "produzir", "reconhecer", "recordar", "responder", "resultar", "retirar",
    "salvar", "considerar", "significar", "tornar", "usar", "utilizar", "verificar", "voltar",
    "dominar", "empregar", "manter", "aprender", "viver", "vender", "receber", "partir",
    "decidir", "cumprir", "permitir", "assistir", "dividir", "falar", "estudar", "trabalhar",
]

EXISTING = {
    "por", "compor", "repor", "ver", "vir", "intervir", "prever", "prover", "manter",
    "reaver", "precaver", "caber", "valer", "imprimir", "abolir", "falar", "estudar",
    "trabalhar", "cantar", "amar", "chamar", "viver", "vender", "beber", "aprender",
    "correr", "receber", "partir", "decidir", "cumprir", "permitir", "assistir", "dividir",
}

IRREGULAR = {
    "ser", "estar", "ter", "haver", "fazer", "dizer", "trazer", "querer", "poder", "saber", "dar", "ir",
    "ler", "crer", "ouvir", "dormir", "sentir", "pedir", "medir", "mentir", "servir", "seguir", "conseguir",
    "cobrir", "descobrir", "fugir", "vestir", "investir", "despir", "repetir", "preferir", "ferir", "aderir",
    "advertir", "divertir", "rir", "sair", "propor", "supor", "dispor", "impor", "expor", "depor", "transpor",
    "antepor", "opor", "advir", "convir", "provir", "sobrevir", "revir", "antever", "entrever", "rever",
    "conter", "deter", "obter", "reter", "entreter", "sustentar", "abster", "ater", "refazer", "desfazer",
    "satisfazer", "perfazer", "contradizer", "predizer", "bendizer", "maldizer", "retrazer", "manter",
}
ANOMALO = {"ser", "ir"}
DEFECTIVE = {"falir", "colorir", "banir", "abolir"}
NO_IMPERATIVE: set[str] = set()

# Priberam lists accepted regional/orthographic variants for a few imperatives
# (notably ouvir and construir).  The application follows the Brazilian
# normative form used by the military worksheets, so these forms are selected
# explicitly instead of leaking a Portuguese variant into the table.
IMPERATIVE_OVERRIDES = {
    "ser": ["sê", "seja", "sejamos", "sede", "sejam"],
    "ir": ["vai", "vá", "vamos", "ide", "vão"],
    "dar": ["dá", "dê", "demos", "dai", "deem"],
    "estar": ["está", "esteja", "estejamos", "estai", "estejam"],
    "haver": ["há", "haja", "hajamos", "havei", "hajam"],
    "ouvir": ["ouve", "ouça", "ouçamos", "ouvi", "ouçam"],
    "construir": ["constrói", "construa", "construamos", "construí", "construam"],
    "querer": ["quer", "queira", "queiramos", "querei", "queiram"],
}

# Corrections required by the Brazilian orthographic/morphological standard.
# The upstream page is Portuguese and may also omit an isolated cell even for
# a non-defective verb.  Keeping the overrides here makes regeneration safe.
FORM_OVERRIDES = {
    ("antever", "indicativo_futuro_presente", "1p"): "anteveremos",
    ("estar", "indicativo_futuro_presente", "3p"): "estarão",
    ("fazer", "indicativo_futuro_preterito", "3p"): "fariam",
    ("ir", "indicativo_pret_imperfeito", "1p"): "íamos",
    ("ouvir", "indicativo_pret_perfeito", "3s"): "ouviu",
    ("pedir", "indicativo_futuro_presente", "1s"): "pedirei",
    ("perfazer", "subjuntivo_presente", "1s"): "perfaça",
    ("precaver", "indicativo_pret_mais_que_perfeito", "1p"): "precavêramos",
    ("precaver", "indicativo_pret_mais_que_perfeito", "2p"): "precavêreis",
    ("precaver", "subjuntivo_pret_imperfeito", "1p"): "precavêssemos",
    ("precaver", "subjuntivo_pret_imperfeito", "2p"): "precavêsseis",
    ("prover", "indicativo_pret_mais_que_perfeito", "1p"): "provêramos",
    ("prover", "indicativo_pret_mais_que_perfeito", "2p"): "provêreis",
    ("prover", "subjuntivo_pret_imperfeito", "1p"): "provêssemos",
    ("prover", "subjuntivo_pret_imperfeito", "2p"): "provêsseis",
    ("querer", "indicativo_futuro_preterito", "1s"): "quereria",
    ("querer", "indicativo_futuro_presente", "3p"): "quererão",
    ("ter", "subjuntivo_presente", "1s"): "tenha",
    ("valer", "indicativo_pret_mais_que_perfeito", "1p"): "valêramos",
    ("valer", "indicativo_pret_mais_que_perfeito", "2p"): "valêreis",
    ("valer", "subjuntivo_pret_imperfeito", "1p"): "valêssemos",
    ("valer", "subjuntivo_pret_imperfeito", "2p"): "valêsseis",
}

PERSONS = ["1s", "2s", "3s", "1p", "2p", "3p"]


def load_previous_entries() -> dict[str, dict]:
    """Use the last audited bundle only when an upstream page omits a cell."""
    path = ROOT / "src" / "data" / "expandedVerbs.ts"
    if not path.exists():
        return {}
    source = path.read_text(encoding="utf-8")
    payload = source.index("= [") + 2
    catalogue = json.loads(source[payload:].rstrip().removesuffix(";"))
    return {verb["id"]: verb for verb in catalogue}


PREVIOUS_ENTRIES = load_previous_entries()
PREVIOUS_FORMS = {verb_id: entry["conjugations"] for verb_id, entry in PREVIOUS_ENTRIES.items()}
TENSES = {
    "indicativo": "indicativo",
    "conjuntivo": "subjuntivo",
}
TITLE_KEYS = {
    "presente": "presente",
    "preterito perfeito": "pret_perfeito",
    "preterito imperfeito": "pret_imperfeito",
    "preterito mais que perfeito": "pret_mais_que_perfeito",
    "futuro": "futuro",
}


def fold(value: str) -> str:
    value = "".join(char for char in unicodedata.normalize("NFD", value) if unicodedata.category(char) != "Mn").lower()
    return re.sub(r"[-–—]+", " ", value)


def clean_form(value: str) -> str | None:
    value = re.sub(r"\s+", " ", value.replace("\xa0", " ")).strip()
    if not value or value in {"—", "–", "-", "*"} or fold(value) in {"nao se usa", "nao usado", "nao existe", "sem forma"}:
        return None
    return value


def brazilian_form(value: str | None) -> str | None:
    """Normalize variants that are obsolete or European in Brazilian exams."""
    if value is None:
        return None
    if value == "dêmos":
        return "demos"
    if value == "dêem":
        return "deem"
    # AO90 abolished the circumflex in the 3rd-person plural of crer, ler and
    # ver derivatives: creem, leem, reveem, anteveem, entreveem.
    value = value.replace("êem", "eem")
    return value


def find_wrapper(soup: BeautifulSoup, heading: str):
    target = fold(heading)
    heading_node = soup.find("h2", string=lambda text: bool(text and fold(text.strip()) == target))
    if not heading_node:
        raise RuntimeError(f"Seção ausente: {heading}")
    wrapper = heading_node.find_next_sibling("div")
    if not wrapper:
        raise RuntimeError(f"Bloco ausente: {heading}")
    return wrapper


def person_key(label: str) -> str | None:
    label = fold(label)
    if "eles" in label or "elas" in label or "voces" in label:
        return "3p"
    if "nos" in label:
        return "1p"
    if "vos" in label:
        return "2p"
    if "ele" in label or "ela" in label or "voce" in label:
        return "3s"
    if "tu" in label:
        return "2s"
    if "eu" in label:
        return "1s"
    return None


def row_entries(block) -> list[tuple[str | None, str | None]]:
    table = block.find("div", class_="dp-conj__wrapper")
    if not table:
        return []
    rows = table.find_all("div", class_="clearfix", recursive=False)
    entries: list[tuple[str | None, str | None]] = []
    for row in rows:
        clone = BeautifulSoup(str(row), "html.parser")
        person_nodes = clone.select(".ConjugaNumeroPessoa, .ConjugaImperativoNumeroPessoa")
        label = person_nodes[0].get_text(" ", strip=True) if person_nodes else ""
        # ``.Imperativo`` contains the actual form (for example ``seja``); only
        # the person labels must be removed from the cloned row.
        for selector in (".ConjugaNumeroPessoa", ".ConjugaImperativoNumeroPessoa"):
            for node in clone.select(selector):
                node.decompose()
        entries.append((person_key(label), clean_form(clone.get_text(" ", strip=True))))
    return entries


def titled_forms(wrapper, fallback: str | None = None) -> dict[str, list[str | None]]:
    result: dict[str, list[str | None]] = {}
    for block in wrapper.select(":scope > .dp-conj"):
        title = block.find("h5")
        key = fold(title.get_text(" ", strip=True)) if title else fallback
        if key:
            by_person: dict[str, list[str | None]] = {person: [] for person in PERSONS}
            for person, form in row_entries(block):
                if person:
                    by_person[person].append(form)
            # Some pages show an entry twice (regional/orthographic variants)
            # or omit vós for less-used verbs.  Keep the first accepted variant;
            # missing persons remain null and are completed only for regular verbs.
            result[key] = [by_person[person][0] if by_person[person] else None for person in PERSONS]
    return result


def fetch_verb(verb: str) -> dict:
    response = requests.get(f"https://dicionario.priberam.org/pt-pt/conjugar/{verb}", timeout=45)
    response.raise_for_status()
    response.encoding = "utf-8"
    soup = BeautifulSoup(response.text, "html.parser")

    indicative = titled_forms(find_wrapper(soup, "Indicativo"))
    subjunctive = titled_forms(find_wrapper(soup, "Conjuntivo"))
    conditional = titled_forms(find_wrapper(soup, "Condicional"), fallback="futuro")
    imperative = titled_forms(find_wrapper(soup, "Imperativo"))

    def get(source: dict[str, list[str | None]], key: str, label: str) -> list[str | None]:
        forms = source.get(key)
        if not forms or len(forms) != 6:
            raise RuntimeError(f"{verb}: paradigma incompleto em {label}: {forms}")
        return forms

    def person_table(forms: list[str | None]) -> dict[str, str | None]:
        return {**dict(zip(PERSONS, forms, strict=True)), "na": None}

    subj_present = get(subjunctive, "presente", "conjuntivo presente")
    indicative_present = get(indicative, "presente", "indicativo presente")
    if verb in NO_IMPERATIVE:
        imp_aff: list[str | None] = [None] * 5
    elif verb in IMPERATIVE_OVERRIDES:
        imp_aff = IMPERATIVE_OVERRIDES[verb]
    else:
        # Brazilian normative imperative: tu from the 3rd-person indicative,
        # the remaining persons from the present subjunctive, with vós taken
        # from the 2nd-person indicative minus its final -s.
        vós = indicative_present[PERSONS.index("2p")]
        tu = (
            indicative_present[PERSONS.index("3s")]
            if verb in IRREGULAR
            else indicative_present[PERSONS.index("2s")]
        )
        imp_aff = [
            tu if verb in IRREGULAR else (tu[:-1] if tu and tu.endswith("s") else tu),
            subj_present[PERSONS.index("3s")],
            subj_present[PERSONS.index("1p")],
            vós[:-1] if vós and vós.endswith("s") else vós,
            subj_present[PERSONS.index("3p")],
        ]
    imp_neg = [None if form is None else f"não {brazilian_form(form)}" for form in subj_present[1:]]

    conjugations_raw = {
        "indicativo_presente": indicative_present,
        "indicativo_pret_perfeito": get(indicative, "preterito perfeito", "indicativo pretérito perfeito"),
        "indicativo_pret_imperfeito": get(indicative, "preterito imperfeito", "indicativo pretérito imperfeito"),
        "indicativo_pret_mais_que_perfeito": get(indicative, "preterito mais que perfeito", "indicativo mais-que-perfeito"),
        "indicativo_futuro_presente": get(indicative, "futuro", "indicativo futuro"),
        "indicativo_futuro_preterito": get(conditional, "futuro", "condicional"),
        "subjuntivo_presente": subj_present,
        "subjuntivo_pret_imperfeito": get(subjunctive, "preterito imperfeito", "conjuntivo pretérito imperfeito"),
        "subjuntivo_futuro_subjuntivo": get(subjunctive, "futuro", "conjuntivo futuro"),
    }
    for key, table in conjugations_raw.items():
        for index, person in enumerate(PERSONS):
            table[index] = FORM_OVERRIDES.get((verb, key, person), brazilian_form(table[index]))
    # In Brazilian Portuguese, the 1st-person plural of the perfect tense in
    # -ar has no acute accent (falamos, verificamos), as prescribed by the ABL.
    perfect_1p = conjugations_raw["indicativo_pret_perfeito"][PERSONS.index("1p")]
    if verb.endswith("ar") and perfect_1p and perfect_1p.endswith("ámos"):
        conjugations_raw["indicativo_pret_perfeito"][PERSONS.index("1p")] = perfect_1p[:-4] + "amos"
    # Fill only the rare vós omission present in otherwise regular pages.  A
    # missing other person is retained as null for a genuinely defective verb.
    if verb not in DEFECTIVE:
        for key, table in conjugations_raw.items():
            previous = PREVIOUS_FORMS.get(verb, {}).get(key, {})
            for index, person in enumerate(PERSONS):
                if table[index] is None and previous.get(person) is not None:
                    table[index] = previous[person]
            if verb not in IRREGULAR:
                for index, person in enumerate(PERSONS):
                    if table[index] is None:
                        table[index] = regular_form(verb, key, person)
            if any(form is None for form in table):
                raise RuntimeError(f"{verb}: forma ausente em verbo não defectivo ({key}: {table})")
    indicative_present = conjugations_raw["indicativo_presente"]
    # Recompute the imperatives after restoring any isolated cells from the
    # previously audited bundle. Some source pages occasionally omit one
    # subjunctive person even though the verb is not defective (for example,
    # revir -> revenha); deriving before the fallback would propagate null.
    subj_present = conjugations_raw["subjuntivo_presente"]
    if verb in NO_IMPERATIVE:
        imp_aff = [None] * 5
    elif verb in IMPERATIVE_OVERRIDES:
        imp_aff = IMPERATIVE_OVERRIDES[verb]
    else:
        vós = indicative_present[PERSONS.index("2p")]
        tu = (
            indicative_present[PERSONS.index("3s")]
            if verb in IRREGULAR
            else indicative_present[PERSONS.index("2s")]
        )
        imp_aff = [
            tu if verb in IRREGULAR else (tu[:-1] if tu and tu.endswith("s") else tu),
            subj_present[PERSONS.index("3s")],
            subj_present[PERSONS.index("1p")],
            vós[:-1] if vós and vós.endswith("s") else vós,
            subj_present[PERSONS.index("3p")],
        ]
    imp_neg = [None if form is None else f"não {brazilian_form(form)}" for form in subj_present[1:]]

    conjugations = {
        "indicativo_presente": person_table(indicative_present),
        "indicativo_pret_perfeito": person_table(conjugations_raw["indicativo_pret_perfeito"]),
        "indicativo_pret_imperfeito": person_table(conjugations_raw["indicativo_pret_imperfeito"]),
        "indicativo_pret_mais_que_perfeito": person_table(conjugations_raw["indicativo_pret_mais_que_perfeito"]),
        "indicativo_futuro_presente": person_table(conjugations_raw["indicativo_futuro_presente"]),
        "indicativo_futuro_preterito": person_table(conjugations_raw["indicativo_futuro_preterito"]),
        "subjuntivo_presente": person_table(conjugations_raw["subjuntivo_presente"]),
        "subjuntivo_pret_imperfeito": person_table(conjugations_raw["subjuntivo_pret_imperfeito"]),
        "subjuntivo_futuro_subjuntivo": person_table(conjugations_raw["subjuntivo_futuro_subjuntivo"]),
        "imperativo_af_presente": person_table([None, *imp_aff]),
        "imperativo_neg_presente": person_table([None, *imp_neg]),
    }
    classification = "anomalo" if verb in ANOMALO else "irregular" if verb in IRREGULAR else "regular"
    return {
        "id": verb,
        "infinitive": verb,
        "primitiveRoot": verb,
        "conjugationGroup": 2 if verb.endswith("er") or verb.endswith("or") else 3 if verb.endswith("ir") else 1,
        "isIrregular": verb in IRREGULAR,
        "isDefective": verb in DEFECTIVE,
        "isAbundant": False,
        "classification": classification,
        "examTags": ["espcex", "eear", "afa", "efomm", "cn", "epcar"],
        "criticalTrapDescription": "Paradigma conferido em fonte lexicográfica; use as formas destacadas para evitar confusão de modo, tempo e pessoa.",
        "conjugations": conjugations,
    }


def pdf_texts() -> list[str]:
    texts: list[str] = []
    for path in sorted(PDF_DIR.glob("*.pdf")):
        reader = PdfReader(path)
        texts.append("\n".join(page.extract_text() or "" for page in reader.pages))
    return texts


def frequency(entry: dict, texts: list[str]) -> tuple[int, int]:
    forms = {fold(entry["infinitive"])}
    for table in entry["conjugations"].values():
        forms.update(fold(form.removeprefix("não ")) for form in table.values() if form and len(form.removeprefix("não ")) >= 3)
    forms = {form for form in forms if len(form) >= 3}
    total = 0
    documents = 0
    for text in texts:
        corpus = fold(text)
        found = sum(len(re.findall(rf"(?<![a-z]){re.escape(form)}(?![a-z])", corpus)) for form in forms)
        total += found
        documents += int(found > 0)
    return total, documents


def regular_form(verb: str, key: str, person: str) -> str | None:
    """Complete an omitted cell of a morphologically regular verb."""
    ending = verb[-2:]
    root = verb[:-2]
    if ending not in {"ar", "er", "ir"}:
        return None
    index = PERSONS.index(person)
    suffixes = {
        "indicativo_presente": {
            "ar": ["o", "as", "a", "amos", "ais", "am"],
            "er": ["o", "es", "e", "emos", "eis", "em"],
            "ir": ["o", "es", "e", "imos", "is", "em"],
        },
        "indicativo_pret_perfeito": {
            "ar": ["ei", "aste", "ou", "amos", "astes", "aram"],
            "er": ["i", "este", "eu", "emos", "estes", "eram"],
            "ir": ["i", "iste", "iu", "imos", "istes", "iram"],
        },
        "indicativo_pret_imperfeito": {
            "ar": ["ava", "avas", "ava", "ávamos", "áveis", "avam"],
            "er": ["ia", "ias", "ia", "íamos", "íeis", "iam"],
            "ir": ["ia", "ias", "ia", "íamos", "íeis", "iam"],
        },
        "indicativo_pret_mais_que_perfeito": {
            "ar": ["ara", "aras", "ara", "áramos", "áreis", "aram"],
            "er": ["era", "eras", "era", "êramos", "êreis", "eram"],
            "ir": ["ira", "iras", "ira", "íramos", "íreis", "iram"],
        },
        "subjuntivo_pret_imperfeito": {
            "ar": ["asse", "asses", "asse", "ássemos", "ásseis", "assem"],
            "er": ["esse", "esses", "esse", "êssemos", "êsseis", "essem"],
            "ir": ["isse", "isses", "isse", "íssemos", "ísseis", "issem"],
        },
    }
    if key == "indicativo_futuro_presente":
        return verb + ["ei", "ás", "á", "emos", "eis", "ão"][index]
    if key == "indicativo_futuro_preterito":
        return verb + ["ia", "ias", "ia", "íamos", "íeis", "iam"][index]
    if key == "subjuntivo_futuro_subjuntivo":
        return [verb, verb + "es", verb, verb + "mos", verb + "des", verb + "em"][index]
    if key == "subjuntivo_presente":
        if ending == "ar":
            subj_root = root[:-1] + "qu" if root.endswith("c") else root[:-1] + "gu" if root.endswith("g") else root[:-1] + "c" if root.endswith("ç") else root
            return subj_root + ["e", "es", "e", "emos", "eis", "em"][index]
        subj_root = root[:-1] + "ç" if root.endswith("c") else root
        return subj_root + ["a", "as", "a", "amos", "ais", "am"][index]
    suffix = suffixes.get(key, {}).get(ending)
    return root + suffix[index] if suffix else None


def main() -> None:
    candidates = [verb for verb in dict.fromkeys(VERBS) if verb not in EXISTING]
    texts = pdf_texts()
    entries: list[dict] = []
    failures: list[str] = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(fetch_verb, verb): verb for verb in candidates}
        for future in as_completed(futures):
            verb = futures[future]
            try:
                entry = future.result()
                count, documents = frequency(entry, texts)
                entry["pdfFrequency"] = count
                entry["pdfDocumentCount"] = documents
                entries.append(entry)
            except Exception as exc:  # noqa: BLE001 - report every failed candidate together
                previous_entry = PREVIOUS_ENTRIES.get(verb)
                if previous_entry is None:
                    failures.append(f"{verb}: {exc}")
                    continue
                entry = dict(previous_entry)
                count, documents = frequency(entry, texts)
                entry["pdfFrequency"] = count
                entry["pdfDocumentCount"] = documents
                entries.append(entry)
    if failures:
        raise SystemExit("Falhas ao gerar paradigmas:\n- " + "\n- ".join(sorted(failures)))
    for entry in entries:
        for (verb_id, tense, person), value in FORM_OVERRIDES.items():
            if entry["id"] == verb_id:
                entry["conjugations"][tense][person] = value
    entries.sort(key=lambda item: (-item["pdfFrequency"], item["infinitive"]))
    for index, entry in enumerate(entries):
        entry["studyPriority"] = "essencial" if index < 30 else "alta" if index < 75 else "complementar"
    OUTPUT.write_text(
        "import type { VerbEntry } from '../types/verbs';\n\n"
        "// Gerado por scripts/build_expanded_verbs.py. Formas lexicográficas são congeladas no bundle;\n"
        "// pdfFrequency serve apenas para priorização e não substitui a auditoria linguística.\n"
        f"export const EXPANDED_CANONICAL_VERBS: VerbEntry[] = {json.dumps(entries, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )
    print(f"Gerados {len(entries)} verbos adicionais a partir de {len(texts)} PDFs: total esperado >= {len(entries) + len(EXISTING)}")
    print("Mais recorrentes no corpus:")
    for entry in entries[:20]:
        print(f"- {entry['infinitive']}: {entry['pdfFrequency']} ocorrências em {entry['pdfDocumentCount']} PDFs")


if __name__ == "__main__":
    main()
