#!/usr/bin/env python3
"""
Download 20 most-popular + 5 least-popular Facebook reels from the last 365 days.

Output:
  D:\\Claude Experiments\\Facebook Reels\\popular\\       <- top 20 by views
  D:\\Claude Experiments\\Facebook Reels\\least-popular\\ <- bottom 5 by views

Usage:
  python scripts/download_fb_reels.py

Authentication:
  Uses Microsoft Edge cookies by default (--cookies-from-browser edge).
  If that fails, edit BROWSER below to "chrome" or "firefox".
"""
import json
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
OUTPUT_BASE = Path(r"D:\Claude Experiments\Facebook Reels")
CUTOFF = (datetime.today() - timedelta(days=365)).strftime("%Y%m%d")
BROWSER = "edge"   # change to "chrome" or "firefox" if needed

# ---------------------------------------------------------------------------
# All 250 reels scraped from the logged-in Reels tab on 2026-03-28.
# views_display is the approximate count shown on the page tile.
# ---------------------------------------------------------------------------
SCRAPED_REELS = [
    {"id": "1224653133027918",   "views_display": "50K"},
    {"id": "1531121492346355",   "views_display": "394K"},
    {"id": "879388798459927",    "views_display": "105K"},
    {"id": "1451840733151495",   "views_display": "201K"},
    {"id": "1042785558912101",   "views_display": "616K"},
    {"id": "917472274539930",    "views_display": "695K"},
    {"id": "1453524862970192",   "views_display": "2.1M"},
    {"id": "899075039406524",    "views_display": "40K"},
    {"id": "932775002579590",    "views_display": "23K"},
    {"id": "1546506393109804",   "views_display": "36K"},
    {"id": "1429835568785857",   "views_display": "370K"},
    {"id": "1276367284371403",   "views_display": "1M"},
    {"id": "1410352797304664",   "views_display": "26K"},
    {"id": "4096435320647568",   "views_display": "2.6M"},
    {"id": "942722964845530",    "views_display": "100K"},
    {"id": "1238433681594570",   "views_display": "48K"},
    {"id": "2312318552611078",   "views_display": "269K"},
    {"id": "1967150107344025",   "views_display": "275K"},
    {"id": "937095718886476",    "views_display": "1.5M"},
    {"id": "4316773068561141",   "views_display": "48K"},
    {"id": "2494195921010280",   "views_display": "290K"},
    {"id": "1960136311563775",   "views_display": "18K"},
    {"id": "1804841820223500",   "views_display": "1.3M"},
    {"id": "911805764600609",    "views_display": "233K"},
    {"id": "866494812870060",    "views_display": "159K"},
    {"id": "2278116119341544",   "views_display": "314K"},
    {"id": "826853080414256",    "views_display": "516K"},
    {"id": "2021357252057954",   "views_display": "105K"},
    {"id": "4358775061008982",   "views_display": "615K"},
    {"id": "876690491744483",    "views_display": "45K"},
    {"id": "858950233568156",    "views_display": "53K"},
    {"id": "2462343137522716",   "views_display": "25K"},
    {"id": "1186177547007823",   "views_display": "282K"},
    {"id": "915442137589575",    "views_display": "397K"},
    {"id": "915413604324433",    "views_display": "468K"},
    {"id": "862906103186553",    "views_display": "235K"},
    {"id": "913221557929549",    "views_display": "258K"},
    {"id": "1848825805866125",   "views_display": "37K"},
    {"id": "26114245398209444",  "views_display": "490K"},
    {"id": "1591368391900742",   "views_display": "1.2M"},
    {"id": "25558791713762715",  "views_display": "243K"},
    {"id": "891517873573098",    "views_display": "298K"},
    {"id": "2087324145371794",   "views_display": "26K"},
    {"id": "1534829811151648",   "views_display": "21K"},
    {"id": "913326911374540",    "views_display": "1.5M"},
    {"id": "888385113584376",    "views_display": "2.1M"},
    {"id": "689004917514455",    "views_display": "235K"},
    {"id": "25122272250786165",  "views_display": "17K"},
    {"id": "1598662284658047",   "views_display": "353K"},
    {"id": "2791475381183444",   "views_display": "463K"},
    {"id": "912398698110170",    "views_display": "419K"},
    {"id": "1084469103781778",   "views_display": "17K"},
    {"id": "2346355452462272",   "views_display": "942K"},
    {"id": "1920950995463556",   "views_display": "43K"},
    {"id": "9898724480251352",   "views_display": "11K"},
    {"id": "1213932150164915",   "views_display": "101K"},
    {"id": "1198951142380311",   "views_display": "27K"},
    {"id": "25621164327550035",  "views_display": "45K"},
    {"id": "918110843980868",    "views_display": "515K"},
    {"id": "3384044915093272",   "views_display": "39K"},
    {"id": "1511343616598034",   "views_display": "405K"},
    {"id": "1147011587318888",   "views_display": "622K"},
    {"id": "1421602692941590",   "views_display": "929K"},
    {"id": "1731006424526716",   "views_display": "268K"},
    {"id": "1395086125963396",   "views_display": "144K"},
    {"id": "903697448751101",    "views_display": "603K"},
    {"id": "3266979800123278",   "views_display": "1.5M"},
    {"id": "816482804759569",    "views_display": "1.2M"},
    {"id": "1377597610133357",   "views_display": "452K"},
    {"id": "864683416527695",    "views_display": "310K"},
    {"id": "763386022821187",    "views_display": "1.2M"},
    {"id": "1596073461583030",   "views_display": "1.1M"},
    {"id": "1537365224039837",   "views_display": "4.9M"},
    {"id": "1301981115292540",   "views_display": "2.2M"},
    {"id": "1039256695059387",   "views_display": "95K"},
    {"id": "2390827478017893",   "views_display": "478K"},
    {"id": "25438604625794675",  "views_display": "1M"},
    {"id": "1190613305990932",   "views_display": "217K"},
    {"id": "1396096052108780",   "views_display": "1.6M"},
    {"id": "2626025257790910",   "views_display": "1.7M"},
    {"id": "1540451070343014",   "views_display": "1.1M"},
    {"id": "1401089308076490",   "views_display": "152K"},
    {"id": "2804668483209537",   "views_display": "2.1M"},
    {"id": "835343415793791",    "views_display": "27K"},
    {"id": "1860050964607566",   "views_display": "573K"},
    {"id": "1541467473668755",   "views_display": "526K"},
    {"id": "719632854524134",    "views_display": "33K"},
    {"id": "853493510898406",    "views_display": "1M"},
    {"id": "1389572722619451",   "views_display": "1.4M"},
    {"id": "1175792358052929",   "views_display": "172K"},
    {"id": "1579667029688233",   "views_display": "1.2M"},
    {"id": "1524684142172994",   "views_display": "61K"},
    {"id": "1606077950387817",   "views_display": "1.1M"},
    {"id": "1166489105612651",   "views_display": "162K"},
    {"id": "1302354858600143",   "views_display": "70K"},
    {"id": "694690826613553",    "views_display": "2.4M"},
    {"id": "742054992253777",    "views_display": "64K"},
    {"id": "4064834180494166",   "views_display": "1.9M"},
    {"id": "4082244488572914",   "views_display": "1.9M"},
    {"id": "2261579650992978",   "views_display": "37K"},
    {"id": "24799703509671236",  "views_display": "3M"},
    {"id": "1540330857311453",   "views_display": "42K"},
    {"id": "673180449175435",    "views_display": "320K"},
    {"id": "826512603219612",    "views_display": "1.7M"},
    {"id": "1308798324071870",   "views_display": "1.7M"},
    {"id": "794561506515078",    "views_display": "342K"},
    {"id": "1305887234051773",   "views_display": "181K"},
    {"id": "1690841318260772",   "views_display": "259K"},
    {"id": "808262554946385",    "views_display": "1.1M"},
    {"id": "1449625346123808",   "views_display": "205K"},
    {"id": "3624092977899135",   "views_display": "249K"},
    {"id": "766836059493056",    "views_display": "209K"},
    {"id": "1184199636926950",   "views_display": "1.6M"},
    {"id": "1350068776789012",   "views_display": "448K"},
    {"id": "1576937876625069",   "views_display": "868K"},
    {"id": "4262514570645972",   "views_display": "192K"},
    {"id": "1340410877802767",   "views_display": "163K"},
    {"id": "1329593205095515",   "views_display": "749K"},
    {"id": "781648088169933",    "views_display": "759K"},
    {"id": "1243130171164180",   "views_display": "197K"},
    {"id": "670621328976323",    "views_display": "1M"},
    {"id": "2690468114618017",   "views_display": "78K"},
    {"id": "807051038709463",    "views_display": "81K"},
    {"id": "1104979951831298",   "views_display": "302K"},
    {"id": "768508556084559",    "views_display": "18K"},
    {"id": "767524176114081",    "views_display": "301K"},
    {"id": "2048996745634324",   "views_display": "145K"},
    {"id": "1124987529154060",   "views_display": "813K"},
    {"id": "1225112422669141",   "views_display": "80K"},
    {"id": "1349242606568704",   "views_display": "1.5M"},
    {"id": "24489706510671542",  "views_display": "530K"},
    {"id": "2140190213055289",   "views_display": "419K"},
    {"id": "1491965751996918",   "views_display": "90K"},
    {"id": "1153249580015990",   "views_display": "16K"},
    {"id": "708889802208169",    "views_display": "20K"},
    {"id": "793361543346133",    "views_display": "73K"},
    {"id": "735610516169498",    "views_display": "252K"},
    {"id": "1460538858516471",   "views_display": "74K"},
    {"id": "774451938632573",    "views_display": "200K"},
    {"id": "777086538024239",    "views_display": "276K"},
    {"id": "1488777618959145",   "views_display": "302K"},
    {"id": "608895665413728",    "views_display": "384K"},
    {"id": "1308719670836416",   "views_display": "93K"},
    {"id": "2128795964276916",   "views_display": "244K"},
    {"id": "24422157180752775",  "views_display": "64K"},
    {"id": "2479778292385573",   "views_display": "2.1M"},
    {"id": "1084620733842814",   "views_display": "100K"},
    {"id": "729424056545769",    "views_display": "872K"},
    {"id": "752011970551699",    "views_display": "1M"},
    {"id": "2516037618774500",   "views_display": "164K"},
    {"id": "1256405126029871",   "views_display": "199K"},
    {"id": "1433558204228386",   "views_display": "246K"},
    {"id": "1059334915767660",   "views_display": "63K"},
    {"id": "1301189678260252",   "views_display": "290K"},
    {"id": "1284613799932551",   "views_display": "535K"},
    {"id": "1370354537410869",   "views_display": "10K"},
    {"id": "1632903250744128",   "views_display": "251K"},
    {"id": "615621527634355",    "views_display": "1.4M"},
    {"id": "1238173024722703",   "views_display": "84K"},
    {"id": "733658949130396",    "views_display": "44K"},
    {"id": "2482169845494654",   "views_display": "405K"},
    {"id": "1025451082818971",   "views_display": "6.4K"},
    {"id": "7857267600971070",   "views_display": "539K"},
    {"id": "1148054713105494",   "views_display": "89K"},
    {"id": "411648654955981",    "views_display": "55K"},
    {"id": "1133035167883488",   "views_display": "720K"},
    {"id": "7421135137993457",   "views_display": "4.5K"},
    {"id": "983985659996824",    "views_display": "12K"},
    {"id": "1925911554505421",   "views_display": "71K"},
    {"id": "742804284347484",    "views_display": "118K"},
    {"id": "1588172845300579",   "views_display": "2.4K"},
    {"id": "3567155863599389",   "views_display": "4K"},
    {"id": "7187799518003194",   "views_display": "1.7K"},
    {"id": "398998652870519",    "views_display": "40K"},
    {"id": "938504344469770",    "views_display": "1K"},
    {"id": "1603152730377744",   "views_display": "2.9K"},
    {"id": "7363462307052719",   "views_display": "1.5K"},
    {"id": "7972820662746868",   "views_display": "7.3K"},
    {"id": "792073926303332",    "views_display": "2.2K"},
    {"id": "753323726723671",    "views_display": "2.1K"},
    {"id": "793209816159204",    "views_display": "476K"},
    {"id": "266263809820036",    "views_display": "2.2K"},
    {"id": "344550678372321",    "views_display": "3.9K"},
    {"id": "1041804670376819",   "views_display": "117K"},
    {"id": "6838877836238946",   "views_display": "2.2K"},
    {"id": "406562418724470",    "views_display": "87K"},
    {"id": "1331493174169976",   "views_display": "189K"},
    {"id": "712811213917618",    "views_display": "1.7K"},
    {"id": "1392222588386426",   "views_display": "80K"},
    {"id": "1130383514785243",   "views_display": "1.3K"},
    {"id": "394442436268187",    "views_display": "38K"},
    {"id": "347272901347026",    "views_display": "240K"},
    {"id": "856260109628676",    "views_display": "110K"},
    {"id": "730411672352324",    "views_display": "44K"},
    {"id": "1108230233879254",   "views_display": "137K"},
    {"id": "3631969880457019",   "views_display": "17K"},
    {"id": "1056068632391598",   "views_display": "6.7K"},
    {"id": "185363061264793",    "views_display": "80K"},
    {"id": "1017520179538643",   "views_display": "7.4K"},
    {"id": "622771363230358",    "views_display": "2.8K"},
    {"id": "1542286173250494",   "views_display": "1.1K"},
    {"id": "347584094656643",    "views_display": "17K"},
    {"id": "6769631079814871",   "views_display": "31K"},
    {"id": "835504425010658",    "views_display": "1.2K"},
    {"id": "1165325531095171",   "views_display": "136K"},
    {"id": "1380729612547350",   "views_display": "5.8K"},
    {"id": "877870927035401",    "views_display": "2.6K"},
    {"id": "669087828640997",    "views_display": "1.2K"},
    {"id": "1068806857654964",   "views_display": "7.4K"},
    {"id": "694419766162550",    "views_display": "1.2K"},
    {"id": "1097946964896528",   "views_display": "13K"},
    {"id": "1302622597119761",   "views_display": "7.4K"},
    {"id": "1819288008522831",   "views_display": "50K"},
    {"id": "275108138478799",    "views_display": "139K"},
    {"id": "2230152187188707",   "views_display": "80K"},
    {"id": "891577668979756",    "views_display": "135K"},
    {"id": "242544978851286",    "views_display": "41K"},
    {"id": "882016300175869",    "views_display": "997"},
    {"id": "866598194956919",    "views_display": "36K"},
    {"id": "894128362065385",    "views_display": "174K"},
    {"id": "1483050015818556",   "views_display": "86K"},
    {"id": "1025190858696091",   "views_display": "100K"},
    {"id": "1279344766064406",   "views_display": "77K"},
    {"id": "1055948408778528",   "views_display": "83K"},
    {"id": "259786350442146",    "views_display": "1K"},
    {"id": "709540381121578",    "views_display": "1K"},
    {"id": "715691113794536",    "views_display": "1.4K"},
    {"id": "3599926076916155",   "views_display": "105K"},
    {"id": "1825499461241059",   "views_display": "135K"},
    {"id": "1306560980741895",   "views_display": "72K"},
    {"id": "1579865522550523",   "views_display": "218K"},
    {"id": "324327950309941",    "views_display": "5.3K"},
    {"id": "896346885486909",    "views_display": "5.1K"},
    {"id": "314872708171063",    "views_display": "164K"},
    {"id": "877958807032414",    "views_display": "1.7K"},
    {"id": "2630319130608973",   "views_display": "167K"},
    {"id": "3533461430261359",   "views_display": "1.7K"},
    {"id": "6890327011021660",   "views_display": "962K"},
    {"id": "888287275861968",    "views_display": "13K"},
    {"id": "6930466137067068",   "views_display": "237K"},
    {"id": "6728208713899472",   "views_display": "842"},
    {"id": "328209899942997",    "views_display": "839K"},
    {"id": "621744163289024",    "views_display": "2.2M"},
    {"id": "898247005295955",    "views_display": "61K"},
    {"id": "2116654302040566",   "views_display": "14K"},
    {"id": "326531953441821",    "views_display": "12K"},
    {"id": "1069685120702563",   "views_display": "541"},
    {"id": "1295267684509463",   "views_display": "14K"},
    {"id": "696417632451716",    "views_display": "143K"},
    {"id": "1402765213980935",   "views_display": "25K"},
]


