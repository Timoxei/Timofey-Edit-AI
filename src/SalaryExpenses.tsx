export const TOTAL_FRAMES = 1;

const rowsTop = [
  {
    n: 1,
    label: "Grants and other assistance to domestic organizations and domestic governments",
    a: "478", b: "478", c: "", d: "",
  },
  {
    n: 2,
    label: "Grants and other assistance to domestic individuals",
    a: "1,319,379", b: "1,319,379", c: "", d: "",
  },
  {
    n: 3,
    label: "Grants and other assistance to foreign organizations, foreign governments, and foreign individuals",
    a: "", b: "", c: "", d: "",
  },
  {
    n: 4,
    label: "Benefits paid to or for members",
    a: "", b: "", c: "", d: "",
  },
];

// Row heights (px) — used to position the SVG lines precisely
const ROW5_H = 82;
const ROW6_H = 148;
const ROW7_H = 51;
const ROWS57_TOTAL = ROW5_H + ROW6_H + ROW7_H; // 281

// Box geometry (absolute within rows-5-7 container)
const BOX_W = 340;
const BOX_H = 110;
const BOX_RIGHT = 20;
const BOX_LEFT = 1080 - BOX_RIGHT - BOX_W; // 720
const BOX_TOP = (ROWS57_TOTAL - BOX_H) / 2; // 85
const BOX_CY = BOX_TOP + BOX_H / 2; // 140

// Arrow start: right edge of (A) Total column = 38+18 = 56% of 1080 = 605px
const ARROW_X = 600;
const ROW5_CY = ROW5_H / 2; // 41
const ROW7_CY = ROW5_H + ROW6_H + ROW7_H / 2; // 255

// Column widths (%)
const CW = [38, 18, 15, 16, 13];

const Cell: React.FC<{
  children?: React.ReactNode;
  w: number;
  right?: boolean;
  header?: boolean;
  bold?: boolean;
}> = ({ children, w, right, header, bold }) => (
  <div
    style={{
      width: `${w}%`,
      padding: "10px 10px",
      fontSize: header ? 20 : 23,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontWeight: bold || header ? 700 : 400,
      color: header ? "#fff" : right ? "#1a56cc" : "#111",
      textAlign: right ? "right" : "left",
      lineHeight: 1.35,
      flexShrink: 0,
      boxSizing: "border-box",
    }}
  >
    {children}
  </div>
);

const TableRow: React.FC<{
  n: number;
  label: string;
  a: string; b: string; c: string; d: string;
  highlight?: boolean;
  even?: boolean;
}> = ({ n, label, a, b, c, d, highlight, even }) => (
  <div
    style={{
      display: "flex",
      alignItems: "stretch",
      borderBottom: "1px solid #ddd",
      background: highlight ? "#ffff88" : even ? "#fafafa" : "white",
      outline: highlight ? "2.5px solid #e03030" : "none",
      outlineOffset: "-2px",
    }}
  >
    <div
      style={{
        width: `${CW[0]}%`,
        padding: "10px 8px",
        fontSize: 22,
        lineHeight: 1.4,
        color: "#111",
        display: "flex",
        gap: 6,
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontWeight: 700, flexShrink: 0 }}>{n}</span>
      <span>{label}</span>
    </div>
    <Cell w={CW[1]} right bold={highlight}>{a}</Cell>
    <Cell w={CW[2]} right>{b}</Cell>
    <Cell w={CW[3]} right>{c}</Cell>
    <Cell w={CW[4]} right>{d}</Cell>
  </div>
);

export const SalaryExpenses: React.FC = () => {
  return (
    <div
      style={{
        background: "#f5f5f0",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* ── Header bar ── */}
      <div
        style={{
          background: "#1a1a2e",
          padding: "28px 40px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <span style={{ color: "white", fontSize: 28, fontWeight: 700 }}>Nonprofit Explorer</span>
        <span style={{ color: "#aaa", fontSize: 24 }}>›</span>
        <span style={{ color: "#ccc", fontSize: 24 }}>New York</span>
        <span style={{ color: "#aaa", fontSize: 24 }}>›</span>
        <span style={{ color: "white", fontSize: 22, fontWeight: 700, border: "2px solid #e03030", padding: "2px 10px", borderRadius: 4 }}>
          The Child Center Of Ny Inc
        </span>
      </div>

      {/* ── Part IX title ── */}
      <div style={{ background: "white", padding: "20px 40px 16px", borderBottom: "2px solid #222", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "#111", color: "white", fontWeight: 700, fontSize: 24, padding: "5px 12px" }}>
            Part IX
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>
            Statement of Functional Expenses
          </span>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 21, color: "#444", lineHeight: 1.4 }}>
          Section 501(c)(3) and 501(c)(4) organizations must complete all columns.
        </p>
      </div>

      {/* ── Table ── */}
      <div style={{ background: "white", flexShrink: 0 }}>
        {/* Column headers */}
        <div style={{ display: "flex", background: "#2c2c2c", borderBottom: "1px solid #444" }}>
          <Cell w={CW[0]} header>Description</Cell>
          <Cell w={CW[1]} header right>(A){"\n"}Total expenses</Cell>
          <Cell w={CW[2]} header right>(B){"\n"}Program service expenses</Cell>
          <Cell w={CW[3]} header right>(C){"\n"}Management and general expenses</Cell>
          <Cell w={CW[4]} header right>(D){"\n"}Fundraising expenses</Cell>
        </div>

        {/* Rows 1–4 */}
        {rowsTop.map((row) => (
          <TableRow key={row.n} {...row} even={row.n % 2 === 0} />
        ))}

        {/* ── Rows 5–7 with black-box annotation overlay ── */}
        <div style={{ position: "relative" }}>
          <TableRow n={5}
            label="Compensation of current officers, directors, trustees, and key employees"
            a="1,127,302" b="" c="1,127,302" d=""
            highlight
          />
          <TableRow n={6}
            label="Compensation not included above, to disqualified persons (as defined under section 4958(f)(1)) and persons described in section 4958(c)(3)(B)"
            a="" b="" c="" d=""
            even
          />
          <TableRow n={7}
            label="Other salaries and wages"
            a="55,124,976" b="48,380,894" c="6,340,004" d="404,078"
            highlight
          />

          {/* SVG lines */}
          <svg
            style={{ position: "absolute", top: 0, left: 0, overflow: "visible", pointerEvents: "none" }}
            width={1080}
            height={ROWS57_TOTAL}
          >
            <defs>
              <marker id="arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#e03030" />
              </marker>
            </defs>
            {/* Arrow from row 5 */}
            <line
              x1={ARROW_X} y1={ROW5_CY}
              x2={BOX_LEFT + 4} y2={BOX_CY - BOX_H / 2 + 14}
              stroke="#e03030" strokeWidth={5}
              markerEnd="url(#arr)"
            />
            {/* Arrow from row 7 */}
            <line
              x1={ARROW_X} y1={ROW7_CY}
              x2={BOX_LEFT + 4} y2={BOX_CY + BOX_H / 2 - 14}
              stroke="#e03030" strokeWidth={5}
              markerEnd="url(#arr)"
            />
          </svg>

          {/* Black box */}
          <div
            style={{
              position: "absolute",
              right: BOX_RIGHT,
              top: BOX_TOP,
              width: BOX_W,
              height: BOX_H,
              background: "#111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: 52, fontWeight: 900, letterSpacing: "-1px", whiteSpace: "nowrap" }}>
              $56,252,278
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
