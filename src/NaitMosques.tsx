import { Img, staticFile } from "remotion";

export const TOTAL_FRAMES = 1;

// Rebuilt vertical (1080x1920) version of the InfluenceWatch CAIR/NAIT
// screenshot. All source text, links, yellow highlights and red boxes preserved.

const HL: React.CSSProperties = {
  backgroundColor: "#ffff00",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
};

const BOX: React.CSSProperties = {
  ...HL,
  outline: "4px solid #e8332e",
  outlineOffset: "2px",
  borderRadius: 2,
};

const LINK: React.CSSProperties = {
  color: "#1157b8",
  textDecoration: "underline",
  textUnderlineOffset: "5px",
};

const Sup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <sup style={{ fontSize: "0.55em", verticalAlign: "super", fontWeight: 400 }}>
    {children}
  </sup>
);

export const NaitMosques: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        fontFamily: '-apple-system, "Segoe UI", Arial, sans-serif',
      }}
    >
      {/* ── Dark header bar with red underline ── */}
      <div
        style={{
          background: "#2f2f2e",
          borderBottom: "4px solid #b11a17",
          padding: "34px 46px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Img src={staticFile("iw_logo.png")} style={{ width: 92, height: 92 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: "#fff", fontSize: 40, fontWeight: 700 }}>
              Search
            </span>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="10.5" cy="10.5" r="7" stroke="#fff" strokeWidth="2.4" />
              <line
                x1="15.8"
                y1="15.8"
                x2="21"
                y2="21"
                stroke="#fff"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: "#fff", fontSize: 40, fontWeight: 700 }}>
              Menu
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{ width: 40, height: 4, background: "#fff", borderRadius: 2 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body text ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 70px",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#111",
            fontSize: 66,
            lineHeight: 2.0,
            fontWeight: 400,
          }}
        >
          at least 42 states.<Sup> 1</Sup> According to a report from the{" "}
          <span style={LINK}>Council on American Islamic Relations</span> (CAIR),{" "}
          <span style={BOX}>NAIT holds</span>
          <span style={HL}> the title to more than </span>
          <span style={BOX}>300 mosques,</span>
          <span style={HL}> or approximately </span>
          <span style={BOX}>27</span>
          <span style={HL}> percent of the estimated 1,200 mosques in the United States.</span>
          <Sup> 2 3</Sup>
        </p>
      </div>
    </div>
  );
};
