"""Build a single tabbed HTML report (one tab per channel) from broad-rubric findings.

Reads, for each channel in CHANNELS:
    D:\\All the transcripts\\<slug>\\_manifest.json
    D:\\All the transcripts\\<slug>\\_findings_broad\\*.json

Writes:
    C:\\Users\\user\\Timofey-Edit-AI\\channels_controversial.html

Self-contained: all rows embedded inline, tabs switch client-side.
"""
import colorsys
import hashlib
import html
import json
import re
import sys
from collections import Counter
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = Path(r"D:\All the transcripts")
OUT_HTML = Path(r"C:\Users\user\Timofey-Edit-AI\channels_controversial.html")

CHANNELS = [
    {"slug": "greenlanemasjid", "name": "Green Lane Masjid", "yt": "@greenlanemasjid"},
    {"slug": "bronxmuslimcenter", "name": "MAS Bronx Muslim Center", "yt": "@BronxMuslimCenter"},
    {"slug": "wayoflifesq", "name": "Way of Life SQ", "yt": "@WAYOFLIFESQ"},
]

CLUSTERS = {
    "Israel / Jews": ["ISRAEL_HOSTILITY", "JEWS_NEGATIVE", "ANTISEMITISM_MODERN", "ANTISEMITISM"],
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
    "Apostasy / sect": ["APOSTASY_PUNISHMENT", "TAKFIR", "SHIA_SECTARIAN", "SECTARIAN_HATE"],
    "Other": ["CONSPIRACY", "CHILD_MARRIAGE", "OTHER"],
}
CLUSTER_BY_CAT = {c: name for name, cats in CLUSTERS.items() for c in cats}


def color_for_category(cat: str) -> str:
    h = int(hashlib.md5(cat.encode()).hexdigest()[:6], 16) / 0xFFFFFF
    r, g, b = colorsys.hls_to_rgb(h, 0.35, 0.55)
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


def cell(s: str) -> str:
    return html.escape(str(s), quote=True)


def load_channel(slug: str):
    folder = BASE / slug
    manifest_p = folder / "_manifest.json"
    findings_dir = folder / "_findings_broad"
    title_by_id = {}
    if manifest_p.exists():
        for v in json.loads(manifest_p.read_text(encoding="utf-8")):
            title_by_id[v["id"]] = v["title"]
    findings_by_vid = {}
    if findings_dir.exists():
        for p in sorted(findings_dir.glob("*.json")):
            try:
                findings_by_vid[p.stem] = json.loads(p.read_text(encoding="utf-8"))
            except Exception as e:
                print(f"  skip {slug}/{p.name}: {e}")
    return title_by_id, findings_by_vid


def build_rows(title_by_id, findings_by_vid):
    rows = []
    cat_counts, sev_counts, cluster_counts, per_video = Counter(), Counter(), Counter(), Counter()
    for vid_id, data in findings_by_vid.items():
        for f in data.get("findings", []) or []:
            ts = f.get("timestamp", "")
            cat = (f.get("category") or "OTHER").upper()
            sev = int(f.get("severity", 0) or 0)
            cluster = CLUSTER_BY_CAT.get(cat, "Other")
            rows.append({
                "vid_id": vid_id, "title": title_by_id.get(vid_id, vid_id),
                "ts": ts, "secs": ts_to_seconds(ts), "category": cat,
                "cluster": cluster, "severity": sev,
                "quote": f.get("quote", ""), "context": f.get("context", ""),
            })
            cat_counts[cat] += 1
            sev_counts[sev] += 1
            cluster_counts[cluster] += 1
            per_video[vid_id] += 1
    rows.sort(key=lambda r: (-r["severity"], r["cluster"], r["category"], r["title"]))
    return rows, cat_counts, sev_counts, cluster_counts, per_video


