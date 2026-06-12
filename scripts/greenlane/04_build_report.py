"""Build a sortable HTML dashboard from the batch findings.

Reads:
    D:\\All the transcripts\\greenlanemasjid\\_manifest.json
    D:\\All the transcripts\\greenlanemasjid\\_findings.json

Writes:
    C:\\Users\\user\\Timofey-Edit-AI\\greenlane_red_flags.html
"""
import html
import json
import re
import sys
from collections import Counter
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

DATA_DIR = Path(r"D:\All the transcripts\greenlanemasjid")
MANIFEST = DATA_DIR / "_manifest.json"
FINDINGS = DATA_DIR / "_findings.json"
OUT_HTML = Path(r"C:\Users\user\Timofey-Edit-AI\greenlane_red_flags.html")

CATEGORY_COLORS = {
    "INCITEMENT_VIOLENCE": "#b00020",
    "TERROR_SUPPORT": "#7c0000",
    "ANTISEMITISM": "#d32f2f",
    "ANTI_LGBT": "#e64a19",
    "MISOGYNY": "#c2185b",
    "SECTARIAN_HATE": "#6a1b9a",
    "INTER_FAITH_HATE": "#4527a0",
    "ANTI_DEMOCRATIC": "#283593",
    "CONSPIRACY": "#1565c0",
    "APOSTASY_PUNISHMENT": "#00838f",
    "CHILD_MARRIAGE": "#ad1457",
    "OTHER": "#546e7a",
}


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
    findings_by_vid = json.loads(FINDINGS.read_text(encoding="utf-8"))

    rows = []
    cat_counts: Counter[str] = Counter()
    sev_counts: Counter[int] = Counter()
    findings_per_video: Counter[str] = Counter()

    for vid_id, data in findings_by_vid.items():
        for f in data.get("findings", []) or []:
            ts = f.get("timestamp", "")
            secs = ts_to_seconds(ts)
            cat = f.get("category", "OTHER")
            sev = int(f.get("severity", 0) or 0)
            rows.append({
                "vid_id": vid_id,
                "title": title_by_id.get(vid_id, vid_id),
                "ts": ts,
                "secs": secs,
                "category": cat,
                "severity": sev,
                "quote": f.get("quote", ""),
                "context": f.get("context", ""),
            })
            cat_counts[cat] += 1
            sev_counts[sev] += 1
            findings_per_video[vid_id] += 1

    rows.sort(key=lambda r: (-r["severity"], r["category"], r["title"]))

    top_videos = findings_per_video.most_common(10)

    def cell(s: str) -> str:
        return html.escape(s, quote=True)

    row_html = []
    for r in rows:
        link = f"https://youtu.be/{r['vid_id']}?t={r['secs']}s"
        color = CATEGORY_COLORS.get(r["category"], "#546e7a")
        row_html.append(
            f'<tr data-severity="{r["severity"]}" data-category="{cell(r["category"])}">'
            f'<td class="sev sev-{r["severity"]}">{r["severity"]}</td>'
            f'<td><span class="cat" style="background:{color}">{cell(r["category"])}</span></td>'
            f'<td class="title">{cell(r["title"])}</td>'
            f'<td><a href="{cell(link)}" target="_blank" rel="noopener">{cell(r["ts"])}</a></td>'
            f'<td class="quote">{cell(r["quote"])}</td>'
            f'<td class="ctx">{cell(r["context"])}</td>'
            f"</tr>"
        )

    cat_summary = "".join(
        f'<li><span class="cat" style="background:{CATEGORY_COLORS.get(c, "#546e7a")}">{cell(c)}</span> {n}</li>'
        for c, n in cat_counts.most_common()
    )
    sev_summary = "".join(
        f'<li><span class="sev sev-{s}">{s}</span> {n}</li>' for s, n in sorted(sev_counts.items(), reverse=True)
    )
    top_videos_html = "".join(
        f'<li><a href="https://youtu.be/{vid_id}" target="_blank" rel="noopener">{cell(title_by_id.get(vid_id, vid_id))}</a> — {n} findings</li>'
        for vid_id, n in top_videos
    )

    category_filter_options = "".join(
        f'<option value="{cell(c)}">{cell(c)} ({n})</option>' for c, n in cat_counts.most_common()
    )

    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Green Lane Masjid — Red-Flag Scan</title>
