"""Build final placement order with project item IDs for MCP placement."""
import json, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# projectItemId map (from import_media results)
ID_MAP = {
    "Meet.jpg": "000f43ae",
    "Kei Pritsker ADL.org.jpg": "000f43af",
    "Pritsker Participated canarymission.org.jpg": "000f43b0",
    "Prove he works there.jpg": "000f43b1",
    "BreakThrough News Background  influencewatch.org.jpg": "000f43b2",
    "Web 1.jpg": "000f43b3",
    "Web 2.jpg": "000f43b4",
    "Vid 1.jpg": "000f43b5",
    "Vid 1_.jpg": "000f43b6",
    "Small pic.jpg": "000f43b7",
    "Nice Pic.jpg": "000f43b8",
    "Tommy Robinson Exposes the Islamic.png": "000f43b9",
    "Conversation with Kei Pritsker. hammertonail.com": "000f43ba",  # imported as .jpg copy
    "Top 10.jpg": "000f43bb",
    "top10_terror.png": "000f43bc",
    "Two.jpg": "000f43bd",
    "Socialism.jpg": "000f43be",
    "Zionist.jpg": "000f43bf",
    "Film.jpg": "000f43c0",
    "Biography.jpg": "000f43c1",
    "Not just protest.jpg": "000f43c2",
    "Hateful Mob of Anti-Israel Protesters Descend on NYC Synagogue Urging the 'Resistance'.mp4": "000f43c3",
    "Podcast Screenshot.png": "000f43c4",
    "The students, Kei Pritsker, Henry Manning and graduate student Alison Hawkins, were arrested.jpg": "000f43c5",
    "Arrested.jpg": "000f43c6",
    "Reviews.jpg": "000f43c7",
    "Road To Socialism.jpg": "000f43c8",
    "Heoric daring oct 7 iac.org.png": "000f43c9",
    "a bold counter-offensive. liberationnews.org.jpg": "000f43ca",
    "Britain Is Breaking.png": "000f43cb",
    "Tommy_Robinson_Exposes_the_Islamic_Takeover_of_the_UK_1-20_screenshot.png": "000f43cc",
}

with open('.playwright-mcp/broll_part2_timeline.json', encoding='utf-8') as f:
    placements = json.load(f)

# Sort REVERSE chronological for overwrite-safe placement
ordered = sorted(placements, key=lambda x: -x['timeline_start'])

result = []
for p in ordered:
    if p['is_marker']:
        result.append({
            'kind': 'marker',
            'time': p['timeline_start'],
            'name': p['file'].replace('MARKER:', ''),
            'comment': p['anchor'],
        })
    else:
        pid = ID_MAP.get(p['file'])
        if not pid:
            print(f'MISSING ID for: {p["file"]!r}')
            continue
        result.append({
            'kind': 'image',
            'time': p['timeline_start'],
            'project_item_id': pid,
            'file': p['file'],
            'anchor': p['anchor'],
        })

with open('.playwright-mcp/final_placements_ordered.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

print(f'Total: {len(result)} ({sum(1 for r in result if r["kind"]=="image")} images, {sum(1 for r in result if r["kind"]=="marker")} markers)')
print()
for i, r in enumerate(result):
    if r['kind'] == 'image':
        print(f'  {i+1:2}. IMG  @{r["time"]:7.2f}s  pid={r["project_item_id"]}  {r["file"][:55]}')
    else:
        print(f'  {i+1:2}. MRK  @{r["time"]:7.2f}s  {r["name"][:55]}')
