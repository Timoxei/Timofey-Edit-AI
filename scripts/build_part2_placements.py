"""
Build the final B-roll placement list for Script Part 2 AI Voiceover.

Strategy: curated keyword→file mapping. For each claim in the AI VO,
search the Whisper transcript for anchor keywords to get the timestamp,
then map to the most appropriate file in Research Screenshots/.

Outputs broll_part2_timeline.json with absolute timeline positions.
"""
import json
import os
import re
import io
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

T1_PATH = "D:/Claude Experiments/script2_transcript.json"
T2_PATH = "D:/Claude Experiments/script2_under_transcript.json"
SCREENSHOTS = "G:/Shared drives/Scratch Disk/Videos/Israel Embassy Protest/Research Screenshots"
OUT = ".playwright-mcp/broll_part2_timeline.json"

# Timeline offsets (from list_sequence_tracks)
T1_OFFSET = 422.2218       # Script 2.mp3 starts at 7:02:08
T2_OFFSET = 706.539167     # Script 2_.mp3 follows
T1_END = 706.539167
T2_END = 910.342767

PRE_ROLL = 0.3  # subtract from word start

# Curated map: each entry has anchor_words (search in transcript), file, transcript_idx (0=T1, 1=T2)
# anchor_words: list of word sequences to search for (first match wins)
PLACEMENTS = [
    # === Script 2.mp3 / Pritsker section (audio 0-302s) ===
    # Intro 0-15s — "biggest expose yet" — Pritsker as paid protestor reveal
    {"anchor": ["meet", "kay", "pritzker"], "file": "Meet.jpg", "ti": 0},
    {"anchor": ["with", "a", "cover"], "file": "Kei Pritsker ADL.org.jpg", "ti": 0},
    {"anchor": ["chants", "like", "everyone"], "file": "Pritsker Participated canarymission.org.jpg", "ti": 0},
    {"anchor": ["he's", "a", "journalist"], "file": "Conversation with Kei Pritsker. hammertonail.com", "ti": 0},
    {"anchor": ["called", "breakthrough", "news"], "file": "Prove he works there.jpg", "ti": 0},
    {"anchor": ["320", "west"], "file": "BreakThrough News Background  influencewatch.org.jpg", "ti": 0},
    {"anchor": ["paid", "protesting", "incubator"], "file": "Web 1.jpg", "ti": 0},
    {"anchor": ["roy", "neville", "singham"], "file": "Web 2.jpg", "ti": 0},
    {"anchor": ["20", "million"], "file": "Vid 1.jpg", "ti": 0},
    {"anchor": ["carrying", "their", "signs"], "file": "Vid 1_.jpg", "ti": 0},
    {"anchor": ["people's", "conference", "for", "palestine"], "file": "Small pic.jpg", "ti": 0},
    {"anchor": ["charlie", "kirk"], "file": "Nice Pic.jpg", "ti": 0},
    {"anchor": ["islam", "is", "the", "sword"], "file": "Tommy Robinson Exposes the Islamic.png", "ti": 0},
    {"anchor": ["justice", "and", "education", "fund"], "file": "Top 10.jpg", "ti": 0},
    {"anchor": ["david", "chung"], "file": "top10_terror.png", "ti": 0},
    {"anchor": ["manolo", "de"], "file": "Two.jpg", "ti": 0},
    {"anchor": ["progress", "unity", "fund"], "file": "Socialism.jpg", "ti": 0},
    {"anchor": ["open", "society", "foundation"], "file": "Zionist.jpg", "ti": 0},
    {"anchor": ["columbia", "encampments"], "file": "Film.jpg", "ti": 0},
    {"anchor": ["movie", "the", "encampments"], "file": "Biography.jpg", "ti": 0},
    {"anchor": ["hundreds", "of", "masked"], "file": "Not just protest.jpg", "ti": 0},
    {"anchor": ["13", "out", "of", "the", "44"], "file": "Hateful Mob of Anti-Israel Protesters Descend on NYC Synagogue Urging the 'Resistance'.mp4", "ti": 0},
    # MISSING_DRIVE markers (per user — drop colored markers, fill manually)
    {"anchor": ["pritzker", "himself", "was", "a", "member"], "file": "MARKER:Pritsker SJP at GW", "ti": 0, "is_marker": True},
    {"anchor": ["george", "washington", "university"], "file": "Pritsker Participated canarymission.org.jpg", "ti": 0},
    {"anchor": ["mamedani", "started"], "file": "Podcast Screenshot.png", "ti": 0},
    {"anchor": ["here", "he", "his", "being", "listed"], "file": "MARKER:Reagan Building arrest list", "ti": 0, "is_marker": True},
    {"anchor": ["ronald", "reagan"], "file": "The students, Kei Pritsker, Henry Manning and graduate student Alison Hawkins, were arrested.jpg", "ti": 0},
    {"anchor": ["adolf", "eichmann"], "file": "MARKER:Eichmann sign", "ti": 0, "is_marker": True},
    {"anchor": ["unlawful", "entry"], "file": "MARKER:unlawful entry charge", "ti": 0, "is_marker": True},
    {"anchor": ["singham", "now", "check"], "file": "Arrested.jpg", "ti": 0},
    {"anchor": ["claudia", "cruz"], "file": "Reviews.jpg", "ti": 0},
    {"anchor": ["100", "largest", "corporations"], "file": "Road To Socialism.jpg", "ti": 0},
    {"anchor": ["paid", "protesting", "click"], "file": "How to use.jpg", "ti": 0},

    # === Script 2_.mp3 / Oct 7 + Nerdeen + mosques (audio 0-200s) ===
    {"anchor": ["day", "after", "october"], "file": "Heoric daring oct 7 iac.org.png", "ti": 1},
    {"anchor": ["bold", "counteroffensive"], "file": "a bold counter-offensive. liberationnews.org.jpg", "ti": 1},
    {"anchor": ["grandfather", "escaped", "the", "pogroms"], "file": "Biography.jpg", "ti": 1},
    {"anchor": ["killed", "aju", "with"], "file": "Hateful Mob of Anti-Israel Protesters Descend on NYC Synagogue Urging the 'Resistance'.mp4", "ti": 1},
    {"anchor": ["masquerades", "as", "a", "journalist"], "file": "Conversation with Kei Pritsker. hammertonail.com", "ti": 1},
    {"anchor": ["nurdine", "kiswani"], "file": "MARKER:Nerdeen Kiswani profile", "ti": 1, "is_marker": True},
    {"anchor": ["jordanian", "activist"], "file": "MARKER:Nerdeen Jordanian activist", "ti": 1, "is_marker": True},
    {"anchor": ["dogs", "definitely"], "file": "MARKER:Nerdeen 'dogs unclean' tweet", "ti": 1, "is_marker": True},
    {"anchor": ["randy", "fine"], "file": "MARKER:Randy Fine response post", "ti": 1, "is_marker": True},
    {"anchor": ["46", "million", "views"], "file": "MARKER:Fine post 46M views", "ti": 1, "is_marker": True},
    {"anchor": ["within", "our", "lifetime"], "file": "MARKER:Within Our Lifetime org", "ti": 1, "is_marker": True},
    {"anchor": ["map", "of", "jewish", "businesses"], "file": "MARKER:Map of Jewish businesses", "ti": 1, "is_marker": True},
    {"anchor": ["protesters", "descended", "upon"], "file": "Hateful Mob of Anti-Israel Protesters Descend on NYC Synagogue Urging the 'Resistance'.mp4", "ti": 1},
    {"anchor": ["four", "consecutive", "life", "sentences"], "file": "MARKER:Free terrorist poster", "ti": 1, "is_marker": True},
    {"anchor": ["rip", "off", "my", "head"], "file": "MARKER:Nerdeen hijab arrest story", "ti": 1, "is_marker": True},
    {"anchor": ["hamas", "headband"], "file": "MARKER:Hamas headband child photo", "ti": 1, "is_marker": True},
    {"anchor": ["little", "morocco"], "file": "MARKER:Little Morocco map/photo", "ti": 1, "is_marker": True},
    {"anchor": ["church", "just", "burned"], "file": "MARKER:Burned church news", "ti": 1, "is_marker": True},
    {"anchor": ["dar", "el", "daua"], "file": "MARKER:Masjid Dar Al-Dawah mosque", "ti": 1, "is_marker": True},
    {"anchor": ["was", "a", "church", "and", "then", "became"], "file": "Tommy Robinson Exposes the Islamic.png", "ti": 1},
    {"anchor": ["31"], "file": "Britain Is Breaking.png", "ti": 1},
    {"anchor": ["are", "you", "awake"], "file": "Tommy_Robinson_Exposes_the_Islamic_Takeover_of_the_UK_1-20_screenshot.png", "ti": 1},
]


