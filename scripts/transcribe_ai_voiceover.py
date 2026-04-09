import whisper, json

model = whisper.load_model('base')

files = [
    ('G:/Shared drives/Scratch Disk/Videos/Illegals Childcare/AI VoiceOver/ElevenLabs_2026-04-07T10_11_40_Asher_pvc_sp100_s50_sb75_se0_b_m2.mp3', 0),
    ('G:/Shared drives/Scratch Disk/Videos/Illegals Childcare/AI VoiceOver/ElevenLabs_2026-04-07T10_12_56_Asher_pvc_s50_m2.mp3', 324.8245),
]

all_words = []
for path, offset in files:
    print(f'Transcribing: {path}')
    result = model.transcribe(path, word_timestamps=True)
    for seg in result['segments']:
        for w in seg.get('words', []):
            all_words.append({
                'word': w['word'].strip(),
                'start': round(w['start'] + offset, 3),
                'end': round(w['end'] + offset, 3)
            })
    print(f'  Done. Words so far: {len(all_words)}')

output_path = 'D:/Claude Experiments/ai_voiceover_transcript.json'
with open(output_path, 'w') as f:
    json.dump(all_words, f, indent=2)

print(f'Saved {len(all_words)} words to {output_path}')
print('First 10:', all_words[:10])
print('Last 5:', all_words[-5:])