def fmt_views(n: int) -> str:
    """Format view count: 2601834 -> '2.6M', 655133 -> '655K', 5324 -> '5.3K'"""
    if n >= 1_000_000:
        return f"{n/1_000_000:.1f}M"
    if n >= 1_000:
        return f"{round(n/1_000)}K" if n >= 10_000 else f"{n/1_000:.1f}K"
    return str(n)


def make_filename(rank: int, reel: dict) -> str:
    """Build a human-readable filename: 01. 2026-03-04 - 2.6M - Title here.mp4"""
    date_raw = reel.get("upload_date", "")
    if len(date_raw) == 8:
        date_fmt = f"{date_raw[:4]}-{date_raw[4:6]}-{date_raw[6:]}"
    else:
        date_fmt = date_raw
    views_fmt = reel.get("views_display") or fmt_views(reel.get("view_count", 0))
    # Clean title: strip FB boilerplate like "48K views · 1.4K reactions | "
    title = reel.get("title", "")
    if "|" in title:
        title = title.rsplit("|", 1)[-1].strip()
    safe = "".join(c if c.isalnum() or c in " ,-.'!?" else " " for c in title)
    safe = " ".join(safe.split())[:70].strip(" .-")
    return f"{rank:02d}. {date_fmt} - {views_fmt} - {safe}.mp4"


