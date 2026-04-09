"""
find_cuts.py
Analyzes the raw A-roll transcript against the approved script.
For each script sentence, finds all takes in the transcript and marks
all but the LAST take for removal.

Outputs:
  d:/Claude Experiments/cuts.json  -- list of {start, end, reason} to cut
  (also prints a human-readable preview of every cut boundary)

Usage:
  python find_cuts.py                        # all cuts
  python find_cuts.py --test-range 991 1130  # only cuts within 991s-1130s
"""

import json
import re
import difflib
import sys
import argparse

TRANSCRIPT_PATH = "d:/Claude Experiments/Test.json"
SCRIPT_PATH     = "c:/Users/user/Downloads/Columbus Circle Iran Protest Script.txt"
OUTPUT_PATH     = "d:/Claude Experiments/cuts.json"

MATCH_THRESHOLD    = 0.60  # fuzzy score for phrase fingerprint match
KEY_WORDS          = 8     # leading words used as sentence fingerprint
MIN_SENTENCE_WORDS = 5     # skip script sentences shorter than this
MIN_GAP            = 3.0   # minimum gap (s) to bother emitting a cut

# Safety margins — CRITICAL for avoiding clipped words
KEEP_BUFFER = 1.5   # pull cut END back by this many seconds before the kept take
CUT_BUFFER  = 0.3   # pull cut START back by this many seconds (avoids mid-word entry)

PREVIEW_WORDS = 12  # words of context to show before/after each cut boundary


