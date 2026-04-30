"""Build B-roll placement list using ONLY Notes-sourced screenshots."""
import json, re, io, sys, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

T1_PATH = "D:/Claude Experiments/script2_transcript.json"
T2_PATH = "D:/Claude Experiments/script2_under_transcript.json"
NOTES = "G:/Shared drives/Scratch Disk/Videos/Israel Embassy Protest/Research Screenshots/Notes"
OUT = ".playwright-mcp/notes_placements.json"

T1_OFFSET = 422.2218
T2_OFFSET = 706.539167
T1_END = 706.539167
T2_END = 910.342767
PRE_ROLL = 0.3

# Each placement: list of anchor words to find in transcript + file to place
PLACEMENTS = [
    # === Script 2.mp3 / Pritsker section ===
    {"ti": 0, "anchor": ["meet", "kay", "pritzker"],            "file": "kei_pritsker_adl.jpg"},
    {"ti": 0, "anchor": ["with", "a", "cover"],                 "file": "pritsker_canarymission.jpg"},
    {"ti": 0, "anchor": ["he's", "a", "journalist"],            "file": "x_account_journalist.jpg"},
    {"ti": 0, "anchor": ["works", "for", "a", "company"],       "file": "prove_he_works_there.jpg"},
    {"ti": 0, "anchor": ["called", "breakthrough", "news"],     "file": "kei_and_bt_wiki.jpg"},
    {"ti": 0, "anchor": ["roy", "neville", "singham"],          "file": "roy_neville_singham.jpg"},
    {"ti": 0, "anchor": ["20", "million"],                      "file": "millions_into_bt.png"},
    {"ti": 0, "anchor": ["justice", "and", "education", "fund"],"file": "breakthrough_news_background_iw.jpg"},
    {"ti": 0, "anchor": ["68", "million"],                      "file": "foreign_agents_act_fox.jpg"},
    {"ti": 0, "anchor": ["board", "of", "directors"],           "file": "govt_letter_to_bt.jpg"},
    {"ti": 0, "anchor": ["lived", "with", "them"],              "file": "bt_circled_in_film.jpg"},
    {"ti": 0, "anchor": ["produced", "the", "movie"],           "file": "amc_the_encampments.jpg"},
    {"ti": 0, "anchor": ["pritzker", "himself"],                "file": "sjp_member_fb.jpg"},
    {"ti": 0, "anchor": ["here", "he", "his"],                  "file": "kei_getting_arrested.jpg"},
    {"ti": 0, "anchor": ["ronald", "reagan"],                   "file": "henry_manning_alison_hawkins_arrested.jpg"},
    {"ti": 0, "anchor": ["adolf", "eichmann"],                  "file": "eichmann_sign_quoting_adolf.jpg"},
    {"ti": 0, "anchor": ["unlawful", "entry"],                  "file": "unlawful_entry_hatchet.jpg"},

    # === Script 2_.mp3 / Oct 7 + Nerdeen ===
    {"ti": 1, "anchor": ["bold", "counteroffensive"],           "file": "bold_counter_offensive_liberation.jpg"},
]


def find_anchor_time(words, anchor):
    norm = lambda w: re.sub(r"[^\w]", "", w.lower())
    n_anchor = [norm(a) for a in anchor]
    n_words = [norm(w["word"]) for w in words]
    for i in range(len(n_words) - len(n_anchor) + 1):
        if all(n_words[i + j] == n_anchor[j] for j in range(len(n_anchor))):
            return words[i]["start"], i
    # Fuzzy first word (4-char prefix)
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
    transcripts = [t1["words"], t2["words"]]
    offsets = [T1_OFFSET, T2_OFFSET]
    ends = [T1_END, T2_END]

    placed = []
    missing = []
    for p in PLACEMENTS:
        rel_t, idx = find_anchor_time(transcripts[p["ti"]], p["anchor"])
        if rel_t is None:
            missing.append(p)
            print(f"  MISS {' '.join(p['anchor'])} -> {p['file']}")
            continue
        timeline_t = offsets[p["ti"]] + rel_t - PRE_ROLL
        if timeline_t >= ends[p["ti"]]:
            missing.append({**p, "reason": "past trim"})
            continue
        local_path = os.path.join(NOTES, p["file"]).replace("\\", "/")
        if not os.path.exists(local_path):
            missing.append({**p, "reason": "file missing"})
            print(f"  FILE MISS: {local_path}")
            continue
        placed.append({
            "ti": p["ti"],
            "anchor": " ".join(p["anchor"]),
            "audio_rel": round(rel_t, 3),
            "timeline_start": round(timeline_t, 3),
            "file": p["file"],
            "local_path": local_path,
        })

    placed.sort(key=lambda x: x["timeline_start"])
    for i, x in enumerate(placed):
        if i + 1 < len(placed):
            next_start = placed[i + 1]["timeline_start"]
        else:
            next_start = ends[x["ti"]]
        x["timeline_end"] = round(min(next_start, ends[x["ti"]]), 3)
        x["duration"] = round(x["timeline_end"] - x["timeline_start"], 3)

    print(f"\nPlaced: {len(placed)},  Missing: {len(missing)}")
    print()
    print("=== TIMELINE ===")
    for i, x in enumerate(placed):
        ti_label = "S2 " if x["ti"] == 0 else "S2_"
        print(f"  #{i+1:2}  [{x['timeline_start']:7.2f} -> {x['timeline_end']:7.2f}s] ({x['duration']:5.2f}s) [{ti_label}] {x['anchor'][:30]:30} -> {x['file']}")

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(placed, f, indent=2, ensure_ascii=False)
    print(f"\nWrote {OUT}")


if __name__ == "__main__":
    main()