def parse_views(text: str) -> int:
    """Convert '2.1M' -> 2_100_000, '391K' -> 391_000, '11K' -> 11_000."""
    t = text.strip().upper().replace(",", "")
    if t.endswith("M"):
        return int(float(t[:-1]) * 1_000_000)
    if t.endswith("K"):
        return int(float(t[:-1]) * 1_000)
    return int(t)


def get_metadata(reel_id: str) -> dict | None:
    """
    Fetch upload_date and view_count from yt-dlp --dump-json.
    Returns dict or None on failure.
    """
    url = f"https://www.facebook.com/reel/{reel_id}/"
    try:
        r = subprocess.run(
            ["yt-dlp", "--dump-json", "--no-playlist", url],
            capture_output=True, text=True, timeout=90,
        )
        if r.returncode != 0:
            return None
        # yt-dlp may print one JSON object per line; take the first
        first_line = r.stdout.strip().splitlines()[0]
        data = json.loads(first_line)
        description = (data.get("description") or data.get("title") or "")
        return {
            "upload_date": data.get("upload_date", ""),
            "view_count": data.get("view_count") or None,
            "title": description[:80].replace("\n", " "),
        }
    except Exception as exc:
        print(f"    [warn] metadata error: {exc}")
        return None


def download_reel(reel_id: str, out_path: Path) -> bool:
    """Download a single reel to out_path (mp4). Returns True on success."""
    url = f"https://www.facebook.com/reel/{reel_id}/"
    r = subprocess.run(
        ["yt-dlp",
         "--merge-output-format", "mp4",
         "-o", str(out_path),
         url],
    )
    return r.returncode == 0


