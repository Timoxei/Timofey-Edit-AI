"""Loop download_channel.py across cycles with cooldowns until coverage stalls.

Each cycle runs download_channel.py <folder> --sleep <sleep>. That script has its
own internal exponential backoff (up to 1h cumulative block-wait) and then exits;
between cycles we cool down to let YouTube's per-IP throttle relax. Bail when the
target is reached or after N consecutive zero-gain cycles.

Usage: python loop_download.py <folder> [--target N] [--sleep S] [--cooldown SEC] [--max-cycles N] [--stall N]
"""
import argparse
import os
import subprocess
import sys
import time

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = r"D:\All the transcripts"
SCRIPT = os.path.join(os.path.dirname(__file__), "download_channel.py")
PY = sys.executable

parser = argparse.ArgumentParser()
parser.add_argument("folder")
parser.add_argument("--target", type=int, default=10**9)
parser.add_argument("--sleep", type=float, default=4.0)
parser.add_argument("--cooldown", type=int, default=300)
parser.add_argument("--max-cycles", type=int, default=15)
parser.add_argument("--stall", type=int, default=3, help="Stop after N consecutive zero-gain cycles")
args = parser.parse_args()

OUT_DIR = os.path.join(BASE, args.folder)


def srt_count() -> int:
    return sum(1 for n in os.listdir(OUT_DIR) if n.endswith(".srt"))


zero_streak = 0
for c in range(1, args.max_cycles + 1):
    have = srt_count()
    if have >= args.target:
        print(f"\nTarget {args.target} reached ({have}).", flush=True)
        break
    print(f"\n=== Cycle {c}/{args.max_cycles}: {have} SRTs (target {args.target}) ===", flush=True)
    subprocess.run([PY, SCRIPT, args.folder, "--sleep", str(args.sleep)])
    gained = srt_count() - have
    print(f"=== Cycle {c} ended: +{gained} (now {srt_count()}) ===", flush=True)
    if gained == 0:
        zero_streak += 1
        if zero_streak >= args.stall:
            print(f"\nStopping: {zero_streak} consecutive zero-gain cycles (IP throttled).", flush=True)
            break
    else:
        zero_streak = 0
    if srt_count() < args.target and c < args.max_cycles:
        print(f"Cooling down {args.cooldown}s...", flush=True)
        time.sleep(args.cooldown)

print(f"\nFinal SRT count: {srt_count()}", flush=True)
