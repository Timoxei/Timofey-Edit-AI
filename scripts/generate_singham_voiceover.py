"""Generate AI voiceover for the Singham Documentary (Chapters 1 + 2).

Same architecture as scripts/generate_embassy_voiceover.py:
  - Per sentence: synthesize MP3 with edge-tts, capture WordBoundary events
  - Concat all sentence MP3s into aroll.mp3 via ffmpeg
  - Build word/sentence timings JSON using file-measured durations as authoritative

Input is a pre-curated narration file (spoken lines only, one paragraph per
line): singham_research/vo_ch1_ch2_narration.txt

Outputs (in OUT_DIR):
  aroll.mp3
  aroll_timings.json
  sentences/sNNN.mp3
  concat.txt
  script_clean.txt    (the spoken text exactly as fed to TTS, sentence-per-line)
"""
from __future__ import annotations

import asyncio
import json
import re
import subprocess
from pathlib import Path

import edge_tts

RAW_TXT = Path(r"C:\Users\user\Timofey-Edit-AI\singham_research\vo_ch1_ch2_narration.txt")
OUT_DIR = Path(r"G:\Shared drives\Scratch Disk\Videos\Singham Documentary\Script")
SENT_DIR = OUT_DIR / "sentences"

VOICE = "en-US-AndrewNeural"
RATE = "+0%"


def clean_line(line: str) -> str:
    s = line.strip()
    # Curly quotes -> ASCII for cleaner TTS
    s = (
        s.replace("’", "'")
         .replace("‘", "'")
         .replace("“", '"')
         .replace("”", '"')
         .replace("–", "-")
         .replace("—", " - ")
         .replace("…", "...")
    )
    s = re.sub(r"\s+", " ", s).strip()
    return s


# Splits a paragraph into sentence-ish chunks for individual synth.
# Only split if the period is preceded by a lowercase letter or digit (so
# abbreviations like "U.S." don't break), and the next chunk starts with a
# capital, digit, or opening quote.
SENT_SPLIT = re.compile(r"(?<=[a-z0-9][.!?])\s+(?=[A-Z0-9\"'])")


def split_sentences(paragraph: str) -> list[str]:
    paragraph = paragraph.strip()
    if not paragraph:
        return []
    parts = SENT_SPLIT.split(paragraph)
    merged: list[str] = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        if merged and len(p.split()) <= 1 and not p[0].isupper():
            merged[-1] = merged[-1] + " " + p
        else:
            merged.append(p)
    return merged


def extract_script() -> list[str]:
    """Return the ordered list of spoken sentences."""
    text = RAW_TXT.read_text(encoding="utf-8")
    sentences: list[str] = []
    for raw in text.splitlines():
        cleaned = clean_line(raw)
        if not cleaned:
            continue
        for s in split_sentences(cleaned):
            if re.search(r"[A-Za-z]", s):
                sentences.append(s)
    return sentences


def ffprobe_duration(path: Path) -> float:
    res = subprocess.run(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        capture_output=True, text=True, check=True,
    )
    return float(res.stdout.strip())


async def synth_sentence(text: str, out_path: Path) -> list[dict]:
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")
    words: list[dict] = []
    with out_path.open("wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start = chunk["offset"] / 1e7
                dur = chunk["duration"] / 1e7
                words.append({"word": chunk["text"], "start": start, "end": start + dur})
    return words


async def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    SENT_DIR.mkdir(parents=True, exist_ok=True)

    sentences = extract_script()

    (OUT_DIR / "script_clean.txt").write_text(
        "\n".join(sentences) + "\n", encoding="utf-8"
    )

    print(f"Voice: {VOICE}")
    print(f"Sentences to synthesize: {len(sentences)}")
    print(f"Output dir: {OUT_DIR}\n")

    per_sentence_results = []
    for n, text in enumerate(sentences, 1):
        sent_file = SENT_DIR / f"s{n:03d}.mp3"
        preview = text if len(text) < 80 else text[:77] + "..."
        print(f"[{n:>3}/{len(sentences)}] {preview}")
        words = await synth_sentence(text, sent_file)
        dur = ffprobe_duration(sent_file)
        per_sentence_results.append({
            "n": n,
            "text": text,
            "file": str(sent_file),
            "duration": dur,
            "words": words,
        })

    # Concat all sentence MP3s
    concat_file = OUT_DIR / "concat.txt"
    final_mp3 = OUT_DIR / "aroll.mp3"
    with concat_file.open("w", encoding="utf-8") as f:
        for r in per_sentence_results:
            path_escaped = r["file"].replace("\\", "/").replace("'", r"'\''")
            f.write(f"file '{path_escaped}'\n")

    print("\nConcatenating with ffmpeg...")
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", str(concat_file),
            "-c", "copy",
            str(final_mp3),
        ],
        check=True,
        capture_output=True,
    )
    total_dur = ffprobe_duration(final_mp3)
    print(f"Final A-roll: {final_mp3}  ({total_dur:.1f}s)")

    cumulative = 0.0
    out_sentences = []
    out_words = []
    for r in per_sentence_results:
        s_start = cumulative
        s_end = cumulative + r["duration"]
        out_sentences.append({
            "n": r["n"],
            "text": r["text"],
            "file": r["file"],
            "start": s_start,
            "end": s_end,
        })
        for w in r["words"]:
            out_words.append({
                "word": w["word"],
                "start": s_start + w["start"],
                "end": s_start + w["end"],
                "sentence_n": r["n"],
            })
        cumulative = s_end

    timings = {
        "voice": VOICE,
        "rate": RATE,
        "audio_file": str(final_mp3),
        "total_duration": total_dur,
        "n_sentences": len(out_sentences),
        "n_words": len(out_words),
        "sentences": out_sentences,
        "words": out_words,
    }
    (OUT_DIR / "aroll_timings.json").write_text(
        json.dumps(timings, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    print(f"\nTotal duration: {total_dur:.1f}s  ({total_dur/60:.1f} min)")
    print(f"Words: {len(out_words)}   Sentences: {len(out_sentences)}")


if __name__ == "__main__":
    asyncio.run(main())
