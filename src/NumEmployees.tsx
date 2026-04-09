export const TOTAL_FRAMES = 1;

export const NumEmployees: React.FC = () => {
  return (
    <div
      style={{
        background: "white",
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
          padding: "36px 50px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexShrink: 0,
          flexWrap: "nowrap",
        }}
      >
        <span style={{ color: "white", fontSize: 34, fontWeight: 700, whiteSpace: "nowrap" }}>
          Nonprofit Explorer
        </span>
        <span style={{ color: "#aaa", fontSize: 30 }}>›</span>
        <span style={{ color: "#ccc", fontSize: 30, whiteSpace: "nowrap" }}>New York</span>
        <span style={{ color: "#aaa", fontSize: 30 }}>›</span>
        <span
          style={{
            color: "#999",
            fontSize: 28,
            border: "2.5px solid #e03030",
            padding: "4px 14px",
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          The Child Center Of Ny Inc
        </span>
      </div>

      {/* ── Form 990 tag + Page ── */}
      <div
        style={{
          background: "#f9f9f7",
          padding: "32px 50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #ccc",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            border: "2px solid #e03030",
            padding: "8px 22px",
            fontSize: 36,
            fontWeight: 600,
            color: "#111",
          }}
        >
          Form 990 (2023)
        </div>
        <div style={{ fontSize: 36, color: "#111" }}>
          Page <strong>5</strong>
        </div>
      </div>

      {/* ── Part V title ── */}
      <div style={{ borderBottom: "2px solid #222", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <div
            style={{
              background: "#111",
              color: "white",
              fontWeight: 700,
              fontSize: 36,
              padding: "18px 26px",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            Part V
          </div>
          <div
            style={{
              padding: "18px 24px",
              fontSize: 34,
              fontWeight: 700,
              color: "#111",
              lineHeight: 1.4,
            }}
          >
            Statements Regarding Other IRS Filings and Tax Compliance{" "}
            <em style={{ fontWeight: 400 }}>(continued)</em>
          </div>
        </div>
      </div>

      {/* ── Row 2a ── */}
      <div
        style={{
          padding: "70px 50px 80px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Label */}
        <div style={{ fontSize: 46, color: "#111", lineHeight: 1.65 }}>
          <span style={{ fontWeight: 700, marginRight: 14 }}>2a</span>
          <span style={{ backgroundColor: "#ffff00" }}>
            Enter the number of employees
          </span>
          {" "}reported on Form W-3, Transmittal of Wage and Tax Statements,
          filed for the calendar year ending with or within the year covered by
          this return.
        </div>

        {/* Divider + answer at bottom */}
        <div style={{ marginTop: "auto" }}>
          <div style={{ height: 1, background: "#e0e0e0", marginBottom: 60 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <span style={{ fontSize: 38, color: "#555", fontWeight: 600 }}>2a</span>
            <div
              style={{
                background: "#ffff00",
                padding: "14px 40px",
                fontSize: 52,
                fontWeight: 700,
                color: "#111",
                lineHeight: 1,
              }}
            >
              1,823
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