<style>
body {{ font-family: -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; padding: 24px; background: #f4f4f7; color: #111; }}
h1 {{ margin: 0 0 4px; }}
.subtitle {{ color: #666; margin-bottom: 24px; }}
.summary {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }}
.card {{ background: white; border-radius: 8px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }}
.card h3 {{ margin: 0 0 8px; font-size: 14px; color: #555; text-transform: uppercase; letter-spacing: .5px; }}
.card ul {{ list-style: none; padding: 0; margin: 0; }}
.card li {{ padding: 4px 0; font-size: 14px; }}
.cat {{ display: inline-block; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: .3px; }}
.sev {{ display: inline-block; min-width: 22px; text-align: center; padding: 2px 6px; border-radius: 4px; font-weight: 700; }}
.sev-5 {{ background: #b00020; color: white; }}
.sev-4 {{ background: #d84315; color: white; }}
.sev-3 {{ background: #ef6c00; color: white; }}
.sev-2 {{ background: #fbc02d; color: #333; }}
.sev-1 {{ background: #cfd8dc; color: #333; }}
.controls {{ display: flex; gap: 12px; margin-bottom: 12px; align-items: center; }}
.controls input, .controls select {{ font-size: 14px; padding: 6px 10px; border: 1px solid #ccc; border-radius: 6px; }}
.controls input {{ flex: 1; }}
table {{ width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.08); }}
th, td {{ padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; vertical-align: top; font-size: 14px; }}
th {{ background: #fafafa; cursor: pointer; user-select: none; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; color: #555; }}
th:hover {{ background: #f0f0f0; }}
td.title {{ max-width: 240px; }}
td.quote {{ max-width: 360px; }}
td.ctx {{ max-width: 320px; color: #555; }}
td a {{ color: #1976d2; text-decoration: none; }}
td a:hover {{ text-decoration: underline; }}
.count {{ color: #666; font-size: 13px; margin-left: 8px; }}
</style>
</head>
<body>
<h1>Green Lane Masjid — Red-Flag Scan</h1>
<div class="subtitle">{len(findings_by_vid)} videos analyzed · {len(rows)} findings flagged</div>

<div class="summary">
  <div class="card">
    <h3>Findings by category</h3>
    <ul>{cat_summary or '<li>No findings.</li>'}</ul>
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
<th data-key="title">Video</th>
<th data-key="secs">Time</th>
<th data-key="quote">Quote</th>
<th data-key="context">Context</th>
</tr>
</thead>
<tbody>
{''.join(row_html) or '<tr><td colspan="6" style="padding:24px;text-align:center;color:#888">No findings.</td></tr>'}
</tbody>
</table>

<script>
const tbl = document.getElementById('findings');
const tbody = tbl.querySelector('tbody');
const rows = Array.from(tbody.querySelectorAll('tr'));
const q = document.getElementById('q');
const catF = document.getElementById('cat-filter');
const sevF = document.getElementById('sev-filter');
const countEl = document.getElementById('visible-count');

function applyFilters() {{
  const text = q.value.toLowerCase();
  const cat = catF.value;
  const minSev = sevF.value ? parseInt(sevF.value, 10) : 0;
  let visible = 0;
  rows.forEach(r => {{
    const rowText = r.innerText.toLowerCase();
    const rowCat = r.getAttribute('data-category');
    const rowSev = parseInt(r.getAttribute('data-severity'), 10);
    const ok = (!text || rowText.includes(text))
      && (!cat || rowCat === cat)
      && (!minSev || rowSev >= minSev);
    r.style.display = ok ? '' : 'none';
    if (ok) visible++;
  }});
  countEl.textContent = visible + ' visible';
}}
q.addEventListener('input', applyFilters);
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


if __name__ == "__main__":
    main()
