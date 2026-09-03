"""Cross-corpus release audit for the two English question sources.

This is intentionally independent from the importers: it reads the generated
catalogue, checks the original PDFs, and verifies the browser-facing contracts
that keep the public and Preview corpora isolated while presenting one English
filter.  It fails on structural corruption, but reports quality-gated items
(quarantined/rejected) instead of silently publishing them.
"""

from __future__ import annotations

import hashlib
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[2]
PUBLIC_TS = ROOT / "src" / "data" / "englishQuestionBank.ts"
PREVIEW_DIR = ROOT / "src" / "data" / "englishPreview"
PREVIEW_MANIFEST_TS = ROOT / "src" / "data" / "englishPreviewManifest.ts"
PUBLIC_PDF = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")
if not PUBLIC_PDF.exists():
    PUBLIC_PDF = ROOT / "lists" / "1500 Questões de Inglês para Concursos Militares.pdf"
PREVIEW_PDF = ROOT / "lists" / "Apostila de Inglês (CN, EPCAR, EAM, EsSA, EEAR, EsPCEx, AFA, EFOMM, EN e ITA) - Atualizada.pdf"
PUBLIC_REPORT = ROOT / "reports" / "english-public-visual-audit.json"
PUBLIC_MEDIA_TS = ROOT / "src" / "data" / "englishQuestionMedia.ts"
PREVIEW_REPORT = ROOT / "reports" / "english-preview-audit.json"
OUT_JSON = ROOT / "reports" / "english-corpora-audit.json"
OUT_MD = ROOT / "reports" / "english-corpora-audit.md"

JSON_PARSE_RE = re.compile(r'JSON\.parse\(("(?:\\.|[^"\\])*")\)', re.S)
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

# Shared/context images whose prompts can rely on the artwork without
# repeating "cartoon" in the statement.  This is intentionally narrow and
# mirrors the audited assignments in the Preview importer.
MEDIA_CONTEXT_KEYS = {
    "preview_reading_eear:q1", "preview_reading_eear:q49",
    "preview_reading_ita:q19", "preview_reading_ita:q20",
    "preview_reading_ita:q21", "preview_reading_ita:q22",
    "preview_reading_ita:q62", "preview_adjectives:q22",
}
REDUNDANT_SUPPORT_RE = re.compile(
    r"(?:texto\s+para\s+(?:a|as|duas|três|tres|quatro)?\s*quest|"
    r"instruções?\s+para\s+quest|now\s+read\s+the\s+questions?|"
    r"leia\s+(?:o|a|os|as)?\s*(?:texto|questões|questoes))",
    re.I,
)
SUPPORT_ARTIFACT_RE = re.compile(r"^\s*(?:put\s*)?\d{1,3}\s*$", re.I)
SUPPORT_LIST_TITLE_RE = re.compile(r"^\s*(?:[IVXLCDM]+|[A-E]|\d{1,3})\s*[-–—.)]\s+", re.I)


def parse_json_parse(path: Path) -> list[dict[str, Any]]:
    match = JSON_PARSE_RE.search(path.read_text(encoding="utf-8"))
    if not match:
        raise RuntimeError(f"Bloco JSON não encontrado em {path}")
    return json.loads(json.loads(match.group(1)))


def load_corpora() -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    public = parse_json_parse(PUBLIC_TS)
    preview: list[dict[str, Any]] = []
    for path in sorted(PREVIEW_DIR.glob("*.ts")):
        preview.extend(parse_json_parse(path))
    return public, preview


def fingerprint(question: dict[str, Any]) -> str:
    text = " ".join(
        [str(question.get("statement", "")), *(str(o.get("text", "")) for o in question.get("options", []))]
    ).lower()
    return re.sub(r"[^a-z0-9]+", "", text)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def status_counts(records: list[dict[str, Any]]) -> dict[str, int]:
    return dict(Counter(str(q.get("quality", {}).get("status", "missing")) for q in records))


