export const TOTAL_FRAMES = 1;

export const TraciPay: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, Helvetica, sans-serif",
        boxSizing: "border-box",
        overflow: "hidden",
        background: "#f5f5f0",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: "#1a1a2e",
          padding: "44px 60px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 44,
            fontWeight: 900,
            fontFamily: "Georgia, serif",
          }}
        >
          Nonprofit Explorer
        </span>
        <span style={{ color: "#aaa", fontSize: 38 }}>›</span>
        <span style={{ color: "#ccc", fontSize: 38 }}>New York</span>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          background: "white",
          margin: "20px 0",
          padding: "60px 60px 80px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Section title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#111",
            marginBottom: 48,
            paddingBottom: 32,
            borderBottom: "2px solid #ddd",
          }}
        >
          Compensation
        </div>

        {/* Name */}
        <div style={{ marginBottom: 60 }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#666",
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Key Employee
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#111",
              lineHeight: 1.3,
            }}
          >
            <span style={{ backgroundColor: "#ffff00", padding: "4px 8px" }}>
              Traci A Donnelly
            </span>
          </div>
          <div
            style={{
              fontSize: 38,
              color: "#555",
              marginTop: 12,
            }}
          >
            Chief Executive Officer
          </div>
        </div>

        {/* Compensation */}
        <div
          style={{
            marginBottom: 48,
            padding: "40px 48px",
            background: "#fafafa",
            borderRadius: 8,
            borderLeft: "6px solid #1a1a2e",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#666",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Compensation
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#111",
            }}
          >
            <span style={{ backgroundColor: "#ffff00", padding: "2px 12px" }}>
              $568,130
            </span>
          </div>
        </div>

        {/* Related */}
        <div
          style={{
            marginBottom: 48,
            padding: "40px 48px",
            background: "#fafafa",
            borderRadius: 8,
            borderLeft: "6px solid #ccc",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#666",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Related
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#111",
            }}
          >
            $0
          </div>
        </div>

        {/* Other */}
        <div
          style={{
            padding: "40px 48px",
            background: "#fafafa",
            borderRadius: 8,
            borderLeft: "6px solid #e03030",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#666",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Other
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "#111",
            }}
          >
            <span style={{ backgroundColor: "#ffff00", padding: "2px 12px" }}>
              $35,510
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
