import argparse
import whisper
import json

parser = argparse.ArgumentParser()
parser.add_argument("--audio", required=True, help="Path to audio/video file")
parser.add_argument("--output", required=True, help="Output JSON path")
parser.add_argument("--model", default="base", help="Whisper model name (base, small, medium, large)")
args = parser.parse_args()

audio_path = args.audio
out_path = args.output

print(f"Loading Whisper model ({args.model})...")
model = whisper.load_model(args.model)

print(f"Transcribing {audio_path} with word timestamps...")
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
