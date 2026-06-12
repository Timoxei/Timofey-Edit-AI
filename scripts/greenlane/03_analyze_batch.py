"""Analyze all downloaded transcripts via the Anthropic Message Batches API.

Submits one request per .srt file, polls until done, writes per-video JSON
findings to D:\\All the transcripts\\greenlanemasjid\\_findings\\<videoid>.json
plus a combined _findings.json.

Usage:
    python 03_analyze_batch.py            # all transcripts in folder
    python 03_analyze_batch.py --limit 5  # first 5 only (smoke test)

Requires: ANTHROPIC_API_KEY in environment.
"""
import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

import anthropic

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

OUT_DIR = Path(r"D:\All the transcripts\greenlanemasjid")
FINDINGS_DIR = OUT_DIR / "_findings"
COMBINED = OUT_DIR / "_findings.json"
BATCH_ID_FILE = OUT_DIR / "_batch_id.txt"

MODEL = "claude-sonnet-4-6"
MAX_TOKENS = 4096

CATEGORIES = [
    "INCITEMENT_VIOLENCE", "TERROR_SUPPORT", "ANTISEMITISM", "ANTI_LGBT",
    "MISOGYNY", "SECTARIAN_HATE", "INTER_FAITH_HATE", "ANTI_DEMOCRATIC",
    "CONSPIRACY", "APOSTASY_PUNISHMENT", "CHILD_MARRIAGE", "OTHER",
]

RUBRIC = """You are reviewing English-language Islamic lecture transcripts for content that a journalist or regulator would flag. Transcripts are YouTube auto-captions — expect transcription errors and quote the text as it appears.

Flag statements in these categories:
1. INCITEMENT_VIOLENCE — direct calls for / justifications of violence against any group or individual
2. TERROR_SUPPORT — praise/justification for designated terror groups (Hamas, Hezbollah, ISIS, al-Qaeda, Taliban, Houthis, etc.)
3. ANTISEMITISM — hostility to Jews as a people/religion (NOT policy criticism of Israel)
4. ANTI_LGBT — calls for harm, criminalization, or dehumanization of LGBT people
5. MISOGYNY — statements degrading women / justifying violence against them
6. SECTARIAN_HATE — hostility to Shia, Sufi, Ahmadi, or other Muslim minorities
7. INTER_FAITH_HATE — hostility to Christians, Hindus, or other non-Jewish faiths
8. ANTI_DEMOCRATIC — rejection of democracy / calls for caliphate by force
9. CONSPIRACY — major conspiracy theories (Jewish control, great replacement, etc.)
10. APOSTASY_PUNISHMENT — endorsement of killing/punishing those who leave Islam
11. CHILD_MARRIAGE — defense or normalization of child marriage
12. OTHER — anything else a reasonable regulator would flag (explain in `context`)

DO NOT flag: mainstream theological views, criticism of any government's policies (including Israel's) absent ethnic hostility, historical/scholarly discussion of texts.

For each finding output an object with:
  timestamp (HH:MM:SS — earliest moment in the transcript where the quoted phrase appears)
  quote (verbatim from the transcript, max 300 chars)
  category (one of the 12 above)
  severity (1-5: 5=direct violence/terror support, 4=unambiguous extremism w/o call to action, 3=clearly bigoted w/o call, 2=ambiguous, 1=mild concern)
  context (1-2 sentence note on why it qualifies)

Return ONLY a JSON object: {"findings": [...]}. Empty array if nothing qualifies."""