def find_anchor_time(words, anchor):
    """Find first occurrence of word sequence (case-insensitive, normalized)."""
    norm = lambda w: re.sub(r"[^\w]", "", w.lower())
    n_anchor = [norm(a) for a in anchor]
    n_words = [norm(w["word"]) for w in words]
    for i in range(len(n_words) - len(n_anchor) + 1):
        if all(n_words[i + j] == n_anchor[j] for j in range(len(n_anchor))):
            return words[i]["start"], i
    # Try fuzzy: allow first word to match up to 2 chars different
    for i in range(len(n_words) - len(n_anchor) + 1):
        first_match = (
            n_words[i] == n_anchor[0]
            or (len(n_words[i]) >= 4 and n_words[i].startswith(n_anchor[0][:4]))
        )
        rest_match = all(n_words[i + j] == n_anchor[j] for j in range(1, len(n_anchor)))
        if first_match and rest_match:
            return words[i]["start"], i
    return None, None


def main():
    with open(T1_PATH, encoding="utf-8") as f:
        t1 = json.load(f)
    with open(T2_PATH, encoding="utf-8") as f:
        t2 = json.load(f)
    transcripts = [t1, t2]
    offsets = [T1_OFFSET, T2_OFFSET]
    ends = [T1_END, T2_END]

    # Verify all files exist
    file_files = {fn for fn in os.listdir(SCREENSHOTS) if not fn.startswith(".")}

    placed = []
    not_found_anchors = []
    not_found_files = []

    for idx, p in enumerate(PLACEMENTS):
        ti = p["ti"]
        rel_t, word_idx = find_anchor_time(transcripts[ti]["words"], p["anchor"])
        if rel_t is None:
            not_found_anchors.append(p)
            continue
        timeline_t = offsets[ti] + rel_t - PRE_ROLL
        # Skip if past the V1 trim of this audio clip
        if timeline_t >= ends[ti]:
            not_found_anchors.append({**p, "reason": f"audio trimmed at timeline {ends[ti]}, anchor at {timeline_t:.2f}"})
            continue
        is_marker = p.get("is_marker", False)
        if not is_marker:
            if p["file"] not in file_files:
                not_found_files.append((p["anchor"], p["file"]))
                # downgrade to marker if file missing
                is_marker = True
                file_or_marker_label = f"MARKER:[file missing] {p['file']}"
            else:
                file_or_marker_label = p["file"]
        else:
            file_or_marker_label = p["file"]

        placed.append({
            "anchor": " ".join(p["anchor"]),
            "audio_index": ti,
            "audio_relative_start": rel_t,
            "timeline_start": round(timeline_t, 3),
            "is_marker": is_marker,
            "file": file_or_marker_label,
            "local_path": os.path.join(SCREENSHOTS, p["file"]).replace("\\", "/") if not is_marker else None,
        })

    # Sort by timeline_start and compute end times (extend to next placement)
    placed.sort(key=lambda x: x["timeline_start"])
    for i, p in enumerate(placed):
        if i + 1 < len(placed):
            next_start = placed[i + 1]["timeline_start"]
        else:
            # last item — extend to end of its audio block (T2 end if in T2, else T1 end)
            next_start = ends[p["audio_index"]]
        p["timeline_end"] = round(min(next_start, ends[p["audio_index"]]), 3)
        p["duration"] = round(p["timeline_end"] - p["timeline_start"], 3)

    print(f"Placed: {len(placed)}")
    print(f"Anchors not found: {len(not_found_anchors)}")
    for p in not_found_anchors:
        print(f"  MISS: {' '.join(p['anchor'])} -> {p['file']}")
    print(f"Files missing on disk: {len(not_found_files)}")
    for a, f in not_found_files:
        print(f"  MISSING FILE: {f}")
    print()
    print("=== TIMELINE ===")
    for i, p in enumerate(placed):
        kind = "MRK" if p["is_marker"] else "IMG"
        ti_label = "S2" if p["audio_index"] == 0 else "S2_"
        print(f"  #{i+1:2}  [{p['timeline_start']:7.2f} -> {p['timeline_end']:7.2f}s] ({p['duration']:5.2f}s) [{kind} {ti_label}] {p['anchor'][:35]:36} -> {p['file'][:60]}")

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(placed, f, indent=2, ensure_ascii=False)
    print(f"\nWrote {OUT}")


if __name__ == "__main__":
    main()
