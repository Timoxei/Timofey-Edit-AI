#!/usr/bin/env python3
"""
Download ALL Instagram reels from @natefriedman_, sorted by view count.

Uses instaloader for metadata + download (yt-dlp IG extractor is broken).
Requires a valid sessionid cookie from Chrome/Edge DevTools.

Phases:
  A) Fetch metadata (caption, upload_date, view_count, duration) via instaloader
  B) Sort by views, download all to Google Drive
  C) Upload to Airtable "Instagram Reels" table

Usage:
  python scripts/download_ig_reels.py                          # Run phases A+B
  python scripts/download_ig_reels.py --metadata-only          # Phase A only
  python scripts/download_ig_reels.py --download-only          # Phase B only
  python scripts/download_ig_reels.py --airtable-only --airtable-token TOKEN
  python scripts/download_ig_reels.py --sessionid SESSIONID    # Custom session
"""
import argparse
import json
import os
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
OUTPUT_DIR = Path(r"G:\Shared drives\Scratch Disk\Shortform\Instagram")
CHECKPOINT = Path(__file__).parent / "ig_reels_metadata.json"
SCRAPED_FILE = Path(__file__).parent / "ig_reels_scraped.json"
FB_METADATA = Path(__file__).parent / "fb_reels_metadata.json"

AIRTABLE_BASE = "appAHsD9aNg3AQf35"
AIRTABLE_TABLE = "Instagram Reels"

# Default sessionid — update when it expires
DEFAULT_SESSIONID = "25350330286%3AdaGUmHKocDOH3c%3A9%3AAYgOchHLWgquWRY0lDmg_1eecAJHZuMr2-LGWg223w"


def fmt_views(n: int) -> str:
    if n >= 1_000_000:
        return f"{n/1_000_000:.1f}M"
    if n >= 10_000:
        return f"{round(n/1_000)}K"
    if n >= 1_000:
        return f"{n/1_000:.1f}K"
    return str(n)


def safe_title(title: str, max_len: int = 70) -> str:
    safe = "".join(c if c.isalnum() or c in " ,-.'!?" else " " for c in title)
    return " ".join(safe.split())[:max_len].strip(" .-")


def make_filename(rank: int, reel: dict) -> str:
    date_str = reel.get("upload_date", "")
    views_disp = fmt_views(reel.get("view_count", 0))
    title = safe_title(reel.get("title", "") or reel.get("shortcode", ""))
    return f"{rank:03d}. {date_str} - {views_disp} - {title}.mp4"


def get_loader(sessionid: str):
    """Create an instaloader instance with session cookie."""
    import instaloader
    L = instaloader.Instaloader(
        download_videos=True,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
    )
    L.context._session.cookies.set("sessionid", sessionid, domain=".instagram.com")
    return L


def get_metadata_instaloader(shortcode: str, loader) -> dict | None:
    """Fetch reel metadata via instaloader."""
    from instaloader import Post
    try:
        post = Post.from_shortcode(loader.context, shortcode)
        caption = (post.caption or "")[:120].replace("\n", " ")
        return {
            "shortcode": shortcode,
            "media_id": str(post.mediaid),
            "upload_date": post.date.strftime("%Y-%m-%d"),
            "view_count": post.video_view_count or 0,
            "duration": post.video_duration or 0,
            "title": caption,
            "video_url": post.video_url,
        }
    except Exception as exc:
        print(f"    [warn] {shortcode}: {exc}")
        return None


def load_checkpoint() -> dict:
    if CHECKPOINT.exists():
        return json.loads(CHECKPOINT.read_text(encoding="utf-8"))
    return {}


def save_checkpoint(data: dict):
    CHECKPOINT.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def load_scraped_reels() -> list[dict]:
    """Load scraped reel shortcodes + tile views."""
    if not SCRAPED_FILE.exists():
        print(f"  ERROR: Scraped reels not found at {SCRAPED_FILE}")
        sys.exit(1)
    return json.loads(SCRAPED_FILE.read_text(encoding="utf-8"))


def load_fb_metadata() -> dict:
    """Load FB reel metadata for cross-referencing. Returns {media_id: meta}."""
    if not FB_METADATA.exists():
        return {}
    data = json.loads(FB_METADATA.read_text(encoding="utf-8"))
    # FB metadata is keyed by FB reel ID
    return data


def parse_tile_views(s: str) -> int:
    """Parse tile view string like '625K' or '3,555' to integer."""
    s = s.strip().replace(",", "")
    if s.endswith("M"):
        return int(float(s[:-1]) * 1_000_000)
    if s.endswith("K"):
        return int(float(s[:-1]) * 1_000)
    try:
        return int(s)
    except ValueError:
        return 0


