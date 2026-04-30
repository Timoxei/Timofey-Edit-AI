"""
Align Script Part 2 B-roll triggers to AI voiceover Whisper transcripts.

Inputs:
  .playwright-mcp/broll_part2_placements.json  (from match_part2_broll.py)
  D:/Claude Experiments/script2_transcript.json       (Script 2.mp3, 302s)
  D:/Claude Experiments/script2_under_transcript.json (Script 2_.mp3, 201s)

For each B-roll trigger, find the FIRST trigger word in either transcript,
record (audio_index, audio_relative_time). Final timeline_start is computed
later by adding each MP3's V1 in-time (from Premiere bridge inspection).

Outputs:
  .playwright-mcp/broll_part2_alignment.json
"""
import json
import re
from difflib import SequenceMatcher

PLACEMENTS = ".playwright-mcp/broll_part2_placements.json"
T1 = "D:/Claude Experiments/script2_transcript.json"
T2 = "D:/Claude Experiments/script2_under_transcript.json"
OUT = ".playwright-mcp/broll_part2_alignment.json"

PRE_ROLL = 0.3  # seconds — subtract from trigger word start to leave breath room


def normalize_word(w):
    """Lowercase + strip punctuation/quotes/hyphens for comparison."""
    return re.sub(r"[^\w]", "", w.lower())


def find_phrase_in_transcript(phrase, words):
    """
    Find best-matching position of phrase (string) in transcript word list.
    Returns (word_index, score, matched_run_length) or (None, 0, 0).

    Strategy:
      1. Take first 4-6 content tokens of phrase
      2. Slide window over transcript words, score with SequenceMatcher on normalized tokens
      3. Return best position with score >= 0.6
    """
    p_tokens = [normalize_word(t) for t in phrase.split() if normalize_word(t)]
    p_tokens = [t for t in p_tokens if len(t) > 1]  # drop single-letter junk
    if not p_tokens:
        return None, 0, 0

    # Use first 6 tokens as anchor — captures uniqueness
    anchor = p_tokens[:6]
    anchor_str = " ".join(anchor)
    win_size = max(3, len(anchor))
    max_win = win_size + 4  # allow some flex

    best = (None, 0.0, 0)

    for size in range(win_size, max_win + 1):
        for i in range(len(words) - size + 1):
            window_tokens = [normalize_word(words[j]["word"]) for j in range(i, i + size)]
            window_tokens = [t for t in window_tokens if t]
            if not window_tokens:
                continue
            window_str = " ".join(window_tokens[:len(anchor)])
            if not window_str:
                continue
            score = SequenceMatcher(None, anchor_str, window_str).ratio()
            if score > best[1]:
                best = (i, score, size)

    if best[1] >= 0.6:
        return best
    return None, best[1], best[2]


def main():
    with open(PLACEMENTS, encoding="utf-8") as f:
        placements = json.load(f)
    with open(T1, encoding="utf-8") as f:
        t1 = json.load(f)
    with open(T2, encoding="utf-8") as f:
        t2 = json.load(f)

    transcripts = [
        {"name": "Script 2.mp3", "words": t1["words"], "duration": 302.21},
        {"name": "Script 2_.mp3", "words": t2["words"], "duration": 200.6},
    ]

    aligned = []
    for p in placements:
        trigger = p["trigger_text"]
        # Try each transcript; pick the highest-scoring match
        best_match = None
        for ti, trans in enumerate(transcripts):
            idx, score, span = find_phrase_in_transcript(trigger, trans["words"])
            if idx is not None:
                if not best_match or score > best_match["score"]:
                    word = trans["words"][idx]
                    best_match = {
                        "audio_index": ti,
                        "audio_name": trans["name"],
                        "word_index": idx,
                        "word": word["word"],
                        "audio_relative_start": word["start"],
                        "score": round(score, 3),
                        "span": span,
                    }

        entry = dict(p)
        if best_match:
            entry.update({
                "match": best_match,
                "alignment_status": "MATCHED",
                "audio_relative_start": best_match["audio_relative_start"],
                "audio_index": best_match["audio_index"],
            })
        else:
            entry.update({
                "match": None,
                "alignment_status": "NO_MATCH",
            })
        aligned.append(entry)

    matched = sum(1 for a in aligned if a["alignment_status"] == "MATCHED")
    print(f"{matched}/{len(aligned)} placements matched to a transcript")

    # Group by which audio
    by_audio = {0: 0, 1: 0, "none": 0}
    for a in aligned:
        if a["alignment_status"] == "MATCHED":
            by_audio[a["audio_index"]] += 1
        else:
            by_audio["none"] += 1
    print(f"  in Script 2.mp3:  {by_audio[0]}")
    print(f"  in Script 2_.mp3: {by_audio[1]}")
    print(f"  unmatched:        {by_audio['none']}")

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(aligned, f, indent=2, ensure_ascii=False)
    print(f"\nWrote {OUT}")


if __name__ == "__main__":
    main()
