#!/usr/bin/env python3
"""
Rename downloaded Facebook reels to use Facebook tile view counts instead of yt-dlp counts.

Fetches yt-dlp metadata for candidate reels, matches by upload_date + view_count
to existing files, then renames in-place.
"""

import json
import re
import subprocess
from pathlib import Path

POPULAR_DIR = Path(r"D:\Claude Experiments\Facebook Reels\popular")
LEAST_DIR = Path(r"D:\Claude Experiments\Facebook Reels\least-popular")

# ---------------------------------------------------------------------------
# Candidates to check.
# Popular: reels with tile views >= 655K (min yt-dlp view in popular folder).
# Least-popular: reels with tile views in 3K–20K range.
# Format: (reel_id, views_display_tile)
# ---------------------------------------------------------------------------
CANDIDATES = [
    # ---------- Popular candidates (tile >= 655K) ----------
    ("917472274539930",   "695K"),
    ("1453524862970192",  "2.1M"),
    ("1276367284371403",  "1M"),
    ("4096435320647568",  "2.6M"),
    ("1804841820223500",  "1.3M"),
    ("937095718886476",   "1.5M"),
    ("888385113584376",   "2.1M"),
    ("2346355452462272",  "942K"),
    ("918110843980868",   "515K"),
    ("1147011587318888",  "622K"),
    ("1421602692941590",  "929K"),
    ("903697448751101",   "603K"),
    ("3266979800123278",  "1.5M"),
    ("816482804759569",   "1.2M"),
    ("763386022821187",   "1.2M"),
    ("1596073461583030",  "1.1M"),
    ("1537365224039837",  "4.9M"),
    ("1301981115292540",  "2.2M"),
    ("25438604625794675", "1M"),
    ("1396096052108780",  "1.6M"),
    ("2626025257790910",  "1.7M"),
    ("1540451070343014",  "1.1M"),
    ("2804668483209537",  "2.1M"),
    ("853493510898406",   "1M"),
    ("1389572722619451",  "1.4M"),
    ("1579667029688233",  "1.2M"),
    ("1606077950387817",  "1.1M"),
    ("694690826613553",   "2.4M"),
    ("4064834180494166",  "1.9M"),
    ("4082244488572914",  "1.9M"),
    ("24799703509671236", "3M"),
    ("826512603219612",   "1.7M"),
    ("1308798324071870",  "1.7M"),
    ("808262554946385",   "1.1M"),
    ("1184199636926950",  "1.6M"),
    ("1576937876625069",  "868K"),
    ("1329593205095515",  "749K"),
    ("781648088169933",   "759K"),
    ("670621328976323",   "1M"),
    ("1124987529154060",  "813K"),
    ("1349242606568704",  "1.5M"),
    ("24489706510671542", "530K"),
    ("2479778292385573",  "2.1M"),
    ("729424056545769",   "872K"),
    ("752011970551699",   "1M"),
    ("1284613799932551",  "535K"),
    ("615621527634355",   "1.4M"),
    ("7857267600971070",  "539K"),
    ("1133035167883488",  "720K"),
    ("6890327011021660",  "962K"),
    ("328209899942997",   "839K"),
    ("621744163289024",   "2.2M"),
    ("826853080414256",   "516K"),
    ("4358775061008982",  "615K"),
    ("1591368391900742",  "1.2M"),
    ("913326911374540",   "1.5M"),
    ("1042785558912101",  "616K"),
    ("1860050964607566",  "573K"),
    ("1541467473668755",  "526K"),
    # ---------- Least-popular candidates (tile 3K–20K) ----------
    ("9898724480251352",  "11K"),
    ("1370354537410869",  "10K"),
    ("1025451082818971",  "6.4K"),
    ("7421135137993457",  "4.5K"),
    ("983985659996824",   "12K"),
    ("3567155863599389",  "4K"),
    ("1603152730377744",  "2.9K"),
    ("7972820662746868",  "7.3K"),
    ("344550678372321",   "3.9K"),
    ("1056068632391598",  "6.7K"),
    ("1017520179538643",  "7.4K"),
    ("1380729612547350",  "5.8K"),
    ("1068806857654964",  "7.4K"),
    ("1302622597119761",  "7.4K"),
    ("1097946964896528",  "13K"),
    ("888287275861968",   "13K"),
    ("2116654302040566",  "14K"),
    ("326531953441821",   "12K"),
    ("1295267684509463",  "14K"),
    ("3631969880457019",  "17K"),
    ("1153249580015990",  "16K"),
    ("347584094656643",   "17K"),
    ("1084469103781778",  "17K"),
    ("25122272250786165", "17K"),
    ("324327950309941",   "5.3K"),
    ("896346885486909",   "5.1K"),
    ("768508556084559",   "18K"),
    ("708889802208169",   "20K"),
]

