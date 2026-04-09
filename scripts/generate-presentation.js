const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();

// ─── Theme ────────────────────────────────────────────────────────────────────
const BG = "0f0f1a";
const ACCENT = "00d4aa";
const WHITE = "ffffff";
const MUTED = "a0a0c0";
const FONT = "Arial";

pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inches

// ─── Helpers ──────────────────────────────────────────────────────────────────
function addBg(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: "100%",
    fill: { color: BG },
    line: { color: BG },
  });
}

function addAccentBar(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 6.9, w: "100%", h: 0.08,
    fill: { color: ACCENT },
    line: { color: ACCENT },
  });
}

function addSectionNumber(slide, num) {
  // Circle badge
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 0.4, y: 0.35, w: 0.55, h: 0.55,
    fill: { color: ACCENT },
    line: { color: ACCENT },
  });
  slide.addText(String(num), {
    x: 0.4, y: 0.35, w: 0.55, h: 0.55,
    align: "center", valign: "middle",
    fontSize: 16, bold: true,
    color: BG,
    fontFace: FONT,
  });
}

function sectionSlide(slide, num, title, bullets) {
  addBg(slide);
  addAccentBar(slide);
  addSectionNumber(slide, num);

  // Section title
  slide.addText(title, {
    x: 1.1, y: 0.3, w: 11.5, h: 0.75,
    fontSize: 28, bold: true,
    color: ACCENT,
    fontFace: FONT,
  });

  // Divider line under title
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.1, y: 1.05, w: 11.5, h: 0.03,
    fill: { color: "2a2a4a" },
    line: { color: "2a2a4a" },
  });

  // Bullets
  const bulletObjs = bullets.map((b) => ({
    text: b,
    options: {
      bullet: { type: "bullet", indent: 10 },
      color: WHITE,
      fontSize: 18,
      fontFace: FONT,
      breakLine: true,
      paraSpaceAfter: 6,
    },
  }));

  slide.addText(bulletObjs, {
    x: 1.1, y: 1.25, w: 11.5, h: 5.4,
    valign: "top",
    fontFace: FONT,
  });
}

// ─── Slide 1: Title ───────────────────────────────────────────────────────────
const s1 = pptx.addSlide();
addBg(s1);

// Big accent block left
s1.addShape(pptx.ShapeType.rect, {
  x: 0, y: 0, w: 0.18, h: "100%",
  fill: { color: ACCENT },
  line: { color: ACCENT },
});

s1.addText("Team Workflow\nSetup", {
  x: 0.6, y: 1.8, w: 8, h: 2.2,
  fontSize: 52, bold: true,
  color: WHITE,
  fontFace: FONT,
  lineSpacingMultiple: 1.1,
});

s1.addText("Questions to align with the team before we start", {
  x: 0.6, y: 4.1, w: 9, h: 0.6,
  fontSize: 20,
  color: MUTED,
  fontFace: FONT,
});

s1.addShape(pptx.ShapeType.rect, {
  x: 0.6, y: 3.95, w: 4.5, h: 0.04,
  fill: { color: ACCENT },
  line: { color: ACCENT },
});

// Slide count hint bottom right
s1.addText("10 topics", {
  x: 10.5, y: 6.9, w: 2.4, h: 0.4,
  fontSize: 13,
  color: MUTED,
  fontFace: FONT,
  align: "right",
});

// ─── Slide 2: People & Roles ──────────────────────────────────────────────────
sectionSlide(pptx.addSlide(), 1, "People & Roles", [
  "Who is on the team? (names, titles)",
  "Who owns what? (responsibilities per person)",
  "Are there external collaborators (clients, contractors, freelancers)?",
]);

// ─── Slide 3: Availability & Scheduling ──────────────────────────────────────
sectionSlide(pptx.addSlide(), 2, "Availability & Scheduling", [
  "What are each person's working hours and timezone?",
  "How far in advance should tasks be assigned?",
  "How do people signal when they're overloaded or blocked?",
  "Are there recurring team meetings or syncs to work around?",
  "What's the process for requesting time off or flagging unavailability?",
]);

// ─── Slide 4: Brand & Visual Identity ────────────────────────────────────────
sectionSlide(pptx.addSlide(), 3, "Brand & Visual Identity", [
  "Brand book / style guide (colors, fonts, logo usage rules)",
  "Approved font files and licenses",
  "Asset library (icons, illustrations, photos)",
  "Do/Don't examples of brand usage",
]);