def render_panel(idx, ch, title_by_id, findings_by_vid):
    rows, cat_counts, sev_counts, cluster_counts, per_video = build_rows(title_by_id, findings_by_vid)
    n_videos = len(findings_by_vid)
    n_flagged_videos = sum(1 for v in per_video if per_video[v])

    row_html = []
    for r in rows:
        link = f"https://youtu.be/{r['vid_id']}?t={r['secs']}s"
        color = color_for_category(r["category"])
        row_html.append(
            f'<tr data-severity="{r["severity"]}" data-category="{cell(r["category"])}" '
            f'data-cluster="{cell(r["cluster"])}">'
            f'<td class="sev sev-{r["severity"]}">{r["severity"]}</td>'
            f'<td><span class="cat" style="background:{color}">{cell(r["category"])}</span></td>'
            f'<td class="cluster">{cell(r["cluster"])}</td>'
            f'<td class="title">{cell(r["title"])}</td>'
            f'<td><a href="{cell(link)}" target="_blank" rel="noopener">{cell(r["ts"]) or "—"}</a></td>'
            f'<td class="quote">{cell(r["quote"])}</td>'
            f'<td class="ctx">{cell(r["context"])}</td></tr>'
        )

    cluster_blocks = []
    for cname in CLUSTERS:
        total = cluster_counts.get(cname, 0)
        per_cat = []
        for cat in CLUSTERS[cname]:
            n = cat_counts.get(cat, 0)
            if n:
                per_cat.append(f'<li><span class="cat" style="background:{color_for_category(cat)}">{cell(cat)}</span> {n}</li>')
        if cname == "Other":
            for cat, n in cat_counts.items():
                if cat not in CLUSTER_BY_CAT and n:
                    per_cat.append(f'<li><span class="cat" style="background:{color_for_category(cat)}">{cell(cat)}</span> {n}</li>')
        cluster_blocks.append(
            f'<div class="cluster-block"><h4>{cell(cname)} <span class="cluster-total">{total}</span></h4>'
            f'<ul>{"".join(per_cat) or "<li class=empty>—</li>"}</ul></div>'
        )

    sev_summary = "".join(
        f'<li><span class="sev sev-{s}">{s}</span> {n}</li>'
        for s, n in sorted(sev_counts.items(), reverse=True)
    )
    top_videos = per_video.most_common(15)
    top_html = "".join(
        f'<li><a href="https://youtu.be/{v}" target="_blank" rel="noopener">{cell(title_by_id.get(v, v))}</a> — {n}</li>'
        for v, n in top_videos
    )
    cat_opts = "".join(f'<option value="{cell(c)}">{cell(c)} ({n})</option>' for c, n in cat_counts.most_common())
    cluster_opts = "".join(f'<option value="{cell(c)}">{cell(c)} ({cluster_counts.get(c,0)})</option>' for c in CLUSTERS)

    active = " active" if idx == 0 else ""
    return f"""
<section class="panel{active}" id="panel-{idx}">
  <div class="subtitle">{n_videos} videos analyzed · {n_flagged_videos} flagged · {len(rows)} findings ·
    <a href="https://www.youtube.com/{cell(ch['yt'])}/videos" target="_blank" rel="noopener">{cell(ch['yt'])}</a></div>
  <div class="summary">
    <div class="card"><h3>Findings by cluster &amp; category</h3>{''.join(cluster_blocks)}</div>
    <div class="card"><h3>By severity</h3><ul>{sev_summary or '<li>No findings.</li>'}</ul></div>
    <div class="card"><h3>Top videos by finding count</h3><ul>{top_html or '<li>No findings.</li>'}</ul></div>
  </div>
  <div class="controls">
    <input type="text" placeholder="Filter by quote, title, or context..." data-role="q">
    <select data-role="cluster"><option value="">All clusters</option>{cluster_opts}</select>
    <select data-role="cat"><option value="">All categories</option>{cat_opts}</select>
    <select data-role="sev"><option value="">All severities</option>
      <option value="5">5 only</option><option value="4">4+</option>
      <option value="3">3+</option><option value="2">2+</option></select>
    <span class="count" data-role="count"></span>
  </div>
  <table class="findings">
    <thead><tr>
      <th data-key="severity">Sev</th><th data-key="category">Category</th>
      <th data-key="cluster">Cluster</th><th data-key="title">Video</th>
      <th data-key="secs">Time</th><th data-key="quote">Quote</th><th data-key="context">Context</th>
    </tr></thead>
    <tbody>
    {''.join(row_html) or '<tr><td colspan="7" style="padding:24px;text-align:center;color:#888">No findings for this channel.</td></tr>'}
    </tbody>
  </table>
</section>"""


def main():
    panels, tabs, totals = [], [], []
    for idx, ch in enumerate(CHANNELS):
        title_by_id, findings_by_vid = load_channel(ch["slug"])
        rows, *_ = build_rows(title_by_id, findings_by_vid)
        n_find = len(rows)
        totals.append((ch["name"], len(findings_by_vid), n_find))
        active = " active" if idx == 0 else ""
        tabs.append(f'<button class="tab{active}" data-tab="{idx}">{cell(ch["name"])} '
                    f'<span class="badge">{n_find}</span></button>')
        panels.append(render_panel(idx, ch, title_by_id, findings_by_vid))
        print(f"{ch['name']}: {len(findings_by_vid)} videos, {n_find} findings")

    grand = sum(t[2] for t in totals)
    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Muslim Channels — Controversial Content Map</title>