# Map reel_id -> tile views_display
TILE_VIEWS = {rid: disp for rid, disp in CANDIDATES}


def parse_views_str(s: str) -> int:
    """'655K' -> 655000, '2.6M' -> 2600000, '7.4K' -> 7400"""
    s = s.strip().upper()
    if s.endswith("M"):
        return int(float(s[:-1]) * 1_000_000)
    if s.endswith("K"):
        return int(float(s[:-1]) * 1_000)
    return int(s)


def get_metadata(reel_id: str) -> dict | None:
    url = f"https://www.facebook.com/reel/{reel_id}/"
    try:
        r = subprocess.run(
            ["yt-dlp", "--dump-json", "--no-playlist", url],
            capture_output=True, text=True, timeout=90,
        )
        if r.returncode != 0:
            return None
        data = json.loads(r.stdout.strip().splitlines()[0])
        return {
            "id": reel_id,
            "upload_date": data.get("upload_date", ""),
            "view_count": data.get("view_count") or 0,
        }
    except Exception:
        return None


def parse_filename(name: str) -> dict | None:
    """Parse '01. 2026-01-04 - 2.6M - Title here.mp4' -> dict"""
    m = re.match(
        r"^(\d+)\. (\d{4}-\d{2}-\d{2}) - ([\d.]+[KkMm]?) - (.+)\.mp4$",
        name,
    )
    if not m:
        return None
    date_str = m.group(2).replace("-", "")  # "20260104"
    views_str = m.group(3)
    return {
        "rank": int(m.group(1)),
        "date": date_str,
        "views_str": views_str,
        "views_int": parse_views_str(views_str),
        "title": m.group(4),
        "orig_name": name,
    }


def main():
    # Collect all existing files
    file_infos = []
    for folder, label in [(POPULAR_DIR, "popular"), (LEAST_DIR, "least-popular")]:
        for f in sorted(folder.glob("*.mp4")):
            info = parse_filename(f.name)
            if info:
                info["path"] = f
                info["folder"] = folder
                info["label"] = label
                file_infos.append(info)

    print(f"Found {len(file_infos)} files to rename.")

    # Determine which dates we're looking for
    needed_dates = {info["date"] for info in file_infos}

    # Fetch metadata for all candidates, keyed by (date, approx_views)
    print(f"\nFetching metadata for {len(CANDIDATES)} candidate reels...")
    metadata: list[dict] = []
    for i, (rid, tile_disp) in enumerate(CANDIDATES, 1):
        print(f"  [{i:02d}/{len(CANDIDATES)}] {rid} (tile={tile_disp})", end="  ", flush=True)
        meta = get_metadata(rid)
        if meta is None:
            print("SKIP")
            continue
        meta["tile_views"] = tile_disp
        metadata.append(meta)
        status = "OK" if meta["upload_date"] in needed_dates else f"date={meta['upload_date']} (not needed)"
        print(status)

    # Build lookup: date -> list of metadata dicts
    by_date: dict[str, list] = {}
    for m in metadata:
        d = m["upload_date"]
        by_date.setdefault(d, []).append(m)

    # Match each file to a candidate reel
    print("\nMatching files to reels...")
    renames = []
    unmatched = []
    for info in file_infos:
        date = info["date"]
        views_int = info["views_int"]
        candidates_for_date = by_date.get(date, [])

        best = None
        best_delta = float("inf")
        for c in candidates_for_date:
            if c["view_count"] == 0:
                continue
            delta = abs(c["view_count"] - views_int) / max(views_int, 1)
            if delta < best_delta:
                best_delta = delta
                best = c

        if best and best_delta < 0.15:  # within 15%
            tile_disp = best["tile_views"]
            new_name = info["orig_name"].replace(
                f" - {info['views_str']} - ",
                f" - {tile_disp} - ",
            )
            renames.append((info["path"], info["folder"] / new_name, info["orig_name"], new_name, tile_disp))
        else:
            unmatched.append(info)

    # Print plan
    print(f"\n{'='*70}")
    print(f"Renames ({len(renames)}):")
    for _, _, old, new, tile in renames:
        if old != new:
            print(f"  {old}")
            print(f"  -> {new}")
        else:
            print(f"  [no change] {old}")
    if unmatched:
        print(f"\nUnmatched ({len(unmatched)}):")
        for info in unmatched:
            print(f"  {info['orig_name']}")

    # Apply renames
    changed = 0
    for old_path, new_path, old_name, new_name, _ in renames:
        if old_name != new_name:
            old_path.rename(new_path)
            changed += 1

    print(f"\nDone. {changed} files renamed.")


if __name__ == "__main__":
    main()
