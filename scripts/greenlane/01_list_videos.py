"""List up to 1000 videos from @greenlanemasjid into a manifest JSON.

Output: D:\\All the transcripts\\greenlanemasjid\\_manifest.json
"""
import json
import os
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHANNEL_URL = "https://www.youtube.com/@greenlanemasjid/videos"
LIMIT = 1000
OUT_DIR = r"D:\All the transcripts\greenlanemasjid"
MANIFEST = os.path.join(OUT_DIR, "_manifest.json")

os.makedirs(OUT_DIR, exist_ok=True)

SEP = "|||"
FIELDS = ["id", "title", "upload_date", "duration", "view_count"]
fmt = SEP.join(f"%({f})s" for f in FIELDS)

print(f"Listing up to {LIMIT} videos from {CHANNEL_URL}...")
result = subprocess.run(
    [
        "yt-dlp",
        "--flat-playlist",
        "--playlist-end", str(LIMIT),
        "--print", fmt,
        "--no-warnings",
        CHANNEL_URL,
    ],
    capture_output=True,
    text=True,
    encoding="utf-8",
    errors="replace",
)

if result.returncode != 0:
    print("yt-dlp failed:", file=sys.stderr)
    print(result.stderr, file=sys.stderr)
    sys.exit(1)

videos = []
for line in result.stdout.splitlines():
    line = line.strip()
    if not line or SEP not in line:
        continue
    parts = line.split(SEP)
    if len(parts) != len(FIELDS):
        continue
    vid_id, title, upload_date, duration, view_count = parts
    videos.append({
        "id": vid_id,
        "title": title,
        "upload_date": upload_date if upload_date != "NA" else None,
        "duration_s": int(duration) if duration.isdigit() else None,
        "view_count": int(view_count) if view_count.isdigit() else None,
    })

with open(MANIFEST, "w", encoding="utf-8") as f:
    json.dump(videos, f, ensure_ascii=False, indent=2)

print(f"Wrote {len(videos)} entries to {MANIFEST}")
