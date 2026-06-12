"""Download English transcripts for every video in the manifest.

Usage:
    python 02_download_transcripts.py            # all videos
    python 02_download_transcripts.py --limit 5  # first 5 only (smoke test)

Output: D:\\All the transcripts\\greenlanemasjid\\YYYYMMDD - title [id].en.srt
Log:    D:\\All the transcripts\\greenlanemasjid\\_download.log
"""
import argparse
import json
import os
import subprocess
import sys
import time

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

OUT_DIR = r"D:\All the transcripts\greenlanemasjid"
MANIFEST = os.path.join(OUT_DIR, "_manifest.json")
LOG = os.path.join(OUT_DIR, "_download.log")

parser = argparse.ArgumentParser()
parser.add_argument("--limit", type=int, default=None, help="Only download first N videos")
args = parser.parse_args()

with open(MANIFEST, encoding="utf-8") as f:
    videos = json.load(f)

if args.limit:
    videos = videos[: args.limit]

print(f"Downloading transcripts for {len(videos)} videos to {OUT_DIR}")
log_lines = []

for i, v in enumerate(videos, 1):
    vid_id = v["id"]
    title = v["title"]
    print(f"[{i}/{len(videos)}] {title}")
    result = subprocess.run(
        [
            "yt-dlp",
            "--write-auto-sub", "--write-sub",
            "--sub-lang", "en",
            "--skip-download",
            "--convert-subs", "srt",
            "--no-overwrites",
            "--no-warnings",
            "--quiet",
            "--sleep-interval", "2",
            "--output", os.path.join(OUT_DIR, f"%(upload_date)s - %(title)s [{vid_id}].%(ext)s"),
            f"https://www.youtube.com/watch?v={vid_id}",
        ]
    )
    status = "ok" if result.returncode == 0 else "fail"
    log_lines.append(f"{status}\t{vid_id}\t{title}")
    if result.returncode != 0:
        print(f"  WARNING: yt-dlp failed for {vid_id}")
    time.sleep(1)

with open(LOG, "w", encoding="utf-8") as f:
    f.write("\n".join(log_lines) + "\n")

# Count .srt files actually present
srt_count = sum(1 for n in os.listdir(OUT_DIR) if n.endswith(".srt"))
print(f"\nDone. Log: {LOG}")
print(f"Total .srt files in folder: {srt_count}")