def main() -> None:
    print(f"=== Facebook Reels Downloader ===")
    print(f"Cutoff date : {CUTOFF}  (last 365 days)")
    print(f"Output root : {OUTPUT_BASE}")
    print(f"Browser     : {BROWSER}\n")

    # ------------------------------------------------------------------
    # Phase 1: fetch metadata (upload_date + exact view_count)
    # ------------------------------------------------------------------
    print(f"[1/3] Fetching metadata for {len(SCRAPED_REELS)} reels...")
    enriched = []
    for i, reel in enumerate(SCRAPED_REELS, 1):
        rid = reel["id"]
        approx = parse_views(reel["views_display"])
        print(f"  [{i:02d}/{len(SCRAPED_REELS)}] {rid}", end="  ", flush=True)
        meta = get_metadata(rid)
        if meta is None:
            print("SKIP (yt-dlp failed)")
            continue
        views = meta["view_count"] if meta["view_count"] else approx
        print(f"date={meta['upload_date']}  views={views:,}")
        enriched.append({
            **reel,
            "upload_date": meta["upload_date"],
            "view_count": views,
            "title": meta["title"],
        })

    # ------------------------------------------------------------------
    # Phase 2: filter, sort, select
    # ------------------------------------------------------------------
    print(f"\n[2/3] Filtering & sorting...")
    filtered = [r for r in enriched if r.get("upload_date", "") >= CUTOFF]
    print(f"  {len(filtered)}/{len(enriched)} reels within last 365 days.")

    if not filtered:
        print("\nNo reels found within the last 365 days.")
        print("Tip: try changing BROWSER to 'chrome' or 'firefox', or check your login.")
        sys.exit(1)

    filtered.sort(key=lambda r: r["view_count"], reverse=True)

    n_pop = min(20, len(filtered))
    n_least = min(5, len(filtered))
    popular = filtered[:n_pop]
    least_popular = list(reversed(filtered[-n_least:]))  # ascending for display

    print(f"  Popular       : {n_pop} reels")
    print(f"  Least-popular : {n_least} reels")

    # ------------------------------------------------------------------
    # Phase 3: download
    # ------------------------------------------------------------------
    print(f"\n[3/3] Downloading...")
    for folder, reels, label in [
        (OUTPUT_BASE / "popular",       popular,       "popular"),
        (OUTPUT_BASE / "least-popular", least_popular, "least-popular"),
    ]:
        folder.mkdir(parents=True, exist_ok=True)
        print(f"\n  -- {label} -> {folder}")
        for rank, r in enumerate(reels, 1):
            fname = make_filename(rank, r)
            out = folder / fname
            old_fname = f"{rank:02d}_{r['view_count']}_{r['id']}.mp4"
            old_out = folder / old_fname
            tag = f"#{rank:02d}  {r['view_count']:>10,} views"
            print(f"    {tag}  {fname}")
            if out.exists():
                print(f"      [skip] already exists")
                continue
            if old_out.exists():
                old_out.rename(out)
                print(f"      [renamed] {old_fname}")
                continue
            ok = download_reel(r["id"], out)
            if not ok:
                print(f"      [ERROR] download failed — check cookies/login")

    # ------------------------------------------------------------------
    # Summary table
    # ------------------------------------------------------------------
    print("\n=== Download Summary ===")
    print(f"{'#':>3}  {'Views':>10}  {'Date':>8}  {'Category':<14}  Title")
    print("-" * 78)
    for rank, r in enumerate(popular, 1):
        print(f"{rank:>3}  {r['view_count']:>10,}  {r['upload_date']}  {'popular':<14}  {r['title'][:35]}")
    print()
    for rank, r in enumerate(least_popular, 1):
        print(f"{rank:>3}  {r['view_count']:>10,}  {r['upload_date']}  {'least-popular':<14}  {r['title'][:35]}")

    print(f"\nDone.")
    print(f"  Popular       : {OUTPUT_BASE / 'popular'}")
    print(f"  Least-popular : {OUTPUT_BASE / 'least-popular'}")


if __name__ == "__main__":
    main()
