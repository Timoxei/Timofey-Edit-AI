"""Parse all .srt in a channel folder into deduped '[HH:MM:SS] text' .txt files.

Writes to D:\\All the transcripts\\<folder>\\_parsed\\<videoid>.txt so analysis
agents get clean, timestamped, de-duplicated text (YouTube rolling captions
repeat each line ~2x).

Usage: python parse_srt.py <folder-name>
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = Path(r"D:\All the transcripts")
folder = sys.argv[1]
OUT_DIR = BASE / folder
PARSED = OUT_DIR / "_parsed"
PARSED.mkdir(exist_ok=True)

SRT_BLOCK = re.compile(
    r"(\d+)\s*\n(\d\d):(\d\d):(\d\d)[,\.]\d+\s*-->[^\n]*\n(.+?)(?=\n\n|\Z)", re.DOTALL,
)
VIDEO_ID_RE = re.compile(r"\[([A-Za-z0-9_-]{11})\]\.en\.srt$")


def parse_srt(path: Path) -> str:
    text = path.read_text(encoding="utf-8", errors="replace")
    lines, last = [], ""
    for m in SRT_BLOCK.finditer(text):
        ts = f"{m.group(2)}:{m.group(3)}:{m.group(4)}"
        for raw in m.group(5).strip().splitlines():
            line = raw.strip()
            if not line or line == last:
                continue
            lines.append(f"[{ts}] {line}")
            last = line
    return "\n".join(lines)


count = 0
for srt in sorted(OUT_DIR.iterdir()):
    if srt.suffix != ".srt":
        continue
    m = VIDEO_ID_RE.search(srt.name)
    if not m:
        continue
    vid = m.group(1)
    parsed = parse_srt(srt)
    if not parsed.strip():
        continue
    (PARSED / f"{vid}.txt").write_text(parsed, encoding="utf-8")
    count += 1

print(f"[{folder}] parsed {count} transcripts -> {PARSED}")
