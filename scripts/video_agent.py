#!/usr/bin/env python3
"""
video_agent.py — Download and cut YouTube videos.

Usage:
  python scripts/video_agent.py download <URL> [--out DIR] [--quality 1080]
  python scripts/video_agent.py cut <input.mp4> <output.mp4> --remove START-END [--remove START-END ...]

Timestamp format: seconds (9:55), or with milliseconds (9:55.500)
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request


def parse_timestamp(ts: str) -> float:
    """Parse M:SS, MM:SS, H:MM:SS, 'end', or any of those with .mmm into seconds (float).
    'end' returns float('inf') to mean until end of file."""
    ts = ts.strip().lower()
    if ts == "end":
        return float("inf")
    millis = 0.0
    if "." in ts:
        ts, ms = ts.rsplit(".", 1)
        millis = float("0." + ms)
    parts = ts.split(":")
    parts = [float(p) for p in parts]
    if len(parts) == 1:
        seconds = parts[0]
    elif len(parts) == 2:
        seconds = parts[0] * 60 + parts[1]
    elif len(parts) == 3:
        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2]
    else:
        raise ValueError(f"Cannot parse timestamp: {ts!r}")
    return seconds + millis


def extract_video_id(url: str) -> str:
    """Extract YouTube video ID from a URL or return the string as-is if it looks like an ID."""
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme in ("http", "https"):
        if "youtu.be" in parsed.netloc:
            return parsed.path.lstrip("/").split("/")[0]
        qs = urllib.parse.parse_qs(parsed.query)
        if "v" in qs:
            return qs["v"][0]
    # Assume raw ID
    return url


def fetch_sponsorblock_segments(video_id: str) -> list:
    """Query SponsorBlock API and return list of (start, end) float tuples.
    Returns empty list if no data found."""
    api_url = f"https://sponsor.ajay.app/api/skipSegments?videoID={video_id}"
    try:
        with urllib.request.urlopen(api_url, timeout=10) as resp:
            data = json.loads(resp.read())
        segments = []
        for item in data:
            start, end = item["segment"]
            segments.append((float(start), float(end)))
        print(f"SponsorBlock: found {len(segments)} segment(s) to remove")
        for s, e in segments:
            print(f"  [{seconds_to_ffmpeg(s)} -> {seconds_to_ffmpeg(e)}] category={item.get('category', '?')}")
        return segments
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print("SponsorBlock: no segments found for this video")
        else:
            print(f"SponsorBlock: HTTP {e.code} - skipping")
        return []
    except Exception as e:
        print(f"SponsorBlock: error fetching segments ({e}) — skipping")
        return []


def seconds_to_ffmpeg(s: float) -> str:
    """Convert float seconds to HH:MM:SS.mmm for ffmpeg."""
    h = int(s // 3600)
    m = int((s % 3600) // 60)
    sec = s % 60
    return f"{h:02d}:{m:02d}:{sec:06.3f}"


def run(cmd: list, label: str = ""):
    """Run a subprocess, streaming output. Exit on failure."""
    if label:
        print(f"\n>> {label}")
    print(" ".join(cmd))
    result = subprocess.run(cmd)
    if result.returncode != 0:
        print(f"\nError: command failed with exit code {result.returncode}", file=sys.stderr)
        sys.exit(result.returncode)


def cmd_download(args):
    out_dir = args.out or "D:/Claude Experiments/Music"
    os.makedirs(out_dir, exist_ok=True)

    quality = args.quality or 1080
    fmt = f"bestvideo[ext=mp4][height={quality}]+bestaudio[ext=m4a]/bestvideo[ext=mp4][height<={quality}]+bestaudio[ext=m4a]/best[ext=mp4]"

    yt_cmd = [
        "yt-dlp",
        "-f", fmt,
        "--write-subs",
        "--sub-langs", "en",
        "--convert-subs", "srt",
        "--write-thumbnail",
        "--convert-thumbnails", "jpg",
        "-o", os.path.join(out_dir, "%(title)s.%(ext)s"),
        args.url,
    ]
    run(yt_cmd, "Downloading video, transcript, and thumbnail")
    print(f"\nDone. Files saved to: {out_dir}")


def cmd_cut(args):
    input_file = args.input
    output_file = args.output

    if not os.path.exists(input_file):
        print(f"Error: input file not found: {input_file}", file=sys.stderr)
        sys.exit(1)

    # Parse and sort remove ranges
    ranges = []
    for r in args.remove:
        parts = r.split("-", 1)
        if len(parts) != 2:
            print(f"Error: invalid range format '{r}'. Use START-END e.g. 9:55-10:04", file=sys.stderr)
            sys.exit(1)
        start = parse_timestamp(parts[0])
        end = parse_timestamp(parts[1])
        if end <= start:
            print(f"Error: end must be after start in range '{r}'", file=sys.stderr)
            sys.exit(1)
        ranges.append((start, end))

    ranges.sort()

    # Build list of keep segments: [0, r1.start], [r1.end, r2.start], ..., [rN.end, EOF]
    keep_segments = []
    cursor = 0.0
    for start, end in ranges:
        if start > cursor:
            keep_segments.append((cursor, start))
        cursor = end
    keep_segments.append((cursor, None))  # None = until end of file

    print(f"\nKeeping {len(keep_segments)} segment(s), removing {len(ranges)} range(s):")
    for i, (s, e) in enumerate(keep_segments):
        end_str = seconds_to_ffmpeg(e) if e else "EOF"
        print(f"  Segment {i+1}: {seconds_to_ffmpeg(s)} -> {end_str}")

    with tempfile.TemporaryDirectory() as tmpdir:
        part_files = []

        for i, (seg_start, seg_end) in enumerate(keep_segments):
            part_path = os.path.join(tmpdir, f"part{i:03d}.mp4")
            part_files.append(part_path)

            ffcmd = ["ffmpeg", "-i", input_file, "-ss", seconds_to_ffmpeg(seg_start)]
            if seg_end is not None:
                duration = seg_end - seg_start
                ffcmd += ["-t", f"{duration:.3f}"]
            ffcmd += ["-c:v", "libx264", "-preset", "veryfast", "-c:a", "aac", part_path, "-y"]

            run(ffcmd, f"Encoding segment {i+1}/{len(keep_segments)}")

        # Write concat list
        concat_list = os.path.join(tmpdir, "concat.txt")
        with open(concat_list, "w") as f:
            for p in part_files:
                f.write(f"file '{p}'\n")

        run(
            ["ffmpeg", "-f", "concat", "-safe", "0", "-i", concat_list, "-c", "copy", output_file, "-y"],
            "Merging segments"
        )

    print(f"\nDone. Output: {output_file}")


def cmd_process(args):
    """Download a YouTube video, apply SponsorBlock cuts + manual cuts in one pass."""
    video_id = extract_video_id(args.url)
    out_dir = args.out or "D:/Claude Experiments/Videos"
    os.makedirs(out_dir, exist_ok=True)

    # Step 1: Download raw video to temp dir
    with tempfile.TemporaryDirectory() as tmpdir:
        quality = args.quality or 1080
        fmt = f"bestvideo[ext=mp4][height={quality}]+bestaudio[ext=m4a]/bestvideo[ext=mp4][height<={quality}]+bestaudio[ext=m4a]/best[ext=mp4]"

        yt_cmd = [
            "yt-dlp",
            "-f", fmt,
            "--no-sponsorblock",  # download raw; we apply SB cuts ourselves
            "-o", os.path.join(tmpdir, "%(title)s.%(ext)s"),
            "--print", "after_move:filepath",
            args.url,
        ]
        print("\n>> Downloading video (raw, no SponsorBlock)")
        print(" ".join(yt_cmd))
        result = subprocess.run(yt_cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(result.stderr, file=sys.stderr)
            sys.exit(result.returncode)

        # Find the downloaded mp4
        downloaded = None
        for line in result.stdout.strip().splitlines():
            line = line.strip()
            if line.endswith(".mp4") and os.path.exists(line):
                downloaded = line
                break
        if not downloaded:
            # Fallback: find the mp4 in tmpdir
            for fn in os.listdir(tmpdir):
                if fn.endswith(".mp4"):
                    downloaded = os.path.join(tmpdir, fn)
                    break
        if not downloaded:
            print("Error: could not locate downloaded video file.", file=sys.stderr)
            sys.exit(1)

        title = os.path.splitext(os.path.basename(downloaded))[0]
        output_file = os.path.join(out_dir, f"{title} [cut].mp4")
        print(f"\nDownloaded: {downloaded}")

        # Step 2: Fetch SponsorBlock segments
        sb_segments = fetch_sponsorblock_segments(video_id)

        # Step 3: Parse manual --remove ranges
        manual_ranges = []
        for r in (args.remove or []):
            parts = r.split("-", 1)
            if len(parts) != 2:
                print(f"Error: invalid range '{r}'. Use START-END e.g. 17:40-17:51", file=sys.stderr)
                sys.exit(1)
            start = parse_timestamp(parts[0])
            end = parse_timestamp(parts[1])
            manual_ranges.append((start, end))

        # Step 4: Merge and sort all removal ranges
        all_ranges = sb_segments + manual_ranges
        all_ranges.sort()

        if not all_ranges:
            print("\nNo segments to remove — copying file as-is.")
            import shutil
            shutil.copy2(downloaded, output_file)
            print(f"\nDone. Output: {output_file}")
            return

        print(f"\nTotal segments to remove: {len(all_ranges)}")

        # Step 5: Build keep segments
        keep_segments = []
        cursor = 0.0
        for start, end in all_ranges:
            if start > cursor:
                keep_segments.append((cursor, start))
            cursor = max(cursor, end)
        if cursor != float("inf"):
            keep_segments.append((cursor, None))  # None = until EOF

        print(f"\nKeeping {len(keep_segments)} segment(s):")
        for i, (s, e) in enumerate(keep_segments):
            end_str = seconds_to_ffmpeg(e) if e is not None else "EOF"
            print(f"  Segment {i+1}: {seconds_to_ffmpeg(s)} -> {end_str}")

        # Step 6: Encode segments and concat
        part_files = []
        # Use a second temp dir for parts (we're inside the first tmpdir already)
        parts_dir = os.path.join(tmpdir, "parts")
        os.makedirs(parts_dir, exist_ok=True)

        for i, (seg_start, seg_end) in enumerate(keep_segments):
            part_path = os.path.join(parts_dir, f"part{i:03d}.mp4")
            part_files.append(part_path)

            ffcmd = ["ffmpeg", "-i", downloaded, "-ss", seconds_to_ffmpeg(seg_start)]
            if seg_end is not None:
                duration = seg_end - seg_start
                ffcmd += ["-t", f"{duration:.3f}"]
            ffcmd += ["-c:v", "libx264", "-preset", "veryfast", "-c:a", "aac", part_path, "-y"]
            run(ffcmd, f"Encoding segment {i+1}/{len(keep_segments)}")

        concat_list = os.path.join(parts_dir, "concat.txt")
        with open(concat_list, "w") as f:
            for p in part_files:
                f.write(f"file '{p}'\n")

        run(
            ["ffmpeg", "-f", "concat", "-safe", "0", "-i", concat_list, "-c", "copy", output_file, "-y"],
            "Merging segments"
        )

    print(f"\nDone. Output: {output_file}")


def interactive():
    """Interactive mode — guides the user step by step."""
    print("=== Video Agent ===")
    print("1. Download video (+ transcript + thumbnail)")
    print("2. Cut / remove a segment from a video")
    choice = input("\nWhat do you want to do? (1 or 2): ").strip()

    if choice == "1":
        url = input("YouTube URL: ").strip()
        out = input(f"Output folder [D:/Claude Experiments/Music]: ").strip()
        if not out:
            out = "D:/Claude Experiments/Music"

        class Args:
            pass
        args = Args()
        args.url = url
        args.out = out
        args.quality = 1080
        cmd_download(args)

    elif choice == "2":
        input_file = input("Input video file path: ").strip().strip('"')
        # Suggest output name automatically
        base, ext = os.path.splitext(input_file)
        suggested_output = base + " [cut]" + ext
        output_file = input(f"Output file [{suggested_output}]: ").strip().strip('"')
        if not output_file:
            output_file = suggested_output

        ranges = []
        print("Enter segments to REMOVE (e.g. 9:55-10:04 or 9:55.500-10:04). Leave blank when done.")
        while True:
            r = input(f"  Remove segment {len(ranges)+1} (or Enter to finish): ").strip()
            if not r:
                break
            ranges.append(r)

        if not ranges:
            print("No ranges entered, nothing to do.")
            return

        class Args:
            pass
        args = Args()
        args.input = input_file
        args.output = output_file
        args.remove = ranges
        cmd_cut(args)

    else:
        print("Invalid choice.")


def main():
    # No arguments = interactive mode
    if len(sys.argv) == 1:
        interactive()
        return

    parser = argparse.ArgumentParser(description="YouTube video download and cut agent")
    sub = parser.add_subparsers(dest="command", required=True)

    # download
    dl = sub.add_parser("download", help="Download video, transcript, and thumbnail")
    dl.add_argument("url", help="YouTube URL")
    dl.add_argument("--out", help="Output directory (default: D:/Claude Experiments/Music)")
    dl.add_argument("--quality", type=int, default=1080, help="Video quality height (default: 1080)")

    # cut
    ct = sub.add_parser("cut", help="Remove segments from a video")
    ct.add_argument("input", help="Input video file")
    ct.add_argument("output", help="Output video file")
    ct.add_argument("--remove", action="append", required=True,
                    metavar="START-END",
                    help="Timestamp range to remove, e.g. 9:55-10:04 or 9:55.500-10:04.200. Can be used multiple times.")

    # process
    pr = sub.add_parser("process", help="Download a YouTube video, apply SponsorBlock + manual cuts in one pass")
    pr.add_argument("url", help="YouTube URL")
    pr.add_argument("--out", help="Output directory (default: D:/Claude Experiments/Videos)")
    pr.add_argument("--quality", type=int, default=1080, help="Video quality height (default: 1080)")
    pr.add_argument("--remove", action="append", metavar="START-END",
                    help="Additional timestamp range to remove, e.g. 17:40-17:51 or 25:42-end. Can be used multiple times.")

    args = parser.parse_args()

    if args.command == "download":
        cmd_download(args)
    elif args.command == "cut":
        cmd_cut(args)
    elif args.command == "process":
        cmd_process(args)


if __name__ == "__main__":
    main()