# ---------------------------------------------------------------------------
# Phases
# ---------------------------------------------------------------------------

def phase_metadata(sessionid: str):
    """Phase A: Fetch metadata for all reels via instaloader."""
    scraped = load_scraped_reels()
    shortcodes = [r["shortcode"] for r in scraped]

    print(f"\n{'='*60}")
    print(f"Phase A: Fetching metadata for {len(shortcodes)} IG reels")
    print(f"Checkpoint: {CHECKPOINT}")
    print(f"{'='*60}\n")

    loader = get_loader(sessionid)
    checkpoint = load_checkpoint()
    to_fetch = [sc for sc in shortcodes if sc not in checkpoint]
    already = len(shortcodes) - len(to_fetch)
    if already:
        print(f"  Resuming: {already} already in checkpoint, {len(to_fetch)} remaining\n")

    if not to_fetch:
        print("  All metadata already fetched.")
        return

    done = 0
    failed = 0
    consecutive_fails = 0
    delay = 5  # Start with 5s between requests

    for sc in to_fetch:
        meta = get_metadata_instaloader(sc, loader)
        done += 1
        if meta:
            checkpoint[sc] = meta
            status = f"date={meta['upload_date']} views={meta['view_count']:,}"
            consecutive_fails = 0
            delay = max(5, delay - 1)  # Slowly reduce delay on success
        else:
            checkpoint[sc] = {"shortcode": sc, "failed": True}
            failed += 1
            consecutive_fails += 1
            status = "FAILED"
            if consecutive_fails >= 3:
                # Exponential backoff: 30s, 60s, 120s, ...
                backoff = min(300, 30 * (2 ** (consecutive_fails - 3)))
                print(f"  [RATE LIMITED] Waiting {backoff}s before retry...")
                time.sleep(backoff)
                delay = 10  # Increase base delay after rate limit
        print(f"  [{done + already:3d}/{len(shortcodes)}] {sc}  {status}")

        # Save checkpoint every 10
        if done % 10 == 0:
            save_checkpoint(checkpoint)

        time.sleep(delay)

    save_checkpoint(checkpoint)
    ok = sum(1 for v in checkpoint.values() if not v.get("failed"))
    print(f"\nMetadata complete: {ok} succeeded, {failed} failed, {len(checkpoint)} total")


def phase_download(sessionid: str):
    """Phase B: Sort by views, download all to Google Drive."""
    import requests as req

    print(f"\n{'='*60}")
    print(f"Phase B: Download reels to {OUTPUT_DIR}")
    print(f"{'='*60}\n")

    checkpoint = load_checkpoint()
    if not checkpoint:
        print("  No checkpoint found. Run --metadata-only first.")
        sys.exit(1)

    # Filter to non-failed reels with video URLs
    reels = [meta for meta in checkpoint.values() if not meta.get("failed")]
    print(f"  {len(reels)} reels with valid metadata")

    # Sort by view_count descending
    reels.sort(key=lambda r: r.get("view_count", 0), reverse=True)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    downloaded = 0
    skipped = 0
    failed = 0

    # Build tile_views lookup from scraped data
    scraped = load_scraped_reels()
    tile_views = {r["shortcode"]: r["tile_views"] for r in scraped}

    for rank, reel in enumerate(reels, 1):
        reel["tile_views"] = tile_views.get(reel["shortcode"], "")
        reel["rank"] = rank
        fname = make_filename(rank, reel)
        reel["filename"] = fname
        out_path = OUTPUT_DIR / fname

        if out_path.exists():
            print(f"  [{rank:3d}] SKIP (exists) {fname}")
            skipped += 1
            continue

        video_url = reel.get("video_url")
        if not video_url:
            print(f"  [{rank:3d}] SKIP (no video URL) {reel['shortcode']}")
            failed += 1
            continue

        print(f"  [{rank:3d}] Downloading {fname}")
        try:
            headers = {"User-Agent": "Mozilla/5.0"}
            r = req.get(video_url, headers=headers, timeout=120)
            if r.status_code == 200:
                out_path.write_bytes(r.content)
                downloaded += 1
            else:
                print(f"        [ERROR] HTTP {r.status_code}")
                failed += 1
        except Exception as exc:
            print(f"        [ERROR] {exc}")
            failed += 1

        time.sleep(1)

    # Update checkpoint with rank/filename info
    save_checkpoint(checkpoint)

    print(f"\nDownload complete: {downloaded} new, {skipped} skipped, {failed} failed")
    print(f"Total reels in folder: {downloaded + skipped}")