<style>
body {{ font-family: -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; padding: 24px; background: #f4f4f7; color: #111; }}
h1 {{ margin: 0 0 4px; }}
.lead {{ color: #666; margin-bottom: 18px; }}
.tabs {{ display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; border-bottom: 2px solid #ddd; }}
.tab {{ background: none; border: none; padding: 10px 16px; font-size: 15px; cursor: pointer; color: #555; border-bottom: 3px solid transparent; margin-bottom: -2px; }}
.tab:hover {{ color: #111; }}
.tab.active {{ color: #1976d2; border-bottom-color: #1976d2; font-weight: 600; }}
.badge {{ background: #e0e0e0; color: #333; border-radius: 10px; padding: 1px 8px; font-size: 12px; margin-left: 4px; }}
.tab.active .badge {{ background: #1976d2; color: white; }}
.panel {{ display: none; }}
.panel.active {{ display: block; }}
.subtitle {{ color: #666; margin-bottom: 18px; }}
.summary {{ display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; margin-bottom: 20px; }}
@media (max-width: 800px) {{ .summary {{ grid-template-columns: 1fr; }} }}
.card {{ background: white; border-radius: 8px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }}
.card h3 {{ margin: 0 0 12px; font-size: 14px; color: #555; text-transform: uppercase; letter-spacing: .5px; }}
.card ul {{ list-style: none; padding: 0; margin: 0; }}
.card li {{ padding: 3px 0; font-size: 13px; }}
.cluster-block {{ margin-bottom: 14px; }}
.cluster-block h4 {{ margin: 0 0 6px; font-size: 13px; font-weight: 600; color: #333; }}
.cluster-total {{ float: right; color: #888; font-weight: 400; }}
.cat {{ display: inline-block; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: .3px; }}
.sev {{ display: inline-block; min-width: 22px; text-align: center; padding: 2px 6px; border-radius: 4px; font-weight: 700; }}
.sev-5 {{ background: #b00020; color: white; }} .sev-4 {{ background: #d84315; color: white; }}
.sev-3 {{ background: #ef6c00; color: white; }} .sev-2 {{ background: #fbc02d; color: #333; }}
.sev-1 {{ background: #cfd8dc; color: #333; }} .sev-0 {{ background: #eee; color: #999; }}
.controls {{ display: flex; gap: 12px; margin-bottom: 12px; align-items: center; flex-wrap: wrap; }}
.controls input, .controls select {{ font-size: 14px; padding: 6px 10px; border: 1px solid #ccc; border-radius: 6px; }}
.controls input {{ flex: 1; min-width: 200px; }}
table.findings {{ width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.08); }}
.findings th, .findings td {{ padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; vertical-align: top; font-size: 14px; }}
.findings th {{ background: #fafafa; cursor: pointer; user-select: none; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; color: #555; }}
.findings th:hover {{ background: #f0f0f0; }}
td.title {{ max-width: 220px; }} td.cluster {{ font-size: 12px; color: #666; }}
td.quote {{ max-width: 340px; }} td.ctx {{ max-width: 300px; color: #555; }}
td a {{ color: #1976d2; text-decoration: none; }} td a:hover {{ text-decoration: underline; }}
.count {{ color: #666; font-size: 13px; margin-left: 8px; }} .empty {{ color: #999; }}
</style>
</head>
<body>
<h1>Muslim Channels — Controversial Content Map</h1>
<div class="lead">{grand} findings across {len(CHANNELS)} channels · broad rubric (Israel/Jews, Western-values contradictions, violence, apostasy, conspiracy). Timestamps link into the source video.</div>
<div class="tabs">{''.join(tabs)}</div>
{''.join(panels)}
<script>
document.querySelectorAll('.tab').forEach(tab => {{
  tab.addEventListener('click', () => {{
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  }});
}});
document.querySelectorAll('.panel').forEach(panel => {{
  const tbody = panel.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const q = panel.querySelector('[data-role=q]');
  const clusterF = panel.querySelector('[data-role=cluster]');
  const catF = panel.querySelector('[data-role=cat]');
  const sevF = panel.querySelector('[data-role=sev]');
  const countEl = panel.querySelector('[data-role=count]');
  function apply() {{
    const text = (q.value || '').toLowerCase();
    const cluster = clusterF.value, cat = catF.value;
    const minSev = sevF.value ? parseInt(sevF.value, 10) : 0;
    let visible = 0;
    rows.forEach(r => {{
      if (!r.dataset.category) {{ return; }}
      const ok = (!text || r.innerText.toLowerCase().includes(text))
        && (!cluster || r.dataset.cluster === cluster)
        && (!cat || r.dataset.category === cat)
        && (!minSev || parseInt(r.dataset.severity, 10) >= minSev);
      r.style.display = ok ? '' : 'none';
      if (ok) visible++;
    }});
    if (countEl) countEl.textContent = visible + ' visible';
  }}
  [q, clusterF, catF, sevF].forEach(el => el && el.addEventListener('input', apply));
  [clusterF, catF, sevF].forEach(el => el && el.addEventListener('change', apply));
  apply();
  let sortDir = -1, sortIdx = 0;
  panel.querySelectorAll('th').forEach((th, i) => {{
    th.addEventListener('click', () => {{
      sortDir = (sortIdx === i) ? -sortDir : 1; sortIdx = i;
      [...rows].sort((a, b) => {{
        const av = a.children[i].innerText.trim(), bv = b.children[i].innerText.trim();
        const an = parseFloat(av), bn = parseFloat(bv);
        if (!isNaN(an) && !isNaN(bn)) return (an - bn) * sortDir;
        return av.localeCompare(bv) * sortDir;
      }}).forEach(r => tbody.appendChild(r));
    }});
  }});
}});
</script>
</body>
</html>"""
    OUT_HTML.write_text(page, encoding="utf-8")
    print(f"\nWrote {OUT_HTML}")
    for name, nv, nf in totals:
        print(f"  {name}: {nv} videos, {nf} findings")


if __name__ == "__main__":
    main()
