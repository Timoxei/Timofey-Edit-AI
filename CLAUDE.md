# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Workflow

After completing any meaningful piece of work, commit and push to GitHub immediately. Do not batch up many changes before committing — small, frequent commits are preferred so progress is never lost.

```bash
git add <specific files>
git commit -m "Short imperative summary of what changed"
git push
```

Commit message rules:
- Use the imperative mood ("Add X", "Fix Y", "Remove Z")
- First line ≤ 72 characters
- Describe *what* and *why*, not *how*

## Commands

```bash
npm run dev       # Start Remotion Studio (live preview at localhost:3000)
npm run build     # Bundle the project for rendering
npm run lint      # Run ESLint + TypeScript type-check
npx remotion render                        # Render the default composition to out/
npx remotion render --composition=TicTacToe  # Render a specific composition
npx remotion upgrade  # Upgrade all Remotion packages to latest
```

## Architecture

This is a **Remotion** project — videos are React components rendered frame-by-frame. There is no runtime app, only video output.

### Key concepts

- **`src/Root.tsx`** — registers all compositions via `<Composition>` tags. This is the entry point Remotion looks for (exported as `RemotionRoot`). Each `<Composition>` defines a video's `id`, React component, `fps`, dimensions, and `durationInFrames`.
- **`src/Composition.tsx`** — the actual video content as a React component. Uses `useCurrentFrame()` to get the current frame number and `useVideoConfig()` for fps/dimensions. Animations are driven by `spring()` and `interpolate()` from `remotion`.
- **`src/index.ts`** — Remotion entry point that re-exports `RemotionRoot`.
- **`src/index.css`** — global styles; imported in `Root.tsx` for Tailwind v4.
- **`remotion.config.ts`** — sets output format (jpeg), overwrite behavior, and enables Tailwind v4 via webpack override.

### Animation pattern

All animations are purely functional: given a frame number, deterministically return a visual state. The typical pattern is:

```ts
const progress = spring({ frame: frame - START_FRAME, fps, config: { damping: 200 } });
const value = interpolate(progress, [0, 1], [fromValue, toValue]);
```

Delays are achieved by subtracting an offset from `frame` before passing to `spring()`. `spring()` clamps naturally when `frame - offset < 0`.

### Adding a new composition

1. Create a new component file in `src/`
2. Export a `TOTAL_FRAMES` constant from it
3. Register it in `src/Root.tsx` with a new `<Composition>` tag

### Stack

- Remotion 4.0 + React 19
- Tailwind CSS v4 (via `@remotion/tailwind-v4` webpack plugin)
- TypeScript strict mode (`noUnusedLocals` enforced)
- ESLint with `@remotion/eslint-config-flat`

## Python Tools (system-wide, pip)

Python 3.11.9 is installed at `C:\Users\user\AppData\Local\Programs\Python\Python311\python.exe`.

| Tool | Version | Purpose |
|---|---|---|
| `yt-dlp` | 2026.03.17 | Download YouTube transcripts/subtitles and video info |
| `openai-whisper` | 20250625 | Local speech-to-text transcription |

Install missing tools:
```bash
pip install yt-dlp
pip install openai-whisper
```

## Scripts

### `scripts/download_transcripts.py`
Downloads `.srt` transcripts for all videos on the `@natefriedman` YouTube channel and sorts them by topic:

- `D:\All the transcripts\protests\` — protest-related videos
- `D:\All the transcripts\immigrant\` — immigration/migrant videos
- `D:\All the transcripts\` (root) — everything else

Requires a video list at `C:\Users\user\AppData\Local\Temp\nate_videos.txt`. Regenerate it with:
```bash
yt-dlp --flat-playlist --print "%(id)s|||%(title)s" "https://www.youtube.com/@natefriedman" > "C:/Users/user/AppData/Local/Temp/nate_videos.txt"
```
Then run:
```bash
python scripts/download_transcripts.py
```
