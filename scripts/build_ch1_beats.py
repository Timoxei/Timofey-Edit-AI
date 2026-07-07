"""Build per-beat Remotion props + Premiere placement queue for Singham Ch1.

Reads:
  singham_research/ch1_beats.json      (hand-authored beat sheet)
  aroll_timings.json                   (edge-tts sentence timings, authoritative)

Writes:
  .playwright-mcp/ch1_props/beatNN_<slug>.json   (props for `remotion render --props`)
  .playwright-mcp/ch1_placements.json            ([{beat, slug, template, file, t_in, duration}])
"""
from __future__ import annotations

import json
from pathlib import Path

REPO = Path(r"C:\Users\user\Timofey-Edit-AI")
BEATS_FILE = REPO / "singham_research" / "ch1_beats.json"
TIMINGS_FILE = Path(
    r"G:\Shared drives\Scratch Disk\Videos\Singham Documentary\Script\aroll_timings.json"
)
PROPS_DIR = REPO / ".playwright-mcp" / "ch1_props"
PLACEMENTS_FILE = REPO / ".playwright-mcp" / "ch1_placements.json"
RENDER_DIR = r"G:\Shared drives\Scratch Disk\Videos\Singham Documentary\Animations"

FPS = 30
DEFAULT_MAX_DUR = 16.0
MIN_DUR = 4.0
# Trim so the overlay's fade-out finishes just before the next sentence starts
TAIL_PAD = 0.15


def main() -> None:
    beats = json.loads(BEATS_FILE.read_text(encoding="utf-8"))["beats"]
    timings = json.loads(TIMINGS_FILE.read_text(encoding="utf-8"))
    by_n = {s["n"]: s for s in timings["sentences"]}

    PROPS_DIR.mkdir(parents=True, exist_ok=True)
    placements = []

    for beat in beats:
        s0 = by_n[beat["startSentence"]]
        s1 = by_n[beat["endSentence"]]
        t_in = s0["start"]
        max_dur = beat.get("maxDur", DEFAULT_MAX_DUR)
        dur = min(s1["end"] - t_in - TAIL_PAD, max_dur)
        dur = max(dur, MIN_DUR)
        frames = round(dur * FPS)

        props = dict(beat["props"])
        props["durationInFrames"] = frames

        name = f"beat{beat['id']:02d}_{beat['slug']}"
        props_path = PROPS_DIR / f"{name}.json"
        props_path.write_text(json.dumps(props, indent=2, ensure_ascii=False), encoding="utf-8")

        placements.append({
            "beat": beat["id"],
            "slug": beat["slug"],
            "template": beat["template"],
            "props_file": str(props_path),
            "file": rf"{RENDER_DIR}\{name}.mov",
            "t_in": round(t_in, 3),
            "duration": round(dur, 3),
            "frames": frames,
        })
        print(
            f"beat {beat['id']:>2} {beat['slug']:<16} {beat['template']:<20}"
            f" t_in={t_in:7.1f}s  dur={dur:5.1f}s  ({frames} fr)"
        )

    PLACEMENTS_FILE.write_text(
        json.dumps(placements, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    total = sum(p["duration"] for p in placements)
    print(f"\n{len(placements)} beats, {total:.0f}s of animation coverage")
    print(f"props -> {PROPS_DIR}")
    print(f"placements -> {PLACEMENTS_FILE}")


if __name__ == "__main__":
    main()
