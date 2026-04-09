import whisper
import json

audio_path = r"H:\Shared drives\Scratch Disk\Videos\03.24.26 - Iran Columbus Circle\2026-03-23 23-21-03.mp4"
out_path = r"D:\Claude Experiments\iran_aroll_transcript.json"

print("Loading Whisper model...")
model = whisper.load_model("base")

print("Transcribing with word timestamps...")
result = model.transcribe(audio_path, word_timestamps=True, language="en")

words = []
for segment in result["segments"]:
    for w in segment.get("words", []):
        words.append({
            "word": w["word"].strip(),
            "start": round(w["start"], 3),
            "end": round(w["end"], 3)
        })

output = {
    "full_text": result["text"],
    "words": words
}

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\nFull transcript:\n{result['text']}")
print(f"\nSaved {len(words)} words to {out_path}")
