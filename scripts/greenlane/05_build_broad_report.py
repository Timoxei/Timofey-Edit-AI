"""Build greenlane_controversial.html from the broad rubric findings.

Reads:
    D:\\All the transcripts\\greenlanemasjid\\_manifest.json
    D:\\All the transcripts\\greenlanemasjid\\_findings_broad\\*.json

Writes:
    C:\\Users\\user\\Timofey-Edit-AI\\greenlane_controversial.html

Differences from 04_build_report.py:
  * Data-driven category list (any new uppercase token in findings becomes a
    pill/filter automatically) — needed because the broad rubric has ~24
    categories grouped into clusters.
  * Cluster grouping shown in the summary card.
  * Category pill colors hashed from category name when no preset color.
"""
import colorsys
import hashlib
import html
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

DATA_DIR = Path(r"D:\All the transcripts\greenlanemasjid")
MANIFEST = DATA_DIR / "_manifest.json"
FINDINGS_DIR = DATA_DIR / "_findings_broad"
OUT_HTML = Path(r"C:\Users\user\Timofey-Edit-AI\greenlane_controversial.html")

CLUSTERS = {
    "Israel / Jews": [
        "ISRAEL_HOSTILITY", "JEWS_NEGATIVE", "ANTISEMITISM_MODERN", "ANTISEMITISM",
    ],
    "Western values": [
        "LGBT_CONDEMNATION", "ANTI_LGBT", "WOMEN_SUBORDINATION", "MISOGYNY",
        "DEMOCRACY_REJECTION", "ANTI_DEMOCRATIC", "SHARIA_ADVOCACY",
        "CALIPHATE_DISCUSSION", "WEST_CRITICISM", "KUFFAR_NEGATIVE",
        "INTEGRATION_RESISTANCE", "INTERFAITH_NEGATIVE", "INTER_FAITH_HATE",
    ],
    "Violence / extremism": [
        "JIHAD_DISCUSSION", "VIOLENT_VERSE_TAFSIR", "TERROR_SUPPORT",
        "INCITEMENT_VIOLENCE", "MARTYRDOM_PRAISE",
    ],
    "Apostasy / sect": [
        "APOSTASY_PUNISHMENT", "TAKFIR", "SHIA_SECTARIAN", "SECTARIAN_HATE",
    ],
    "Other": [
        "CONSPIRACY", "CHILD_MARRIAGE", "OTHER",
    ],
}
CLUSTER_BY_CAT = {c: name for name, cats in CLUSTERS.items() for c in cats}


def color_for_category(cat: str) -> str:
    """Deterministic pleasant color per category — saturated, dark enough for white text."""
    h = int(hashlib.md5(cat.encode()).hexdigest()[:6], 16) / 0xFFFFFF
    s, l = 0.55, 0.35
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return f"#{int(r*255):02x}{int(g*255):02x}{int(b*255):02x}"


def ts_to_seconds(ts: str) -> int:
    parts = re.findall(r"\d+", ts or "")
    if len(parts) == 3:
        h, m, s = (int(x) for x in parts)
        return h * 3600 + m * 60 + s
    if len(parts) == 2:
        m, s = (int(x) for x in parts)
        return m * 60 + s
    if len(parts) == 1:
        return int(parts[0])
    return 0