# ---------------------------------------------------------------------------
# 1. Load transcript -> flat word list
# ---------------------------------------------------------------------------
def load_words(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    words = []
    for seg in data["segments"]:
        for w in seg["words"]:
            t = w["text"].strip()
            if t:
                words.append({
                    "text":  t,
                    "norm":  re.sub(r"[^\w]", "", t.lower()),
                    "start": float(w["start"]),
                    "end":   float(w["start"]) + float(w["duration"]),
                })
    return words


# ---------------------------------------------------------------------------
# 2. Extract spoken sentences from script (strip directions & footnotes)
# ---------------------------------------------------------------------------
def extract_sentences(path):
    with open(path, "r", encoding="utf-8") as f:
        raw = f.read()

    sentences = []
    in_footnotes = False

    for line in raw.splitlines():
        line = line.strip()
        if not line:
            continue
        if re.match(r"^\[[a-z]+\]", line):
            in_footnotes = True
            continue
        if in_footnotes:
            continue
        line = re.sub(r"\[[a-z]+\]", "", line).strip()
        if re.match(r"^(Cuba Blitz|JAMES PARRA|Closing:|_{3,})", line, re.I):
            continue
        if re.fullmatch(r"\(.*\)\.?", line):
            continue
        line = re.sub(r"\([^)]+\)", "", line).strip()
        line = re.sub(r"^[A-Za-z]+:\s*", "", line).strip()
        line = re.sub(r"\s+", " ", line)
        if len(line.split()) < MIN_SENTENCE_WORDS:
            continue
        sentences.append(line)
    return sentences


# ---------------------------------------------------------------------------
# 3. Normalise text for comparison
# ---------------------------------------------------------------------------
def norm_text(text):
    return re.sub(r"[^\w\s]", "", text.lower())


# ---------------------------------------------------------------------------
# 4. Find ALL positions in the transcript where a sentence starts
# ---------------------------------------------------------------------------
def find_take_starts(sentence, words):
    key = norm_text(sentence).split()[:KEY_WORDS]
    if len(key) < 3:
        return []
    key_str = " ".join(key)

    hits = []
    step = max(1, KEY_WORDS // 3)
    for i in range(0, len(words) - KEY_WORDS + 1, step):
        window = " ".join(words[j]["norm"] for j in range(i, i + KEY_WORDS))
        score = difflib.SequenceMatcher(None, key_str, window).ratio()
        if score >= MATCH_THRESHOLD:
            hits.append((i, score))

    if not hits:
        return []

    clusters = []
    for idx, score in hits:
        if clusters and idx - clusters[-1][0] <= 5:
            if score > clusters[-1][1]:
                clusters[-1] = [idx, score]
        else:
            clusters.append([idx, score])

    return [c[0] for c in clusters]


# ---------------------------------------------------------------------------
# 5. Helper: get context text around a word index
# ---------------------------------------------------------------------------
def context_text(words, idx, n=PREVIEW_WORDS):
    start = max(0, idx - n)
    end   = min(len(words), idx + n)
    before = " ".join(w["text"] for w in words[max(0, idx - n):idx])
    after  = " ".join(w["text"] for w in words[idx:min(len(words), idx + n)])
    return before, after


def to_tc(sec):
    """Convert seconds to HH:MM:SS.f timecode string."""
    h = int(sec // 3600)
    m = int((sec % 3600) // 60)
    s = sec % 60
    return f"{h:02d}:{m:02d}:{s:05.2f}"


# ---------------------------------------------------------------------------
# 6. Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--test-range", nargs=2, type=float, metavar=("START", "END"),
                        help="Only output cuts within this time range (seconds)")
    args = parser.parse_args()
    test_start = args.test_range[0] if args.test_range else None
    test_end   = args.test_range[1] if args.test_range else None

    print("Loading transcript ...")
    words = load_words(TRANSCRIPT_PATH)
    total_end = words[-1]["end"]
    print(f"  {len(words)} words, {total_end:.1f}s total")

    print("Extracting script sentences ...")
    sentences = extract_sentences(SCRIPT_PATH)
    print(f"  {len(sentences)} spoken sentences")

    print("\nFinding take candidates ...")
    all_candidates = []
    for s in sentences:
        all_candidates.append(find_take_starts(s, words))

    # Greedy backward pass: pick LAST valid position per sentence
    chosen = [None] * len(sentences)
    upper  = len(words)
    for i in range(len(sentences) - 1, -1, -1):
        valid = [p for p in all_candidates[i] if p < upper]
        if valid:
            chosen[i] = valid[-1]
            upper = chosen[i]

    matched_full = []
    for i, s in enumerate(sentences):
        if chosen[i] is not None:
            t = words[chosen[i]]["start"]
            matched_full.append((i, s, chosen[i]))

    if not matched_full:
        print("No matches found.")
        sys.exit(1)

    # ------------------------------------------------------------------
    # Build CUT ranges with buffers + preview text
    # ------------------------------------------------------------------
    cut_ranges = []

    # 1. Meta-commentary at start
    first_keep_t = words[matched_full[0][2]]["start"] - KEEP_BUFFER
    if first_keep_t > 0.5:
        _, after_text = context_text(words, matched_full[0][2])
        cut_ranges.append({
            "start":  0.0,
            "end":    round(max(0, first_keep_t), 3),
            "reason": "meta-commentary before video starts",
            "preview_after": after_text,
        })

    # 2. Failed-take gaps between consecutive sentences
    for k in range(len(matched_full) - 1):
        orig_idx_curr, s_curr, widx_curr = matched_full[k]
        orig_idx_next, s_next, widx_next = matched_full[k + 1]

        T_curr = words[widx_curr]["start"]
        T_next = words[widx_next]["start"]

        cands_next = [p for p in all_candidates[orig_idx_next]
                      if words[p]["start"] > T_curr + 1.0]

        if not cands_next:
            continue

        first_failed_idx = cands_next[0]
        first_failed_t   = words[first_failed_idx]["start"]
        gap = T_next - first_failed_t
        if gap <= MIN_GAP:
            continue

        cut_start = max(0, first_failed_t - CUT_BUFFER)
        cut_end   = max(cut_start + 0.1, T_next - KEEP_BUFFER)

        if cut_end - cut_start < 0.5:
            continue

        before_text, _ = context_text(words, first_failed_idx)
        _, after_text  = context_text(words, widx_next)

        cut_ranges.append({
            "start":  round(cut_start, 3),
            "end":    round(cut_end, 3),
            "reason": f"failed takes before: {s_next[:55]}",
            "preview_before": before_text,
            "preview_after":  after_text,
        })

    # ------------------------------------------------------------------
    # Filter to test range if requested
    # ------------------------------------------------------------------
    if test_start is not None:
        cut_ranges = [c for c in cut_ranges
                      if c["start"] >= test_start and c["end"] <= test_end]

    # ------------------------------------------------------------------
    # Sort by start time and print with previews
    # ------------------------------------------------------------------
    cut_ranges.sort(key=lambda c: c["start"])

    total_cut  = sum(c["end"] - c["start"] for c in cut_ranges)
    total_keep = total_end - total_cut
    print(f"\n{'='*65}")
    print(f"CUT SUMMARY  {len(cut_ranges)} cuts | "
          f"{total_cut:.0f}s removed | {total_keep:.0f}s kept | {total_end:.0f}s total")
    print("="*65)

    for i, c in enumerate(cut_ranges, 1):
        dur = c["end"] - c["start"]
        print(f"\nCUT #{i:02d}  {c['start']:.1f}s ({to_tc(c['start'])}) "
              f"-- {c['end']:.1f}s ({to_tc(c['end'])})  [{dur:.1f}s]")
        print(f"  Reason: {c['reason']}")
        if "preview_before" in c:
            print(f"  ...before: \"{c['preview_before'][-80:]}\"")
        if "preview_after" in c:
            print(f"  after...:  \"{c['preview_after'][:80]}\"")

    # ------------------------------------------------------------------
    # Strip preview fields and write JSON
    # ------------------------------------------------------------------
    output = [{k: v for k, v in c.items() if not k.startswith("preview")}
              for c in cut_ranges]

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)
    print(f"\nWrote {len(output)} cuts -> {OUTPUT_PATH}")
    print("Review the previews above carefully before applying to Premiere.")


if __name__ == "__main__":
    main()