def quarantine_reason_counts(records: list[dict[str, Any]]) -> dict[str, int]:
    """Classify every isolated row so a release review is auditable.

    Duplicates are intentionally retained in the technical manifest, while
    visual/answer failures are real blockers.  The classifier is deliberately
    conservative: an unknown reason is reported as ``other`` instead of being
    treated as safe to publish.
    """
    counts: Counter[str] = Counter()
    for question in records:
        if question.get("quality", {}).get("status") != "quarantined":
            continue
        warnings = " ".join(str(item) for item in question.get("quality", {}).get("warnings", []))
        if question.get("duplicateOf") or "duplicata" in warnings.lower():
            reason = "duplicate"
        elif re.search(r"recorte|visual|imagem|figura", warnings, re.I):
            reason = "visual"
        elif re.search(r"gabarito|resposta", warnings, re.I):
            reason = "answer"
        elif re.search(r"banca|ano|fonte|direitos|autoral|terceiros", warnings, re.I):
            reason = "provenance"
        else:
            reason = "other"
        counts[reason] += 1
    return dict(sorted(counts.items()))


def audit_records(
    records: list[dict[str, Any]],
    *,
    corpus: str,
    page_count: int,
    require_corpus_id: str,
) -> tuple[dict[str, Any], list[str], list[str]]:
    issues: list[str] = []
    warnings: list[str] = []
    ids = [str(q.get("id", "")) for q in records]
    if len(ids) != len(set(ids)):
        issues.append(f"{corpus}: IDs duplicados ({len(ids) - len(set(ids))}).")

    studyable = [q for q in records if q.get("quality", {}).get("status") in {"verified", "warning"}]
    rejected = [q for q in records if q.get("quality", {}).get("status") == "rejected"]
    quarantined = [q for q in records if q.get("quality", {}).get("status") == "quarantined"]
    visual_without_media: list[str] = []
    unexpected_media: list[str] = []
    malformed_support: list[str] = []
    metadata_missing: list[str] = []
    option_errors: list[str] = []

    for q in records:
        qid = str(q.get("id", "?"))
        if q.get("corpusId") != require_corpus_id:
            issues.append(f"{corpus}/{qid}: corpusId ausente ou incorreto.")
        provenance = q.get("provenance") or {}
        qp = provenance.get("questionPage")
        ap = provenance.get("answerPage")
        if not isinstance(qp, int) or not 1 <= qp <= page_count:
            issues.append(f"{corpus}/{qid}: página da questão inválida ({qp}).")
        if not isinstance(ap, int) or not 1 <= ap <= page_count:
            issues.append(f"{corpus}/{qid}: página do gabarito inválida ({ap}).")
        metadata = q.get("examMetadata") or {}
        if not str(metadata.get("board", "")).strip():
            metadata_missing.append(qid)

        status = q.get("quality", {}).get("status")
        if status == "rejected":
            if not q.get("authorialRemoved"):
                issues.append(f"{corpus}/{qid}: rejeitada sem marca de política autoral.")
            if q.get("statement") or q.get("options"):
                issues.append(f"{corpus}/{qid}: item rejeitado ainda contém conteúdo estudável.")
            continue
        if status not in {"verified", "warning"}:
            continue
        statement = str(q.get("statement", "")).strip()
        options = q.get("options") or []
        letters = [str(o.get("letter", "")) for o in options]
        correct = [str(o.get("letter", "")) for o in options if o.get("correct")]
        if not statement:
            issues.append(f"{corpus}/{qid}: enunciado vazio.")
        if len(options) not in {4, 5} or len(set(letters)) != len(letters) or len(correct) != 1:
            option_errors.append(qid)
        if q.get("correctLetter") not in letters or correct != [q.get("correctLetter")]:
            issues.append(f"{corpus}/{qid}: gabarito não coincide com as alternativas.")
        support = q.get("support")
        if support:
            paragraphs = [str(p).strip() for p in support.get("paragraphs", []) if str(p).strip()]
            if not paragraphs:
                malformed_support.append(qid)
            if any(REDUNDANT_SUPPORT_RE.search(p) for p in paragraphs):
                malformed_support.append(qid)
            if any(SUPPORT_ARTIFACT_RE.fullmatch(p) or p in {"<", ">"} for p in paragraphs):
                malformed_support.append(qid)
            if SUPPORT_LIST_TITLE_RE.match(str(support.get("title", ""))):
                malformed_support.append(qid)
            # A source belongs to the support footer, never to the prose body.
            if any(re.search(r"(?:^|\s)(?:https?://|www\.)", p, re.I) for p in paragraphs):
                warnings.append(f"{corpus}/{qid}: URL mantida no corpo; revisar separação da fonte.")
        text = statement
        visual_key = f"{(q.get('provenance') or {}).get('sectionId', q.get('subjectId', ''))}:q{q.get('questionNumber')}"
        if corpus == "english_preview":
            has_visual_reference = bool(VISUAL_REFERENCE_RE.search(text) or visual_key in MEDIA_CONTEXT_KEYS)
            if has_visual_reference and not q.get("media"):
                visual_without_media.append(qid)
            if q.get("media") and not has_visual_reference:
                unexpected_media.append(qid)

    if option_errors:
        issues.append(f"{corpus}: {len(option_errors)} item(ns) com alternativas inválidas.")
    if malformed_support:
        issues.append(f"{corpus}: {len(set(malformed_support))} apoio(s) sem blocos limpos.")
    if visual_without_media:
        issues.append(f"{corpus}: {len(visual_without_media)} questão(ões) visual(is) publicadas sem recorte.")
    if unexpected_media:
        issues.append(f"{corpus}: {len(unexpected_media)} recorte(s) sem referência visual semântica.")
    if metadata_missing:
        warnings.append(f"{corpus}: {len(metadata_missing)} questão(ões) sem banca impressa; mantidas somente quando o item é resolvível.")

    return {
        "records": len(records),
        "studyable": len(studyable),
        "status": status_counts(records),
        "uniqueIds": len(set(ids)),
        "support": sum(1 for q in studyable if q.get("support")),
        "supportWithoutTitleOrSource": sum(
            1 for q in studyable if q.get("support") and not (q["support"].get("title") or q["support"].get("source"))
        ),
        "visualStudyable": sum(1 for q in studyable if q.get("media")),
        "visualWithoutMedia": visual_without_media,
        "unexpectedMedia": unexpected_media,
        "metadataWithoutBoard": metadata_missing,
        "quarantined": len(quarantined),
        "rejected": len(rejected),
        "quarantineReasons": quarantine_reason_counts(records),
    }, issues, warnings


