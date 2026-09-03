"""Emit the auditable disposition of records reviewed against web sources.

The script is deliberately offline: it validates the deterministic outputs of
the importers and records the URLs that were reviewed during the audit.  No
remote page is fetched as part of a production build.
"""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PREVIEW_REPORT = ROOT / "reports" / "english-preview-audit.json"
PUBLIC_REPORT = ROOT / "reports" / "english-question-audit.json"
OUT_JSON = ROOT / "reports" / "english-quarantine-web-audit.json"
OUT_MD = ROOT / "reports" / "english-quarantine-web-audit.md"

RESOLVED = [
    {
        "key": "preview_reading_epcar:q83",
        "id": "ep-029a154daaf7-preview_reading_epcar-q83",
        "disposition": "released",
        "evidence": "Recorte da charge localizado na prova EPCAR publicada; correspondência inequívoca.",
        "sources": [
            "https://www.fab.mil.br/ingresso/arquivos/provas/CPCAR_2023_versa%E2%95%A0%C3%A2o_A.pdf",
            "https://raesidecartoon.com/vault/global-warming-climate-change/",
        ],
    },
    {
        "key": "preview_adjectives:q25",
        "id": "ep-029a154daaf7-preview_adjectives-q25",
        "disposition": "released",
        "evidence": "Recorte do material visual da questão 34 localizado na prova EEAR CFS 2/2022.",
        "sources": [
            "https://ingresso.eear.fab.mil.br/SOO/escolaridade/CFS%202%202022/prova_cfs%202%202022_cod_01.pdf",
            "https://www.grammarly.com/blog/10-interesting-english-facts-guest/",
        ],
    },
    {
        "key": "preview_pronouns_relative:q17",
        "id": "ep-029a154daaf7-preview_pronouns_relative-q17",
        "disposition": "released",
        "evidence": "Gabarito independente confirma a alternativa D; a alternativa E não existe na prova.",
        "sources": [
            "https://www.concursosmilitares.com.br/provas-anteriores/aeronautica/afa/afa2013.pdf",
            "https://mosaiko.com.br/portfolio/pensi/wp-content/uploads/2014/08/gabarito_AFA2013_ingles.pdf",
        ],
    },
]


def main() -> None:
    preview = json.loads(PREVIEW_REPORT.read_text(encoding="utf-8"))
    public = json.loads(PUBLIC_REPORT.read_text(encoding="utf-8"))
    rows = {str(row["id"]): row for row in preview["rows"]}
    resolved_rows = []
    for item in RESOLVED:
        row = rows.get(item["id"])
        if not row or row.get("quality", {}).get("status") not in {"verified", "warning"}:
            raise SystemExit(f"Correção web não publicada: {item['id']}")
        resolved_rows.append({**item, "status": row["quality"]["status"], "media": [m["assetId"] for m in row.get("media") or []]})
    remaining = [
        {
            "id": row["id"],
            "duplicateOf": row.get("duplicateOf"),
            "warnings": row.get("quality", {}).get("warnings", []),
        }
        for row in preview["rows"]
        if row.get("quality", {}).get("status") == "quarantined"
    ]
    unresolved = [row for row in remaining if not row.get("duplicateOf")]
    if unresolved:
        raise SystemExit("Há quarentena não duplicada sem disposição")
    public_authorial = [row for row in public["rows"] if row.get("authorialRemoved")]
    report = {
        "status": "passed",
        "reviewedSources": resolved_rows,
        "preview": {
            "resolved": len(resolved_rows),
            "remainingQuarantined": len(remaining),
            "remainingAreDuplicates": len(remaining) == len([row for row in remaining if row.get("duplicateOf")]),
            "remaining": remaining,
        },
        "public": {
            "authorialCompilationRejected": len(public_authorial),
            "reason": "Translations são a compilação creditada a Jefferson Celestino da Costa, sem banca/ano de prova.",
            "source": "https://projetomedicina.com.br/site/attachments/article/295/1500_questoes_ingles_concursos_militares_jefferson_celestino.pdf",
        },
    }
    OUT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# Auditoria web das quarentenas de Inglês",
        "",
        "Status: **passed**",
        "",
        "## Correções liberadas",
        "",
        "| Questão | Estado | Evidência |",
        "| --- | --- | --- |",
    ]
    lines.extend(f"| `{item['id']}` | **{item['status']}** | {item['evidence']} |" for item in resolved_rows)
    lines.extend([
        "",
        f"- Preview: **{len(remaining)}** itens continuam isolados; todos são duplicatas com vínculo canônico. Nenhuma quarentena visual ou de gabarito ficou sem resolução.",
        f"- Inglês público: **{len(public_authorial)}** itens da seção autoral foram rejeitados e não são estudáveis.",
        "- O nome do PDF permanece somente na proveniência técnica; a interface usa a legenda curta do recorte.",
        "",
        "## Fontes consultadas",
        "",
    ])
    for item in resolved_rows:
        lines.append(f"- `{item['key']}`: " + ", ".join(item["sources"]))
    lines.append(f"- Compilação autoral: {report['public']['source']}")
    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({
        "status": report["status"],
        "resolved": len(resolved_rows),
        "previewDuplicateQuarantine": len(remaining),
        "publicAuthorialRejected": len(public_authorial),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
