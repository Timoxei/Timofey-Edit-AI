"""Generalized transcript downloader (any channel folder under D:\\All the transcripts).

Uses youtube-transcript-api with exponential backoff on IP blocks — the same
strategy that survived the Green Lane run's 429 storms. Reads _manifest.json
in the target folder, writes YYYYMMDD - title [id].en.srt (00000000 placeholder
date, matching 02b), and appends a _download.log.

Usage:
    python download_channel.py <folder-name> [--limit N] [--sleep S]
    python download_channel.py wayoflifesq --sleep 3
"""
import argparse
import json
import os
import re
import sys
import time

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
)

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = r"D:\All the transcripts"

parser = argparse.ArgumentParser()
parser.add_argument("folder", help="Channel folder name under D:\\All the transcripts")
parser.add_argument("--limit", type=int, default=None)
parser.add_argument("--sleep", type=float, default=1.5, help="Seconds between requests")
args = parser.parse_args()

OUT_DIR = os.path.join(BASE, args.folder)
MANIFEST = os.path.join(OUT_DIR, "_manifest.json")
LOG = os.path.join(OUT_DIR, "_download.log")


def sanitize(name: str) -> str:
    name = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "", name)
    return name.strip().strip(".") or "untitled"


def to_srt(snippets) -> str:
    def fmt(t: float) -> str:
        ms = int(round(t * 1000))
        h, ms = divmod(ms, 3_600_000)
        m, ms = divmod(ms, 60_000)
        s, ms = divmod(ms, 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    out = []
    for i, sn in enumerate(snippets, 1):
        start = sn.start
        end = sn.start + sn.duration
        text = sn.text.replace("\n", " ").strip()
        out.append(f"{i}\n{fmt(start)} --> {fmt(end)}\n{text}\n")
    return "\n".join(out)


with open(MANIFEST, encoding="utf-8") as f:
    videos = json.load(f)

existing_ids = set()
for n in os.listdir(OUT_DIR):
    if n.endswith(".en.srt") and "[" in n and "]" in n:
        existing_ids.add(n.rsplit("[", 1)[1].split("]", 1)[0])

no_en_ids = set()
if os.path.exists(LOG):
    with open(LOG, encoding="utf-8") as f:
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) >= 2 and parts[0] == "no-en":
                no_en_ids.add(parts[1])

before = len(videos)
videos = [v for v in videos if v["id"] not in existing_ids and v["id"] not in no_en_ids]
print(f"[{args.folder}] Skipping {before - len(videos)} already-handled; {len(videos)} remain")

if args.limit:
    videos = videos[: args.limit]

print(f"Fetching transcripts for {len(videos)} videos -> {OUT_DIR}", flush=True)

api = YouTubeTranscriptApi()
ok = fail = no_en = 0
log_lines = []
total_block_wait = 0
MAX_TOTAL_BLOCK_WAIT = 3600
aborted = False


def try_fetch(vid):
    try:
        f = api.fetch(vid, languages=["en"])
        return f.snippets, "en"
    except NoTranscriptFound:
        tlist = api.list(vid)
        for t in tlist:
            if t.is_translatable:
                f = t.translate("en").fetch()
                return f.snippets, f"{t.language_code}->en"
        raise


for i, v in enumerate(videos, 1):
    vid = v["id"]
    title = v["title"]
    fname = f"00000000 - {sanitize(title)} [{vid}].en.srt"
    path = os.path.join(OUT_DIR, fname)
    print(f"[{i}/{len(videos)}] {title[:70]}", flush=True)

    cur_backoff = 60
    while True:
        try:
            snippets, source = try_fetch(vid)
            with open(path, "w", encoding="utf-8") as f:
                f.write(to_srt(snippets))
            ok += 1
            print(f"  ok\t{source}\t(ok={ok})", flush=True)
            log_lines.append(f"ok\t{vid}\t{source}\t{title}")
            break
        except NoTranscriptFound:
            no_en += 1
            print(f"  no-en\t{vid}", flush=True)
            log_lines.append(f"no-en\t{vid}\t{title}")
            break
        except (TranscriptsDisabled, VideoUnavailable) as e:
            fail += 1
            print(f"  fail\t{type(e).__name__}", flush=True)
            log_lines.append(f"fail\t{vid}\t{type(e).__name__}\t{title}")
            break
        except Exception as e:
            name = type(e).__name__
            if name == "IpBlocked":
                if total_block_wait >= MAX_TOTAL_BLOCK_WAIT:
                    print(f"\nAborting: cumulative block wait {total_block_wait}s", flush=True)
                    aborted = True
                    break
                wait = min(cur_backoff, MAX_TOTAL_BLOCK_WAIT - total_block_wait)
                print(f"  IpBlocked — sleeping {wait}s (cum {total_block_wait + wait}s)", flush=True)
                time.sleep(wait)
                total_block_wait += wait
                cur_backoff = min(cur_backoff * 2, 600)
                continue
            else:
                fail += 1
                print(f"  fail\t{name}: {str(e)[:100]}", flush=True)
                log_lines.append(f"fail\t{vid}\t{name}\t{str(e)[:100]}")
                break

    if aborted:
        break
    time.sleep(args.sleep)

with open(LOG, "a", encoding="utf-8") as f:
    f.write("\n".join(log_lines) + "\n")

srt_count = sum(1 for n in os.listdir(OUT_DIR) if n.endswith(".srt"))
print(f"\n[{args.folder}] Done. ok={ok} no-en={no_en} fail={fail}")
print(f"Total .srt in folder: {srt_count}")
