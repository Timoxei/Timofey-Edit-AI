import { Img, staticFile } from "remotion";

export const TOTAL_FRAMES = 1;

export const PropublicaRevenue: React.FC = () => {
  return (
    <div
      style={{
        background: "#f5f5f0",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Georgia, 'Times New Roman', serif",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* ── Dark header bar ── */}
      <div
        style={{
          background: "#1a1a2e",
          padding: "36px 60px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "white",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          Nonprofit Explorer
        </span>
        <span style={{ color: "#aaa", fontSize: 28 }}>›</span>
        <span
          style={{
            color: "#ccc",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 30,
          }}
        >
          New York
        </span>
      </div>

      {/* ── Title section ── */}
      <div
        style={{
          background: "white",
          padding: "52px 60px 44px",
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            margin: "0 0 20px",
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1.1,
            color: "#111",
            fontFamily: "Georgia, serif",
          }}
        >
          The Child Center Of Ny Inc
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 34,
            color: "#333",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.5,
          }}
        >
          Forest Hills, NY&nbsp;&nbsp;•&nbsp;&nbsp;Tax-exempt since March
          1961&nbsp;&nbsp;•&nbsp;&nbsp;EIN: 11-1733454
        </p>
      </div>

      {/* ── Revenue chart ── */}
      <div
        style={{
          background: "white",
          margin: "16px 0",
          padding: "0",
          flexShrink: 0,
        }}
      >
        <Img
          src={staticFile("propublica_chart.png")}
          style={{ width: "100%", display: "block" }}
        />
      </div>

      {/* ── Nonprofit type section ── */}
      <div
        style={{
          background: "white",
          padding: "48px 60px 56px",
          flex: 1,
        }}
      >
        <h2
          style={{
            margin: "0 0 24px",
            fontSize: 44,
            fontWeight: 700,
            color: "#111",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Type of Nonprofit
        </h2>

        <p
          style={{
            margin: "0 0 16px",
            fontSize: 38,
            fontWeight: 700,
            color: "#111",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Designated as a 501(c)(3)
        </p>

        <p
          style={{
            margin: "0 0 36px",
            fontSize: 34,
            color: "#555",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.6,
          }}
        >
          Organizations for religious, educational, charitable, scientific,
          literary, or public safety purposes, or the prevention of cruelty to
          children or animals.
        </p>

        <p
          style={{
            margin: 0,
            fontSize: 38,
            fontWeight: 700,
            color: "#111",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Donations to this organization are tax deductible.
        </p>
      </div>
    </div>
  );
};