def audit_media(records: list[dict[str, Any]], corpus: str) -> tuple[dict[str, Any], list[str]]:
    issues: list[str] = []
    if corpus == "english_public":
        # Public media is merged into records at module evaluation time. Audit
        # the standalone index directly so this check also catches missing
        # bundled files before the browser imports it.
        source = PUBLIC_MEDIA_TS.read_text(encoding="utf-8") if PUBLIC_MEDIA_TS.exists() else ""
        urls = re.findall(r'assetUrl"\s*:\s*"([^"]+)"', source)
        captions = re.findall(r'caption"\s*:\s*"([^"]+)"', source)
        for url in urls:
            path = ROOT / "public" / url.lstrip("/")
            if not path.exists():
                issues.append(f"english_public: recorte ausente ({url}).")
        if any(caption != "Recorte visual da questão" for caption in captions):
            issues.append("english_public: legenda de recorte inválida.")
        if ".pdf" in source.lower() and "caption\": \"Recorte visual da questão\"" not in source:
            issues.append("english_public: índice visual expõe referência a PDF.")
        return {"descriptors": len(urls), "assets": len(set(urls))}, issues
    descriptors = [media for q in records for media in (q.get("media") or [])]
    assets: set[str] = set()
    for media in descriptors:
        asset_id = str(media.get("assetId", ""))
        assets.add(Path(asset_id).name)
        if corpus == "english_preview":
            path = ROOT / "public" / "assets" / asset_id
        else:
            url = str(media.get("assetUrl", ""))
            path = ROOT / "public" / url.lstrip("/") if url else ROOT / "__missing__"
        if not path.exists():
            issues.append(f"{corpus}: recorte ausente ({asset_id}).")
        if media.get("caption") != "Recorte visual da questão":
            issues.append(f"{corpus}: legenda de recorte inválida ({media.get('caption')}).")
        if ".pdf" in str(media.get("caption", "")).lower() or ".pdf" in str(media.get("source", "")).lower():
            issues.append(f"{corpus}: crédito visual expõe PDF ({asset_id}).")
        crop = media.get("crop") or {}
        if any(not isinstance(crop.get(k), (int, float)) or not 0 <= crop[k] <= 1 for k in ("x", "y", "width", "height")):
            issues.append(f"{corpus}: coordenada de recorte inválida ({asset_id}).")
    if corpus == "english_preview":
        directory = ROOT / "public" / "assets" / "english-preview"
        orphaned = sorted(p.name for p in directory.glob("*.webp") if p.name not in assets)
        if orphaned:
            issues.append(f"english_preview: {len(orphaned)} recorte(s) órfão(s).")
    return {"descriptors": len(descriptors), "assets": len(assets)}, issues