SCHEMA = {
    "type": "object",
    "properties": {
        "findings": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "timestamp": {"type": "string"},
                    "quote": {"type": "string"},
                    "category": {"type": "string", "enum": CATEGORIES},
                    "severity": {"type": "integer"},
                    "context": {"type": "string"},
                },
                "required": ["timestamp", "quote", "category", "severity", "context"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["findings"],
    "additionalProperties": False,
}

SRT_BLOCK = re.compile(
    r"(\d+)\s*\n(\d\d):(\d\d):(\d\d)[,\.]\d+\s*-->[^\n]*\n(.+?)(?=\n\n|\Z)",
    re.DOTALL,
)
VIDEO_ID_RE = re.compile(r"\[([A-Za-z0-9_-]{11})\]\.en\.srt$")


def parse_srt(path: Path) -> str:
    """Parse an SRT file into '[HH:MM:SS] text' lines, deduping YouTube's rolling captions."""
    text = path.read_text(encoding="utf-8", errors="replace")
    lines: list[str] = []
    last_line = ""
    for m in SRT_BLOCK.finditer(text):
        ts = f"{m.group(2)}:{m.group(3)}:{m.group(4)}"
        for raw in m.group(5).strip().splitlines():
            line = raw.strip()
            if not line or line == last_line:
                continue
            lines.append(f"[{ts}] {line}")
            last_line = line
    return "\n".join(lines)


def video_id_from_filename(name: str) -> str | None:
    m = VIDEO_ID_RE.search(name)
    return m.group(1) if m else None


def build_requests(limit: int | None) -> list[anthropic.types.messages.batch_create_params.Request]:
    from anthropic.types.messages.batch_create_params import Request

    srts = sorted(p for p in OUT_DIR.iterdir() if p.suffix == ".srt")
    if limit:
        srts = srts[:limit]
    print(f"Building requests for {len(srts)} transcripts...")

    requests = []
    for srt in srts:
        vid_id = video_id_from_filename(srt.name)
        if not vid_id:
            print(f"  skip (no id): {srt.name}")
            continue
        transcript = parse_srt(srt)
        if not transcript.strip():
            print(f"  skip (empty): {srt.name}")
            continue
        requests.append(
            Request(
                custom_id=vid_id,
                params={
                    "model": MODEL,
                    "max_tokens": MAX_TOKENS,
                    "system": [
                        {
                            "type": "text",
                            "text": RUBRIC,
                            "cache_control": {"type": "ephemeral"},
                        }
                    ],
                    "messages": [{"role": "user", "content": transcript}],
                    "output_config": {
                        "format": {
                            "type": "json_schema",
                            "schema": SCHEMA,
                        }
                    },
                },
            )
        )
    return requests


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Skip submission; reuse batch_id from _batch_id.txt and just poll + download.",
    )
    args = parser.parse_args()

    FINDINGS_DIR.mkdir(parents=True, exist_ok=True)
    client = anthropic.Anthropic()

    if args.resume and BATCH_ID_FILE.exists():
        batch_id = BATCH_ID_FILE.read_text().strip()
        print(f"Resuming batch {batch_id}")
    else:
        requests = build_requests(args.limit)
        if not requests:
            print("No requests to submit. Exiting.")
            return
        print(f"Submitting batch of {len(requests)} requests...")
        batch = client.messages.batches.create(requests=requests)
        batch_id = batch.id
        BATCH_ID_FILE.write_text(batch_id)
        print(f"Batch id: {batch_id}")

    # Poll
    while True:
        batch = client.messages.batches.retrieve(batch_id)
        rc = batch.request_counts
        print(
            f"  status={batch.processing_status} "
            f"processing={rc.processing} succeeded={rc.succeeded} "
            f"errored={rc.errored} canceled={rc.canceled} expired={rc.expired}"
        )
        if batch.processing_status == "ended":
            break
        time.sleep(30)

    # Collect results
    print("Collecting results...")
    combined: dict[str, dict] = {}
    n_ok = n_err = 0
    for result in client.messages.batches.results(batch_id):
        vid_id = result.custom_id
        if result.result.type == "succeeded":
            msg = result.result.message
            text = "".join(b.text for b in msg.content if b.type == "text")
            try:
                payload = json.loads(text)
            except json.JSONDecodeError as e:
                payload = {"findings": [], "_parse_error": str(e), "_raw": text}
                n_err += 1
            else:
                n_ok += 1
            payload["_usage"] = {
                "input_tokens": msg.usage.input_tokens,
                "output_tokens": msg.usage.output_tokens,
                "cache_read_input_tokens": getattr(msg.usage, "cache_read_input_tokens", 0),
                "cache_creation_input_tokens": getattr(msg.usage, "cache_creation_input_tokens", 0),
            }
            (FINDINGS_DIR / f"{vid_id}.json").write_text(
                json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
            )
            combined[vid_id] = payload
        else:
            err_type = result.result.type
            err = getattr(result.result, "error", None)
            err_msg = getattr(err, "message", str(err)) if err else err_type
            combined[vid_id] = {"_error": err_type, "_message": err_msg, "findings": []}
            n_err += 1
            print(f"  ERROR [{vid_id}] {err_type}: {err_msg}")

    COMBINED.write_text(json.dumps(combined, ensure_ascii=False, indent=2), encoding="utf-8")
    total_findings = sum(len(v.get("findings", [])) for v in combined.values())
    print(f"\nDone. ok={n_ok} err={n_err} videos={len(combined)} total_findings={total_findings}")
    print(f"Combined: {COMBINED}")


if __name__ == "__main__":
    main()