def main():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    title_by_id = {v["id"]: v["title"] for v in manifest}

    findings_by_vid: dict[str, dict] = {}
    for p in sorted(FINDINGS_DIR.glob("*.json")):
        vid = p.stem
        try:
            findings_by_vid[vid] = json.loads(p.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"skip {vid}: {e}")

    rows = []
    cat_counts: Counter[str] = Counter()
    sev_counts: Counter[int] = Counter()
    cluster_counts: Counter[str] = Counter()
    findings_per_video: Counter[str] = Counter()

    for vid_id, data in findings_by_vid.items():
        for f in data.get("findings", []) or []:
            ts = f.get("timestamp", "")
            cat = (f.get("category") or "OTHER").upper()
            sev = int(f.get("severity", 0) or 0)
            cluster = CLUSTER_BY_CAT.get(cat, "Other")
            rows.append({
                "vid_id": vid_id,
                "title": title_by_id.get(vid_id, vid_id),
                "ts": ts,
                "secs": ts_to_seconds(ts),
                "category": cat,
                "cluster": cluster,
                "severity": sev,
                "quote": f.get("quote", ""),
                "context": f.get("context", ""),
            })
            cat_counts[cat] += 1
            sev_counts[sev] += 1
            cluster_counts[cluster] += 1
            findings_per_video[vid_id] += 1

    rows.sort(key=lambda r: (-r["severity"], r["cluster"], r["category"], r["title"]))
    top_videos = findings_per_video.most_common(15)

    def cell(s: str) -> str:
        return html.escape(s, quote=True)

    row_html = []
    for r in rows:
        link = f"https://youtu.be/{r['vid_id']}?t={r['secs']}s"
        color = color_for_category(r["category"])
        row_html.append(
            f'<tr data-severity="{r["severity"]}" '
            f'data-category="{cell(r["category"])}" '
            f'data-cluster="{cell(r["cluster"])}">'
            f'<td class="sev sev-{r["severity"]}">{r["severity"]}</td>'
            f'<td><span class="cat" style="background:{color}">{cell(r["category"])}</span></td>'
            f'<td class="cluster">{cell(r["cluster"])}</td>'
            f'<td class="title">{cell(r["title"])}</td>'
            f'<td><a href="{cell(link)}" target="_blank" rel="noopener">{cell(r["ts"])}</a></td>'
            f'<td class="quote">{cell(r["quote"])}</td>'
            f'<td class="ctx">{cell(r["context"])}</td>'
            f"</tr>"
        )

    # Cluster summary card
    cluster_summary_blocks = []
    for cname in CLUSTERS:
        total = cluster_counts.get(cname, 0)
        per_cat = []
        for cat in CLUSTERS[cname]:
            n = cat_counts.get(cat, 0)
            if n:
                color = color_for_category(cat)
                per_cat.append(
                    f'<li><span class="cat" style="background:{color}">{cell(cat)}</span> {n}</li>'
                )
        # tail: any unknown cats falling into "Other" via fallback
        if cname == "Other":
            for cat, n in cat_counts.items():
                if cat not in CLUSTER_BY_CAT and n:
                    color = color_for_category(cat)
                    per_cat.append(
                        f'<li><span class="cat" style="background:{color}">{cell(cat)}</span> {n}</li>'
                    )
        cluster_summary_blocks.append(
            f'<div class="cluster-block"><h4>{cell(cname)} <span class="cluster-total">{total}</span></h4>'
            f'<ul>{"".join(per_cat) or "<li class=empty>—</li>"}</ul></div>'
        )

    sev_summary = "".join(
        f'<li><span class="sev sev-{s}">{s}</span> {n}</li>'
        for s, n in sorted(sev_counts.items(), reverse=True)
    )
    top_videos_html = "".join(
        f'<li><a href="https://youtu.be/{vid_id}" target="_blank" rel="noopener">'
        f'{cell(title_by_id.get(vid_id, vid_id))}</a> — {n} findings</li>'
        for vid_id, n in top_videos
    )

    category_filter_options = "".join(
        f'<option value="{cell(c)}">{cell(c)} ({n})</option>'
        for c, n in cat_counts.most_common()
    )
    cluster_filter_options = "".join(
        f'<option value="{cell(c)}">{cell(c)} ({cluster_counts.get(c,0)})</option>'
        for c in CLUSTERS
    )

    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Green Lane Masjid — Controversial Content Map</title>
