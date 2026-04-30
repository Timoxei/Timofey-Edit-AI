"""
Match Script Part 2 hyperlinks to local B-roll files.

Reads .playwright-mcp/Israel-Embassy-Protest-Script.html, re-extracts hyperlinks
from the Script Part 2 tab, filters & groups them, and resolves Drive IDs against
the Research Screenshots folder. Outputs broll_part2_placements.json.
"""
import json
import os
import re
from urllib.parse import urlparse, parse_qs
from bs4 import BeautifulSoup

HTML_PATH = ".playwright-mcp/Israel-Embassy-Protest-Script.html"
SCREENSHOTS_DIR = "G:/Shared drives/Scratch Disk/Videos/Israel Embassy Protest/Research Screenshots"
OUT_PATH = ".playwright-mcp/broll_part2_placements.json"

DRIVE_PATTERNS = [
    r'drive\.google\.com/file/d/([^/&?]+)',
    r'drive\.google\.com/open\?id=([^/&?]+)',
    r'drive\.google\.com/drive/folders/([^/&?]+)',
]

def resolve_url(href):
    parsed = urlparse(href)
    if 'google.com/url' in href:
        return parse_qs(parsed.query).get('q', [href])[0]
    return href

def extract_drive_id(url):
    for pattern in DRIVE_PATTERNS:
        m = re.search(pattern, url)
        if m:
            return m.group(1)
    return None

def is_folder(url):
    return 'drive/folders/' in url

def main():
    with open(HTML_PATH, encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    all_ps = soup.find_all('p')
    p2_start = p2_end = None
    for i, p in enumerate(all_ps):
        t = p.get_text()
        if p2_start is None and 'Script Part 2' in t:
            p2_start = i
        elif p2_start is not None and p2_end is None and t.strip() == 'Notes':
            p2_end = i
            break

    # Build link list with sequential paragraph index
    raw_links = []
    for pi, p in enumerate(all_ps[p2_start+1:p2_end]):
        for a in p.find_all('a'):
            href = a.get('href', '')
            url = resolve_url(href)
            text = a.get_text().strip()
            if not text:
                continue
            raw_links.append({
                'para_idx': pi,
                'text': text,
                'url': url,
                'drive_id': extract_drive_id(url),
                'is_folder': is_folder(url),
                'is_comment': url.startswith('#cmnt'),
            })

    # Build screenshots index: drive_id -> filename
    screenshots = {}
    if os.path.isdir(SCREENSHOTS_DIR):
        for fn in os.listdir(SCREENSHOTS_DIR):
            m = re.match(r'^\d+_(.+)\.(png|jpg|jpeg|mp4|mov|webp)$', fn, re.I)
            if m:
                screenshots[m.group(1)] = fn

    placements = []
    last_drive_id = None
    for link in raw_links:
        if link['is_comment']:
            continue

        drive_id = link['drive_id']
        url = link['url']

        # Determine status
        if drive_id and not link['is_folder'] and drive_id in screenshots:
            local_path = os.path.join(SCREENSHOTS_DIR, screenshots[drive_id]).replace('\\', '/')
            status = 'LOCAL'
        elif drive_id and link['is_folder']:
            local_path = None
            status = 'FOLDER'
        elif drive_id:
            local_path = None
            status = 'MISSING_DRIVE'
        else:
            local_path = None
            status = 'WEB'

        # Group consecutive identical drive_ids → keep FIRST occurrence's text
        if drive_id and drive_id == last_drive_id and status == 'LOCAL':
            continue

        placements.append({
            'trigger_text': link['text'],
            'drive_id': drive_id,
            'url': url,
            'local_path': local_path,
            'status': status,
            'para_idx': link['para_idx'],
        })
        if status == 'LOCAL':
            last_drive_id = drive_id
        else:
            last_drive_id = None  # don't dedup non-LOCAL across runs

    # Stats
    by_status = {}
    for p in placements:
        by_status[p['status']] = by_status.get(p['status'], 0) + 1

    print(f'Total placements: {len(placements)}')
    for k, v in sorted(by_status.items()):
        print(f'  {k}: {v}')

    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(placements, f, indent=2, ensure_ascii=False)
    print(f'\nWrote {OUT_PATH}')

    # Print first 10 for sanity
    print('\nFirst 10 placements:')
    for i, p in enumerate(placements[:10]):
        marker = '✓' if p['status'] == 'LOCAL' else '✗'
        print(f'  {i+1:2}. [{marker} {p["status"]:14}] {p["trigger_text"][:70]!r}')

if __name__ == '__main__':
    main()
