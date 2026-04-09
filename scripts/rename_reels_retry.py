#!/usr/bin/env python3
"""
Retry rename for the 6 files that didn't match in the first pass.
Checks SKIPped candidates + additional candidates for the ISIS reel.
"""
import json, re, subprocess
from pathlib import Path

POPULAR_DIR = Path(r"D:\Claude Experiments\Facebook Reels\popular")
LEAST_DIR   = Path(r"D:\Claude Experiments\Facebook Reels\least-popular")

# Unmatched files (after first rename run):
# Popular:
#   02. 2026-03-04 - 1.4M - Not grassroots!
#   03. 2025-10-27 - 1.3M - Mamdani has a 95 chance to win...
#   04. 2025-10-20 - 1.2M - Thanks for the shoutout pbd.podcast!...
#   14. 2026-02-06 - 780K - He has now privated his social media!
#   20. 2026-01-10 - 655K - This was at the NYC free Iran protest...
# Least-popular:
#   04. 2026-02-13 - 9.8K - ISIS is trying to k ll Tommy Robinson...

# Needed dates (from unmatched files above):
NEEDED_DATES = {"20260304", "20251027", "20251020", "20260206", "20260110", "20260213"}

# Candidates to try:
# 1. SKIPped reels from the first run (yt-dlp returned non-zero exit code then)
# 2. Additional tile-range candidates for ISIS reel (9.8K yt-dlp → tile ~16-22K)
CANDIDATES = [
    # --- SKIPped popular candidates ---
    ("1453524862970192", "2.1M"),
    ("1276367284371403", "1M"),
    ("1804841820223500", "1.3M"),
    ("1421602692941590", "929K"),
    ("903697448751101",  "603K"),
    ("3266979800123278", "1.5M"),
    ("24799703509671236","3M"),
    ("826512603219612",  "1.7M"),
    ("808262554946385",  "1.1M"),
    ("1184199636926950", "1.6M"),
    ("853493510898406",  "1M"),
    # --- Additional tiles for ISIS reel (20260213) ---
    ("1960136311563775", "18K"),
    ("932775002579590",  "23K"),
    ("1402765213980935", "25K"),
    ("2462343137522716", "25K"),
    ("1410352797304664", "26K"),
    ("2087324145371794", "26K"),
    ("1198951142380311", "27K"),
    ("835343415793791",  "27K"),
    # Wider range just in case
    ("1546506393109804", "36K"),
    ("1848825805866125", "37K"),
    ("394442436268187",  "38K"),
    ("866598194956919",  "36K"),
    ("242544978851286",  "41K"),
    ("1540330857311453", "42K"),
    ("733658949130396",  "44K"),
    ("730411672352324",  "44K"),
    ("876690491744483",  "45K"),
    ("25621164327550035","45K"),
    ("1238433681594570", "48K"),
    ("4316773068561141", "48K"),
]


def get_metadata(reel_id):
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


def parse_views_str(s):
    s = s.strip().upper()
    if s.endswith("M"):
        return int(float(s[:-1]) * 1_000_000)
    if s.endswith("K"):
        return int(float(s[:-1]) * 1_000)
    return int(s)


def parse_filename(name):
    m = re.match(r"^(\d+)\. (\d{4}-\d{2}-\d{2}) - ([\d.]+[KkMm]?) - (.+)\.mp4$", name)
    if not m:
        return None
    date_str = m.group(2).replace("-", "")
    vs = m.group(3)
    return {
        "rank": int(m.group(1)),
        "date": date_str,
        "views_str": vs,
        "views_int": parse_views_str(vs),
        "title": m.group(4),
        "orig_name": name,
    }


def main():
    # Collect only the unmatched files
    file_infos = []
    for folder in (POPULAR_DIR, LEAST_DIR):
        for f in sorted(folder.glob("*.mp4")):
            info = parse_filename(f.name)
            if info and info["date"] in NEEDED_DATES:
                info["path"] = f
                info["folder"] = folder
                file_infos.append(info)
    print(f"Targeting {len(file_infos)} unmatched files.")

    # Fetch metadata
    print(f"\nFetching metadata for {len(CANDIDATES)} candidates...")
    by_date = {}
    for i, (rid, tile_disp) in enumerate(CANDIDATES, 1):
        print(f"  [{i:02d}/{len(CANDIDATES)}] {rid} (tile={tile_disp})", end="  ", flush=True)
        meta = get_metadata(rid)
        if meta is None:
            print("SKIP")
            continue
        date = meta["upload_date"]
        status = "OK" if date in NEEDED_DATES else f"{date} (not needed)"
        print(status)
        meta["tile_views"] = tile_disp
        by_date.setdefault(date, []).append(meta)

    # Match
    print("\nMatching...")
    renames = []
    unmatched = []
    for info in file_infos:
        cands = by_date.get(info["date"], [])
        best, best_delta = None, float("inf")
        for c in cands:
            if c["view_count"] == 0:
                continue
            delta = abs(c["view_count"] - info["views_int"]) / max(info["views_int"], 1)
            if delta < best_delta:
                best_delta = delta
                best = c
        if best and best_delta < 0.20:
            new_name = info["orig_name"].replace(
                f" - {info['views_str']} - ",
                f" - {best['tile_views']} - ",
            )
            renames.append((info["path"], info["folder"] / new_name, info["orig_name"], new_name, best["tile_views"], round(best_delta*100)))
        else:
            if best:
                print(f"  NEAR MISS: {info['orig_name']}")
                print(f"    best candidate: id={best['id']} yt-dlp={best['view_count']:,} delta={best_delta:.1%}")
            unmatched.append(info)

    print(f"\n{'='*70}")
    print(f"Renames ({len(renames)}):")
    for _, _, old, new, tile, pct in renames:
        if old != new:
            print(f"  [{pct}% delta] {old}")
            print(f"    -> {new}")
        else:
            print(f"  [no change] {old}")
    if unmatched:
        print(f"\nStill unmatched ({len(unmatched)}):")
        for info in unmatched:
            print(f"  {info['orig_name']}")

    changed = 0
    for old_path, new_path, old_name, new_name, _, _ in renames:
        if old_name != new_name:
            old_path.rename(new_path)
            changed += 1
    print(f"\nDone. {changed} files renamed.")


if __name__ == "__main__":
    main()
