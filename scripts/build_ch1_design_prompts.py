"""Generate singham_research/ch1_design_prompts.md — one self-contained
Claude-design prompt per Chapter 1 beat.

Merges singham_research/ch1_beats.json (content) with
.playwright-mcp/ch1_placements.json (per-beat durations) so every prompt
carries the on-screen text verbatim and the timing the A-roll expects.

Run:  python scripts/build_ch1_design_prompts.py
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BEATS_FILE = ROOT / "singham_research" / "ch1_beats.json"
PLACEMENTS_FILE = ROOT / ".playwright-mcp" / "ch1_placements.json"
OUT_FILE = ROOT / "singham_research" / "ch1_design_prompts.md"

STYLE_BLOCK = """STYLE — "Fern" investigative-documentary motion graphics. Follow exactly:
- Background: vertical gradient, warm charcoal #181613 at top to #0F0E0C at bottom — never pure black. Add a soft radial vignette darkening the edges ~35%, and a faint animated film-grain texture over the whole frame.
- The entire composition zooms in very slowly from 100% to 105% scale across the full duration (a barely perceptible Ken Burns push).
- Colors: primary text cream #E9E1CF; secondary text / labels warm gray #787164; ONE accent color, rust #C2492A, used sparingly (underlines, pins, strings, stamps, highlight boxes). Paper documents are aged cream #E8DEC8 with dark ink #2B2620.
- Typography, three roles only: (1) headlines in a tightly condensed grotesque sans (Bahnschrift Condensed / Arial Narrow style), ALL CAPS, tight line-height; (2) kickers, captions, citations and chips in a monospace font (Consolas style), ALL CAPS, wide letter-spacing; (3) quotations and document body text in a classic serif (Georgia style).
- Motion: every entrance eases out (cubic) — never linear, never bouncy, no overshoot except where noted. Sibling elements stagger in about 0.5s apart. The whole frame fades in over the first 0.4s and fades out over the last 0.5s.
- Keep the frame quiet and confident: lots of dark negative space, nothing decorative beyond what is specified."""


def money(v: int) -> str:
    return f"{v:,}"


def stat_display(s: dict) -> str:
    return f"{s.get('prefix', '')}{money(s['value'])}{s.get('suffix', '')}"


def q(text: str) -> str:
    return '"' + text + '"'


def source_line(props: dict) -> list[str]:
    if props.get("source"):
        return [f'- Bottom-left corner, tiny mono citation: "SOURCE · {props["source"]}"']
    return []


# ---------------------------------------------------------------- recipes

def title_card(p: dict) -> tuple[str, list[str]]:
    n = len(p["lines"])
    chor = (
        "LAYOUT & ANIMATION — full-screen title card, everything centered:\n"
        f"1. The small mono kicker fades and rises in first, above the headline.\n"
        f"2. The headline — {n} stacked line{'s' if n > 1 else ''} of huge condensed ALL-CAPS cream type filling the middle of the frame — rises in line by line, ~0.5s stagger.\n"
        "3. A rust underline bar draws in left-to-right beneath the headline.\n"
        "4. The sub-line(s) in warm gray fade in below, staggered."
    )
    content = [f'- Kicker (mono, gray): "{p["kicker"]}"',
               "- Headline lines (condensed caps, cream), stacked in this order:"]
    content += [f'  - "{ln}"' for ln in p["lines"]]
    if p.get("sub"):
        content.append(f'- Sub-line (gray): "{p["sub"]}"')
    if p.get("sub2"):
        content.append(f'- Second sub-line (gray): "{p["sub2"]}"')
    content += source_line(p)
    return chor, content


def quote_card(p: dict) -> tuple[str, list[str]]:
    has_photo = "photo" in p
    chor = (
        "LAYOUT & ANIMATION — pull-quote card"
        + (", quote weighted to the left half because a photo occupies the right side" if has_photo else "")
        + ":\n"
        "1. The small mono kicker fades in top-left of the quote block.\n"
        "2. A giant rust serif opening quotation mark (“) appears anchored to the quote's top-left.\n"
        "3. The quote itself — large cream serif, wrapping over a few lines — rises in line by line, ~0.5s stagger.\n"
        "4. A rust underline draws beneath the quote, then the mono attribution line fades in, then the gray sub-line."
    )
    if has_photo:
        chor += (
            "\n5. On the right: a polaroid-style evidence photo — cream border, rust pushpin at the top edge, "
            "sepia-treated image, mono caption on the border below — springs in slightly oversized (108%) and "
            "settles to 100%, rotated ~2°."
        )
    content = [f'- Kicker (mono, gray): "{p["kicker"]}"',
               f'- Quote (serif, cream): {q(p["quote"])}',
               f'- Attribution (mono): "— {p["attribution"]}"']
    if p.get("sub"):
        content.append(f'- Sub-line (gray): "{p["sub"]}"')
    if has_photo:
        content.append(f'- Photo caption (mono, on the polaroid border): "{p["photo"]["caption"]}"')
    content += source_line(p)
    return chor, content


def evidence_board(p: dict) -> tuple[str, list[str]]:
    cards = p["cards"]
    n_str = len(p.get("strings", []))
    chor = (
        "LAYOUT & ANIMATION — detective evidence board (corkboard feel, but on the dark charcoal background):\n"
        "1. Top-left: the mono kicker fades in, then the condensed ALL-CAPS title below it, with a rust underline drawing beneath.\n"
        f"2. {len(cards)} pinned evidence cards appear one at a time (~0.5s stagger), each springing in slightly oversized (108%) and settling to 100%. "
        "Every card is polaroid-style: cream border, a rust pushpin at its top edge, a small rotation as noted, and a mono ALL-CAPS caption on the bottom border. "
        "Photo cards show a sepia-treated image; text cards show a short serif quote/statement in dark ink on aged cream paper.\n"
        f"3. After all cards settle, {n_str} rust 'conspiracy string{'s' if n_str != 1 else ''}' draw{'s' if n_str == 1 else ''} on between the pushpins — thin sagging curved thread(s), animated from one pin to the other."
    )
    content = [f'- Kicker (mono, gray): "{p["kicker"]}"',
               f'- Title (condensed caps, cream): "{p["title"]}"',
               "- Cards, left to right:"]
    for c in cards:
        rot = c.get("rot", 0)
        if "src" in c:
            content.append(
                f'  - PHOTO card (use the attached photo, sepia; if none attached, an empty cream frame), '
                f'rotated {rot}° — caption: "{c["caption"]}"')
        else:
            content.append(
                f'  - TEXT card (serif ink on aged paper), rotated {rot}° — body: {q(c["body"])} '
                f'— caption: "{c["caption"]}"')
    content += source_line(p)
    return chor, content


def timeline(p: dict) -> tuple[str, list[str]]:
    events = p["events"]
    chor = (
        "LAYOUT & ANIMATION — horizontal timeline across the middle of the frame:\n"
        "1. Top-left: the mono kicker fades in"
        + (", then the condensed ALL-CAPS title with a rust underline" if p.get("title") else "")
        + ".\n"
        "2. A thin cream baseline draws itself left-to-right across the frame.\n"
        f"3. As the line reaches each of the {len(events)} event positions, a rust node dot pops in with a brief expanding ring. "
        "At each node: the year in big condensed cream caps, a mono ALL-CAPS label, and (where given) a small rust sub-label. "
        "Alternate events above and below the line."
    )
    content = [f'- Kicker (mono, gray): "{p["kicker"]}"']
    if p.get("title"):
        content.append(f'- Title (condensed caps, cream): "{p["title"]}"')
    content.append("- Events, in order along the line:")
    for e in events:
        line = f'  - {e["year"]} — label: "{e["label"]}"'
        if e.get("sub"):
            line += f' — rust sub-label: "{e["sub"]}"'
        content.append(line)
    content += source_line(p)
    return chor, content


def stat_counter(p: dict) -> tuple[str, list[str]]:
    stats = p["stats"]
    single = len(stats) == 1
    chor = (
        "LAYOUT & ANIMATION — animated statistics card:\n"
        "1. The mono kicker fades in at the top"
        + (", then the condensed ALL-CAPS title with a rust underline" if p.get("title") else "")
        + ".\n"
        + ("2. One huge centered number (~230px, cream, tabular digits) counts up from 0 to its final value, fast at first then settling (ease-out). "
           if single else
           f"2. {len(stats)} big numbers in a row (cream, tabular digits) count up from 0 to their final values, fast at first then settling (ease-out), staggered ~0.5s. ")
        + "Prefixes/suffixes ($, %) stay attached to the digits. Under each number a rust underline draws in, then its mono ALL-CAPS label fades in."
        + ("\n3. A bottom row of small bordered mono ALL-CAPS 'chips' fades in one by one." if p.get("chips") else "")
    )
    content = [f'- Kicker (mono, gray): "{p["kicker"]}"']
    if p.get("title"):
        content.append(f'- Title (condensed caps, cream): "{p["title"]}"')
    content.append("- Stats:")
    for s in stats:
        content.append(f'  - {stat_display(s)} — label: "{s["label"]}"')
    if p.get("chips"):
        content.append("- Chips (small bordered mono tags), left to right: "
                       + " · ".join(q(c) for c in p["chips"]))
    content += source_line(p)
    return chor, content


def map_route(p: dict) -> tuple[str, list[str]]:
    if "stops" in p:
        stops = p["stops"]
        chor = (
            "LAYOUT & ANIMATION — journey map over an abstract globe backdrop:\n"
            "1. Backdrop: very faint warm-gray graticule (thin longitude/latitude ellipses suggesting a globe), static, low contrast against the charcoal.\n"
            "2. Top-left: mono kicker fades in, then the condensed ALL-CAPS title with a rust underline.\n"
            f"3. A dashed rust arc draws itself across the frame left-to-right, connecting {len(stops)} journey stops.\n"
            "4. As the arc reaches each stop, a rust node pops in with the stop name in condensed cream caps and a small mono sub-label. Alternate labels above and below the arc."
        )
        content = [f'- Kicker (mono, gray): "{p["kicker"]}"',
                   f'- Title (condensed caps, cream): "{p["title"]}"',
                   "- Stops, in order:"]
        for s in stops:
            line = f'  - "{s["label"]}"'
            if s.get("sub"):
                line += f' — sub-label: "{s["sub"]}"'
            content.append(line)
    else:
        blocs = p["blocs"]
        chor = (
            "LAYOUT & ANIMATION — two opposing blocs over an abstract globe backdrop:\n"
            "1. Backdrop: very faint warm-gray graticule (thin longitude/latitude ellipses suggesting a globe), static, low contrast against the charcoal.\n"
            "2. Top-center: mono kicker fades in, then the condensed ALL-CAPS title with a rust underline.\n"
            "3. Two bordered column groups face off, left vs right. Each group: a thin rectangular border, the group title in mono caps at the top, then its member items in condensed cream caps stacking in one by one (~0.5s stagger). "
            "The ACCENT group uses rust for its border and title; the other group uses warm gray."
        )
        content = [f'- Kicker (mono, gray): "{p["kicker"]}"',
                   f'- Title (condensed caps, cream): "{p["title"]}"']
        for b in blocs:
            tag = "ACCENT (rust) group" if b.get("accent") else "Gray group"
            content.append(f'- {tag} — title: "{b["title"]}" — items: '
                           + ", ".join(q(i) for i in b["items"]))
    content += source_line(p)
    return chor, content


def document_reveal(p: dict) -> tuple[str, list[str]]:
    lines = p["lines"]
    has_redaction = any("█" in ln["text"] for ln in lines)
    highlights = [ln["highlight"] for ln in lines if ln.get("highlight")]
    chor = (
        "LAYOUT & ANIMATION — leaked-document reveal:\n"
        "1. The mono kicker fades in on the dark background, upper-left.\n"
        "2. An aged cream paper sheet (#E8DEC8), rotated about -1° with a soft drop shadow, drops in and settles center-frame.\n"
        "3. On the paper, in dark ink: a mono ALL-CAPS document title, a smaller mono subtitle, and a thin horizontal rule under them.\n"
        "4. The document's body lines (mono, dark ink) appear one line at a time, like a file being read."
    )
    step = 5
    if has_redaction:
        chor += f"\n{step}. Runs of █ blocks are solid-black REDACTION bars that slide in across their spot on the line."
        step += 1
    if highlights:
        plural = len(highlights) > 1
        chor += (f"\n{step}. The phrase{'s' if plural else ''} "
                 + " and ".join(q(h) for h in highlights)
                 + f" get{'' if plural else 's'} a rust rectangle drawn around "
                 + f"{'them' if plural else 'it'} (animated, drawing on like a pen stroke).")
        step += 1
    if p.get("stamp"):
        chor += (f"\n{step}. Finally a big rotated rust rubber-stamp reading \"{p['stamp']}\" slams onto the paper "
                 "(scales down from oversized with a hard settle, slightly rotated, distressed edges).")
    content = [f'- Kicker (mono, gray, on the dark background): "{p["kicker"]}"',
               f'- Document title (mono caps, ink): "{p["docTitle"]}"',
               f'- Document subtitle (mono, ink): "{p["docSub"]}"',
               "- Document body lines, in order (█ runs = redaction bars):"]
    for ln in lines:
        line = f'  - "{ln["text"]}"'
        if ln.get("highlight"):
            line += f' — rust box around "{ln["highlight"]}"'
        content.append(line)
    if p.get("stamp"):
        content.append(f'- Rust stamp: "{p["stamp"]}"')
    content += source_line(p)
    return chor, content


RECIPES = {
    "FernTitleCard": title_card,
    "FernQuoteCard": quote_card,
    "FernEvidenceBoard": evidence_board,
    "FernTimeline": timeline,
    "FernStatCounter": stat_counter,
    "FernMapRoute": map_route,
    "FernDocumentReveal": document_reveal,
}


def beat_photos(props: dict) -> list[str]:
    srcs = [c["src"] for c in props.get("cards", []) if "src" in c]
    if "photo" in props:
        srcs.append(props["photo"]["src"])
    return srcs


def main() -> None:
    beats = json.loads(BEATS_FILE.read_text(encoding="utf-8"))["beats"]
    placements = {p["beat"]: p for p in json.loads(PLACEMENTS_FILE.read_text(encoding="utf-8"))}

    out = []
    out.append("# Chapter 1 — Claude Design Animation Prompts (33 beats)\n")
    out.append("""One self-contained prompt per Chapter 1 beat. Generated by `scripts/build_ch1_design_prompts.py`