<style>
body {{ font-family: -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; padding: 24px; background: #f4f4f7; color: #111; }}
h1 {{ margin: 0 0 4px; }}
.subtitle {{ color: #666; margin-bottom: 24px; }}
.summary {{ display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }}
.card {{ background: white; border-radius: 8px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }}
.card h3 {{ margin: 0 0 12px; font-size: 14px; color: #555; text-transform: uppercase; letter-spacing: .5px; }}
.card ul {{ list-style: none; padding: 0; margin: 0; }}
.card li {{ padding: 3px 0; font-size: 13px; }}
.cluster-block {{ margin-bottom: 14px; }}
.cluster-block h4 {{ margin: 0 0 6px; font-size: 13px; font-weight: 600; color: #333; }}
.cluster-total {{ float: right; color: #888; font-weight: 400; }}
.cat {{ display: inline-block; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: .3px; }}
.sev {{ display: inline-block; min-width: 22px; text-align: center; padding: 2px 6px; border-radius: 4px; font-weight: 700; }}
.sev-5 {{ background: #b00020; color: white; }}
.sev-4 {{ background: #d84315; color: white; }}
.sev-3 {{ background: #ef6c00; color: white; }}
.sev-2 {{ background: #fbc02d; color: #333; }}
.sev-1 {{ background: #cfd8dc; color: #333; }}
.controls {{ display: flex; gap: 12px; margin-bottom: 12px; align-items: center; flex-wrap: wrap; }}
.controls input, .controls select {{ font-size: 14px; padding: 6px 10px; border: 1px solid #ccc; border-radius: 6px; }}
.controls input {{ flex: 1; min-width: 200px; }}
table {{ width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.08); }}
th, td {{ padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; vertical-align: top; font-size: 14px; }}
th {{ background: #fafafa; cursor: pointer; user-select: none; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; color: #555; }}
th:hover {{ background: #f0f0f0; }}
td.title {{ max-width: 220px; }}
td.cluster {{ font-size: 12px; color: #666; }}
td.quote {{ max-width: 340px; }}
td.ctx {{ max-width: 300px; color: #555; }}
td a {{ color: #1976d2; text-decoration: none; }}
td a:hover {{ text-decoration: underline; }}
.count {{ color: #666; font-size: 13px; margin-left: 8px; }}
.empty {{ color: #999; }}
</style>
</head>
<body>
<h1>Green Lane Masjid — Controversial Content Map</h1>
<div class="subtitle">{len(findings_by_vid)} videos analyzed · {len(rows)} findings flagged · broad rubric (Israel, Western-values contradictions, violence, apostasy, conspiracy)</div>

<div class="summary">
  <div class="card">
    <h3>Findings by cluster &amp; category</h3>
    {''.join(cluster_summary_blocks)}
  </div>
  <div class="card">
    <h3>Findings by severity</h3>
    <ul>{sev_summary or '<li>No findings.</li>'}</ul>
  </div>
  <div class="card">
    <h3>Top videos by finding count</h3>
    <ul>{top_videos_html or '<li>No findings.</li>'}</ul>
  </div>
</div>

<div class="controls">
  <input id="q" type="text" placeholder="Filter by quote, title, or context...">
  <select id="cluster-filter">
    <option value="">All clusters</option>
    {cluster_filter_options}
  </select>
  <select id="cat-filter">
    <option value="">All categories</option>
    {category_filter_options}
  </select>
  <select id="sev-filter">
    <option value="">All severities</option>
    <option value="5">5 only</option>
    <option value="4">4+</option>
    <option value="3">3+</option>
    <option value="2">2+</option>
  </select>
  <span class="count" id="visible-count"></span>
</div>

<table id="findings">
<thead>
<tr>
<th data-key="severity">Sev</th>
<th data-key="category">Category</th>
<th data-key="cluster">Cluster</th>
<th data-key="title">Video</th>
<th data-key="secs">Time</th>
<th data-key="quote">Quote</th>
<th data-key="context">Context</th>
</tr>
</thead>
<tbody>
{''.join(row_html) or '<tr><td colspan="7" style="padding:24px;text-align:center;color:#888">No findings.</td></tr>'}
</tbody>
</table>

<script>
const tbl = document.getElementById('findings');
const tbody = tbl.querySelector('tbody');
const rows = Array.from(tbody.querySelectorAll('tr'));
const q = document.getElementById('q');
const clusterF = document.getElementById('cluster-filter');
const catF = document.getElementById('cat-filter');
const sevF = document.getElementById('sev-filter');
const countEl = document.getElementById('visible-count');

function applyFilters() {{
  const text = q.value.toLowerCase();
  const cluster = clusterF.value;
  const cat = catF.value;
  const minSev = sevF.value ? parseInt(sevF.value, 10) : 0;
  let visible = 0;
  rows.forEach(r => {{
    const rowText = r.innerText.toLowerCase();
    const rowCluster = r.getAttribute('data-cluster');
    const rowCat = r.getAttribute('data-category');
    const rowSev = parseInt(r.getAttribute('data-severity'), 10);
    const ok = (!text || rowText.includes(text))
      && (!cluster || rowCluster === cluster)
      && (!cat || rowCat === cat)
      && (!minSev || rowSev >= minSev);
    r.style.display = ok ? '' : 'none';
    if (ok) visible++;
  }});
  countEl.textContent = visible + ' visible';
}}
q.addEventListener('input', applyFilters);
clusterF.addEventListener('change', applyFilters);
catF.addEventListener('change', applyFilters);
sevF.addEventListener('change', applyFilters);
applyFilters();

let sortKey = 'severity', sortDir = -1;
tbl.querySelectorAll('th').forEach((th, i) => {{
  th.addEventListener('click', () => {{
    const key = th.dataset.key;
    if (sortKey === key) sortDir = -sortDir; else {{ sortKey = key; sortDir = 1; }}
    const sorted = [...rows].sort((a, b) => {{
      const av = a.children[i].innerText.trim();
      const bv = b.children[i].innerText.trim();
      const an = parseFloat(av), bn = parseFloat(bv);
      if (!isNaN(an) && !isNaN(bn)) return (an - bn) * sortDir;
      return av.localeCompare(bv) * sortDir;
    }});
    sorted.forEach(r => tbody.appendChild(r));
  }});
}});
</script>
</body>
</html>
"""
    OUT_HTML.write_text(page, encoding="utf-8")
    print(f"Wrote {OUT_HTML}")
    print(f"  videos analyzed: {len(findings_by_vid)}")
    print(f"  total findings:  {len(rows)}")
    print(f"  by cluster:      {dict(cluster_counts)}")


if __name__ == "__main__":
    main()