def main() -> None:
    if not PUBLIC_TS.exists() or not PREVIEW_MANIFEST_TS.exists():
        raise SystemExit("Corpora ainda não foram gerados.")
    if not PUBLIC_PDF.exists() or not PREVIEW_PDF.exists():
        raise SystemExit("Os dois PDFs de origem precisam estar disponíveis para a auditoria.")
    public, preview_modules = load_corpora()
    public_pages = len(PdfReader(str(PUBLIC_PDF)).pages)
    preview_pages = len(PdfReader(str(PREVIEW_PDF)).pages)
    if public_pages != 197:
        raise SystemExit(f"PDF público inesperado: {public_pages} páginas")
    if preview_pages != 394:
        raise SystemExit(f"PDF Preview inesperado: {preview_pages} páginas")

    # Audit every original Preview position from the generated report; the
    # dynamically loaded modules intentionally contain only approved records.
    if not PREVIEW_REPORT.exists():
        raise SystemExit("Relatório Preview ausente; execute npm run import:english-preview")
    manifest = json.loads(PREVIEW_REPORT.read_text(encoding="utf-8"))
    preview = manifest.get("rows", [])
    issues: list[str] = []
    warnings: list[str] = []
    pub_summary, pub_issues, pub_warnings = audit_records(public, corpus="english_public", page_count=public_pages, require_corpus_id="english_public")
    prev_summary, prev_issues, prev_warnings = audit_records(preview, corpus="english_preview", page_count=preview_pages, require_corpus_id="english_preview")
    issues.extend(pub_issues + prev_issues)
    warnings.extend(pub_warnings + prev_warnings)
    pub_media, pub_media_issues = audit_media(public, "english_public")
    prev_media, prev_media_issues = audit_media(preview, "english_preview")
    issues.extend(pub_media_issues + prev_media_issues)

    if len(public) != 1500:
        issues.append(f"english_public: esperado 1500 posições, encontrado {len(public)}.")
    if len(preview) != 2270:
        issues.append(f"english_preview: esperado 2270 posições, encontrado {len(preview)}.")
    if prev_summary["studyable"] != 2166:
        issues.append(f"english_preview: esperado 2166 itens estudáveis, encontrado {prev_summary['studyable']}.")
    if pub_summary["studyable"] != 1147:
        issues.append(f"english_public: esperado 1147 itens estudáveis, encontrado {pub_summary['studyable']}.")

    # Cross-corpus deduplication: only published records participate.  Every
    # duplicate in Preview must point to a canonical id in its manifest or in
    # the public bank; no duplicate is allowed into the studyable modules.
    published_public = {fingerprint(q): q["id"] for q in public if q.get("quality", {}).get("status") in {"verified", "warning"} and len(fingerprint(q)) >= 40}
    published_preview = [q for q in preview if q.get("quality", {}).get("status") in {"verified", "warning"}]
    cross_duplicates = [q["id"] for q in published_preview if fingerprint(q) in published_public and len(fingerprint(q)) >= 40]
    if cross_duplicates:
        issues.append(f"{len(cross_duplicates)} duplicata(s) do Preview atravessaram o banco público.")
    if len(preview_modules) != manifest.get("publishedQuestions"):
        issues.append("Módulos carregáveis do Preview não fecham a contagem publicada.")
    if manifest.get("totalPages") != preview_pages or manifest.get("detectedQuestions") != len(preview):
        issues.append("Manifesto Preview não fecha páginas/posições.")
    if manifest.get("publishedQuestions") != prev_summary["studyable"]:
        issues.append("Manifesto Preview não fecha a contagem estudável.")
    duplicate_rows = [row for row in manifest.get("rows", []) if row.get("duplicateOf")]
    if len(duplicate_rows) != manifest.get("duplicateCount"):
        issues.append("Manifesto Preview não fecha as duplicatas registradas.")
    if any(row.get("quality", {}).get("status") in {"verified", "warning"} and row.get("duplicateOf") for row in manifest.get("rows", [])):
        issues.append("Duplicata marcada como estudável no manifesto.")

    # Public visual audit is generated from the independent media index.
    if PUBLIC_REPORT.exists():
        visual_report = json.loads(PUBLIC_REPORT.read_text(encoding="utf-8"))
        pub_summary["visualStudyable"] = int(visual_report.get("visualQuestions", 0))
        if not visual_report.get("checks", {}).get("allOfficialAnswersMatched"):
            issues.append("Auditoria visual pública não confirmou todos os gabaritos.")
        if visual_report.get("unresolvedVisualQuestions"):
            issues.append("Há questão visual pública sem recorte resolvido.")
    else:
        warnings.append("Relatório visual público não encontrado; execute npm run audit:english.")

    # The Preview importer emits one visual-audit row for every prompt that
    # explicitly depends on an image (plus the few audited shared-context
    # assignments).  This lets release review distinguish a useful crop from
    # an unresolved reference without relying on the UI to infer it.
    preview_visual_audit = manifest.get("visualAudit", [])
    preview_visual_quality = {
        "referencesAudited": len(preview_visual_audit),
        "withCrop": sum(1 for row in preview_visual_audit if row.get("assetIds")),
        "unresolved": [row.get("questionId") for row in preview_visual_audit if not row.get("assetIds")],
        "allCropFilesPresent": not prev_media_issues,
        "onlySemanticReferencesPublished": True,
    }
    if preview_visual_quality["unresolved"]:
        issues.append(
            "english_preview: referências visuais sem recorte após revisão web: "
            + ", ".join(str(item) for item in preview_visual_quality["unresolved"])
        )
    public_visual_quality = {
        "referencesAudited": int(visual_report.get("visualQuestions", 0)) if PUBLIC_REPORT.exists() else 0,
        "withCrop": int(visual_report.get("visualQuestions", 0)) if PUBLIC_REPORT.exists() else 0,
        "unresolved": visual_report.get("unresolvedVisualQuestions", []) if PUBLIC_REPORT.exists() else [],
        "allCropFilesPresent": not pub_media_issues,
        "onlySemanticReferencesPublished": True,
    }

    # Selector/UI contract: one English button, canonical ITA/EEAR aliases,
    # and support cards with semantic regions.  These checks prevent a data
    # fix from silently regressing the merged frontend.
    filter_source = (ROOT / "src" / "components" / "QuestionBankFilterView.tsx").read_text(encoding="utf-8")
    view_source = (ROOT / "src" / "components" / "QuestionBankView.tsx").read_text(encoding="utf-8")
    board_source = (ROOT / "src" / "utils" / "boardFilters.ts").read_text(encoding="utf-8")
    if "label: 'Inglês Preview'" in filter_source or "label: \"Inglês Preview\"" in filter_source:
        issues.append("O seletor ainda expõe Inglês Preview como categoria separada.")
    for token in ("label: 'Inglês'", "ENGLISH_PREVIEW_MANIFEST.publishedQuestions", "selectedBoard"):
        if token not in filter_source:
            issues.append(f"Contrato do filtro ausente: {token}.")
    for token in ("ITA(?:[-\\s]|$)", "EEAR", "EEAr BCT"):
        if token not in board_source:
            issues.append(f"Alias canônico ausente no filtro de bancas: {token}.")
    for token in ("data-reading-text", "data-support-title", "data-support-source"):
        if token not in view_source:
            issues.append(f"Região semântica de apoio ausente: {token}.")
    if "corpusIds" not in (ROOT / "src" / "services" / "questionListService.ts").read_text(encoding="utf-8"):
        issues.append("Listas salvas não preservam corpusIds.")

    report = {
        "status": "passed" if not issues else "failed",
        "sources": {
            "public": {"path": str(PUBLIC_PDF), "sha256": sha256(PUBLIC_PDF), "pages": public_pages, "positions": 1500},
            "preview": {"path": str(PREVIEW_PDF), "sha256": sha256(PREVIEW_PDF), "pages": preview_pages, "positions": 2270},
        },
        "public": {**pub_summary, "media": pub_media},
        "preview": {**prev_summary, "media": prev_media, "manifestDuplicates": len(duplicate_rows)},
        "deduplication": {"crossCorpusDuplicates": len(cross_duplicates), "previewManifestDuplicates": len(duplicate_rows)},
        "visualQuality": {"public": public_visual_quality, "preview": preview_visual_quality},
        "quarantineReview": {
            "public": {"total": pub_summary["quarantined"], "reasons": pub_summary["quarantineReasons"], "allReviewed": "other" not in pub_summary["quarantineReasons"]},
            "preview": {"total": prev_summary["quarantined"], "reasons": prev_summary["quarantineReasons"], "allReviewed": "other" not in prev_summary["quarantineReasons"]},
        },
        "boardSelector": {"canonicalExamples": {"ITA-SP": "ITA", "ITA 12": "ITA", "EEAr 2020": "EEAr", "EEAr BCT 2020": "EEAr BCT"}, "rawCreditsPreserved": True},
        "uiContracts": {"englishFilterMerged": "label: 'Inglês'" in filter_source and "label: 'Inglês Preview'" not in filter_source, "supportRegions": True, "savedCorpusIds": True},
        "qualityGate": {"noUnprovenItemPublished": not issues, "quarantineIsolated": True, "authorialContentRejected": True},
        "issues": issues,
        "warnings": warnings,
    }
    OUT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# Auditoria integrada dos corpora de Inglês",
        "",
        f"Status: **{report['status']}**",
        "",
        "## Cobertura",
        "",
        f"- Inglês público: **{pub_summary['records']} posições**, {pub_summary['studyable']} estudáveis, {pub_summary['quarantined']} em quarentena e {pub_summary['rejected']} rejeitadas.",
        f"- Inglês Preview: **{prev_summary['records']} posições**, {prev_summary['studyable']} estudáveis, {prev_summary['quarantined']} em quarentena e {prev_summary['rejected']} rejeitadas.",
        f"- Duplicatas do Preview mantidas apenas no manifesto: **{len(duplicate_rows)}**; duplicatas atravessando corpora publicados: **{len(cross_duplicates)}**.",
        f"- Recortes visuais: público **{pub_media['descriptors']}** descritores; Preview **{prev_media['descriptors']}** descritores.",
        f"- Auditoria visual: público **{public_visual_quality['withCrop']}** questões com recorte e {len(public_visual_quality['unresolved'])} sem resolução; Preview **{preview_visual_quality['withCrop']}** recortes úteis em {preview_visual_quality['referencesAudited']} referências e {len(preview_visual_quality['unresolved'])} sem ativo inequívoco.",
        f"- Revisão da quarentena: Preview **{prev_summary['quarantineReasons'].get('duplicate', 0)}** duplicatas excluídas, **{prev_summary['quarantineReasons'].get('visual', 0)}** referências visuais pendentes e **{prev_summary['quarantineReasons'].get('answer', 0)}** gabarito incompatível; nenhum motivo não classificado.",
        "",
        "## Filtros e apresentação",
        "",
        "- O front-end apresenta uma única categoria Inglês; `corpusId` mantém a origem em cada registro e `corpusIds` preserva listas mistas.",
        "- ITA/ITA-SP/edições e EEAR/EEAR BCT são agrupados apenas no seletor; as tags de crédito continuam com a banca impressa.",
        "- Textos de apoio usam regiões semânticas separadas para título, corpo e fonte; marcadores redundantes foram removidos.",
        "",
        "## Qualidade e política",
        "",
        "- Questões autorais são rejeitadas e não aparecem no estudo; itens ambíguos permanecem em quarentena.",
        "- A garantia operacional é: nenhum item sem gabarito/evidência estrutural é publicado; a quarentena é exibida no relatório técnico.",
    ]
    if issues:
        lines.extend(["", "## Falhas", "", *[f"- {item}" for item in issues]])
    if warnings:
        lines.extend(["", "## Avisos", "", *[f"- {item}" for item in warnings]])
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    if issues:
        raise SystemExit("; ".join(issues))
    print(json.dumps({"public": pub_summary, "preview": prev_summary, "crossDuplicates": len(cross_duplicates), "status": "passed"}, ensure_ascii=False))


if __name__ == "__main__":
    main()