// ─── Slide 5: Content & Templates ────────────────────────────────────────────
sectionSlide(pptx.addSlide(), 4, "Content & Templates", [
  "Video/post templates we reuse",
  "Copy/tone guidelines (formal? casual? target audience?)",
  "Standard formats for each content type (reels, stories, ads, etc.)",
  "Approval templates or checklists",
]);

// ─── Slide 6: Process & Workflow ──────────────────────────────────────────────
sectionSlide(pptx.addSlide(), 5, "Process & Workflow", [
  "How does a task start? (brief, request form, verbal?)",
  "Who reviews and approves before delivery?",
  "How many revision rounds are typical?",
  "What are deadlines and turnaround expectations?",
]);

// ─── Slide 7: Tools & Access ──────────────────────────────────────────────────
sectionSlide(pptx.addSlide(), 6, "Tools & Access", [
  "What tools does the team use? (Figma, Notion, Slack, Trello, etc.)",
  "Where are files stored? (Google Drive, Dropbox, S3?)",
  "Who needs access to what?",
]);

// ─── Slide 8: Delivery & Output ───────────────────────────────────────────────
sectionSlide(pptx.addSlide(), 7, "Delivery & Output", [
  "Where do finished files go?",
  "What formats/resolutions/specs are required per platform?",
  "Who handles publishing — us or the client?",
]);

// ─── Slide 9: Communication ───────────────────────────────────────────────────
sectionSlide(pptx.addSlide(), 8, "Communication", [
  "How do we communicate internally?",
  "How do we communicate with clients/stakeholders?",
  "What's the expected response time?",
]);

// ─── Slide 10: Priorities ─────────────────────────────────────────────────────
sectionSlide(pptx.addSlide(), 9, "Priorities", [
  "What's broken or painful right now?",
  'What does "done well" look like to the boss?',
]);

// ─── Slide 11: Commonly Forgotten ────────────────────────────────────────────
const s11 = pptx.addSlide();
addBg(s11);
addAccentBar(s11);

// Orange badge for "bonus"
s11.addShape(pptx.ShapeType.ellipse, {
  x: 0.4, y: 0.35, w: 0.55, h: 0.55,
  fill: { color: "ff6b35" },
  line: { color: "ff6b35" },
});
s11.addText("!", {
  x: 0.4, y: 0.35, w: 0.55, h: 0.55,
  align: "center", valign: "middle",
  fontSize: 18, bold: true,
  color: WHITE,
  fontFace: FONT,
});

s11.addText("Commonly Forgotten", {
  x: 1.1, y: 0.3, w: 11.5, h: 0.75,
  fontSize: 28, bold: true,
  color: "ff6b35",
  fontFace: FONT,
});

s11.addShape(pptx.ShapeType.rect, {
  x: 1.1, y: 1.05, w: 11.5, h: 0.03,
  fill: { color: "2a2a4a" },
  line: { color: "2a2a4a" },
});

const bonusBullets = [
  { label: "Feedback loops", desc: "Who gives feedback and how (written vs. verbal, in what tool)" },
  { label: "Emergency/rush process", desc: "What happens when something is urgent" },
  { label: "Offboarding", desc: "File handoff and access removal when someone leaves" },
  { label: "Archive policy", desc: "How long to keep old project files and where" },
];

let yPos = 1.35;
bonusBullets.forEach(({ label, desc }) => {
  s11.addShape(pptx.ShapeType.rect, {
    x: 1.1, y: yPos, w: 0.22, h: 0.28,
    fill: { color: "ff6b35" },
    line: { color: "ff6b35" },
    rounding: 0.05,
  });
  s11.addText(label, {
    x: 1.5, y: yPos, w: 11, h: 0.28,
    fontSize: 17, bold: true,
    color: WHITE,
    fontFace: FONT,
  });
  s11.addText(desc, {
    x: 1.5, y: yPos + 0.28, w: 11, h: 0.28,
    fontSize: 15,
    color: MUTED,
    fontFace: FONT,
  });
  yPos += 0.75;
});

// ─── Write file ───────────────────────────────────────────────────────────────
pptx.writeFile({ fileName: "out/team-workflow.pptx" }).then(() => {
  console.log("✓ Saved: out/team-workflow.pptx");
}).catch((err) => {
  console.error("Error:", err);
});