from `ch1_beats.json` + the A-roll timing queue — regenerate rather than hand-editing.

**How to use**

1. Copy one code block below and paste it into a Claude design session (one beat per session works best).
2. **Photo beats** (3, 7, 12, 15, 26, 29): first attach the listed image(s) from `public/singham_ch1/` to the session — Claude design can't reach your disk. The prompt tells it where the photo goes.
3. The stated duration matches the narration window this beat covers in the A-roll (`ch1_placements.json`). Claude design output doesn't have to be frame-exact — anything within ~a second trims fine in Premiere.
4. Export/record the result at 1920×1080 and save it as `beatNN_<slug>` (e.g. `beat01_origin`) into `G:\\Shared drives\\Scratch Disk\\Videos\\Singham Documentary\\Animations\\` so the existing Premiere placement queue picks it up.

Every prompt repeats the full Fern style block, so each one works in a fresh session with no other context.

---
""")

    for b in beats:
        props = b["props"]
        dur = placements[b["id"]]["duration"]
        dur_txt = f"{dur:.0f}" if abs(dur - round(dur)) < 0.05 else f"{dur:.1f}"
        chor, content = RECIPES[b["template"]](props)

        out.append(f"## Beat {b['id']:02d} — {b['slug']} ({b['template']})\n")
        meta = [f"~{dur_txt}s"]
        photos = beat_photos(props)
        if photos:
            files = ", ".join(f"`public/{s}`" for s in photos)
            meta.append(f"**attach first:** {files}")
        out.append("• " + " • ".join(meta) + "\n")
        out.append("````")
        out.append(
            f"Create a 1920×1080 landscape animated graphic, about {dur_txt} seconds long, "
            "playing once (no loop). It is an overlay shot for an investigative documentary.\n"
        )
        out.append(STYLE_BLOCK + "\n")
        out.append(chor + "\n")
        out.append("ON-SCREEN TEXT (use verbatim — do not rephrase, correct, or expand anything):")
        out.extend(content)
        out.append("````\n")

    OUT_FILE.write_text("\n".join(out), encoding="utf-8")
    print(f"Wrote {OUT_FILE} ({len(beats)} beats)")


if __name__ == "__main__":
    main()