def phase_airtable(token: str):
    """Phase C: Upload to Airtable 'Instagram Reels' table."""
    import requests as req

    print(f"\n{'='*60}")
    print(f"Phase C: Upload to Airtable")
    print(f"  Base: {AIRTABLE_BASE}")
    print(f"  Table: {AIRTABLE_TABLE}")
    print(f"{'='*60}\n")

    checkpoint = load_checkpoint()
    scraped = load_scraped_reels()
    tile_views = {r["shortcode"]: r["tile_views"] for r in scraped}

    # Build list of valid reels sorted by views
    reels = [m for m in checkpoint.values() if not m.get("failed")]
    reels.sort(key=lambda r: r.get("view_count", 0), reverse=True)

    # Load FB metadata for cross-referencing
    fb_meta = load_fb_metadata()
    # Build media_id -> FB reel mapping
    fb_by_media_id = {}
    for fb_id, meta in fb_meta.items():
        if not meta.get("failed"):
            fb_by_media_id[fb_id] = meta

    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE}/{AIRTABLE_TABLE}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    records = []
    for rank, reel in enumerate(reels, 1):
        sc = reel["shortcode"]
        media_id = reel.get("media_id", "")
        tv = tile_views.get(sc, "")
        upload_date = reel.get("upload_date", "")

        fields = {
            "Title": reel.get("title", "")[:200],
            "Instagram Link": f"https://www.instagram.com/reel/{sc}/",
            "IG Views": reel.get("view_count", 0),
            "IG Views Display": tv or fmt_views(reel.get("view_count", 0)),
            "Upload Date": upload_date,
            "Duration": round(reel.get("duration", 0)),
            "Reel ID": media_id,
            "Shortcode": sc,
            "Filename": reel.get("filename", make_filename(rank, reel)),
        }

        # Check if this reel was reposted to FB (match by FB reel ID / media_id)
        fb_match = fb_by_media_id.get(media_id)
        if fb_match:
            fields["Reposted to FB"] = True
            fb_date = fb_match.get("upload_date", "")
            if len(fb_date) == 8:
                fb_date = f"{fb_date[:4]}-{fb_date[4:6]}-{fb_date[6:]}"
            fields["FB Repost Date"] = fb_date
            fields["FB Link"] = f"https://www.facebook.com/reel/{fb_match.get('id', '')}/"
            fb_views = fb_match.get("view_count", 0)
            fields["FB Views"] = fmt_views(fb_views) if fb_views else ""
            # Next repost due = FB repost date + 90 days
            try:
                fb_dt = datetime.strptime(fb_date, "%Y-%m-%d")
                fields["Next Repost Due"] = (fb_dt + timedelta(days=90)).strftime("%Y-%m-%d")
            except ValueError:
                pass
        else:
            fields["Reposted to FB"] = False
            # First repost due = upload date + 90 days
            try:
                up_dt = datetime.strptime(upload_date, "%Y-%m-%d")
                fields["Next Repost Due"] = (up_dt + timedelta(days=90)).strftime("%Y-%m-%d")
            except ValueError:
                pass

        records.append(fields)

    # Upload in batches of 10
    total = len(records)
    print(f"  Uploading {total} records...")

    for i in range(0, total, 10):
        batch = records[i:i+10]
        payload = {
            "typecast": True,
            "records": [{"fields": r} for r in batch],
        }
        resp = req.post(url, headers=headers, json=payload)
        if resp.status_code == 200:
            print(f"  Uploaded {min(i+10, total)}/{total}")
        else:
            print(f"  [ERROR] Batch {i//10+1}: {resp.status_code} {resp.text[:300]}")
        time.sleep(0.25)

    print("  Done.")


def main():
    parser = argparse.ArgumentParser(description="Download all IG reels from @natefriedman_")
    parser.add_argument("--metadata-only", action="store_true")
    parser.add_argument("--download-only", action="store_true")
    parser.add_argument("--airtable-only", action="store_true")
    parser.add_argument("--airtable-token", default="")
    parser.add_argument("--sessionid", default=DEFAULT_SESSIONID,
                        help="Instagram sessionid cookie value")
    args = parser.parse_args()

    run_all = not (args.metadata_only or args.download_only or args.airtable_only)

    if run_all or args.metadata_only:
        phase_metadata(args.sessionid)

    if run_all or args.download_only:
        phase_download(args.sessionid)

    if run_all or args.airtable_only:
        if not args.airtable_token:
            print("\n  Skipping Airtable upload (no --airtable-token provided)")
        else:
            phase_airtable(args.airtable_token)


if __name__ == "__main__":
    main()
