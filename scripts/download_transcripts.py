import subprocess
import os
import sys
import time

# Fix Windows console Unicode issues
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = r"D:\All the transcripts"

PROTEST_KEYWORDS = [
    "protest", "protester", "rally", "march", "demonstrat", "activist",
    "paid protest", "riot", "uprising"
]
IMMIGRANT_KEYWORDS = [
    "immigrant", "immigration", "migrant", "undocumented", "border",
    "deport", "asylum", "refugee", "illegal alien", "migrant crisis"
]

def categorize(title: str) -> str:
    t = title.lower()
    if any(k in t for k in PROTEST_KEYWORDS):
        return "protests"
    if any(k in t for k in IMMIGRANT_KEYWORDS):
        return "immigrant"
    return ""  # root

lines = open(r"C:\Users\user\AppData\Local\Temp\nate_videos.txt", encoding="utf-8", errors="replace").read().splitlines()

for i, line in enumerate(lines):
    if "|||" not in line:
        continue
    vid_id, title = line.split("|||", 1)
    subfolder = categorize(title)
    folder = os.path.join(BASE, subfolder)
    label = f"[{subfolder}]" if subfolder else "[root]"
    print(f"[{i+1}/{len(lines)}] {label} {title}")
    result = subprocess.run([
        "yt-dlp",
        "--write-auto-sub", "--write-sub",
        "--sub-lang", "en",
        "--skip-download",
        "--convert-subs", "srt",
        "--no-overwrites",
        "--no-warnings",
        "--quiet",
        "--sleep-interval", "2",
        "--output", os.path.join(folder, f"%(upload_date)s - %(title)s [{vid_id}].%(ext)s"),
        f"https://www.youtube.com/watch?v={vid_id}"
    ])
    if result.returncode != 0:
        print(f"  WARNING: yt-dlp failed for {vid_id}, skipping")
    time.sleep(1)

print("\nDone!")
