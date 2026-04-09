---
name: viral-post
description: Write viral X (Twitter) posts for Nate Friedman's investigative videos. Transcribes video, identifies key moments, and drafts posts using proven viral patterns.
metadata:
  tags: x, twitter, social media, viral, post, nate friedman
user_invocable: true
---

## When to use

Use this skill when:
- The user wants to write an X post for one of Nate's videos
- The user says "write a post", "make a post", "viral post", or "/viral-post"
- The user provides a video file or transcript to turn into a social media post

## Workflow

### Step 1: Get the video content
- If given a file path, transcribe it with Whisper: `python -X utf8 -c "import whisper; model = whisper.load_model('small'); result = model.transcribe(r'PATH', verbose=False, task='translate'); ..."`
- If given a transcript, use it directly
- If given a URL, download with yt-dlp first

### Step 2: Identify the most viral-worthy moments
Scan the transcript for:
- Direct quotes with specific dollar amounts or admissions
- Named people, organizations, NGOs
- Shocking revelations or contradictions
- Follow-the-money connections
- Moments that would make someone stop scrolling

### Step 3: Write the post using proven patterns
Read the full playbook at [./rules/playbook.md](./rules/playbook.md) for detailed patterns and templates.

**Key rules:**
- Always write in FIRST PERSON (Nate's voice: "I went to...", "I found...")
- Always include TIMESTAMPS pointing to the best moments
- Use revelation hooks: EXPOSED, CONFIRMS, BREAKING
- Include specific numbers: dollar amounts, employee counts, revenue figures
- Include at least one direct quote from the video
- End with a short punchy punchline (3-7 words)
- ZERO hashtags
- People share EVIDENCE not opinions — prioritize receipts over reactions

### Step 4: Present options
Always write at least 2 versions:
- **Version A**: Short (5-7 paragraphs) — WSA-style video trailer
- **Version B**: Long (10+ paragraphs) — Loomer-style follow-the-money

### Step 5: Output
If the user asks, open Google Docs and paste both versions there.
