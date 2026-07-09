import { Img, staticFile } from "remotion";

export const TOTAL_FRAMES = 1;

// Vertical (1080x1920) rebuild of the Al Jazeera header + Haniyeh headline.
// All source content preserved.

const SANS = '"Helvetica Neue", Arial, sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';

const HL: React.CSSProperties = {
  backgroundColor: "#ffff00",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
};

const NAV = ["News ⌄", "World Cup", "Middle East", "Explained", "Opinion", "Video"];

const TICKER = [
  "Shackled, bleeding, raped: Abuse in Israeli prisons",
  "‘This is an apartheid regime’",
];

export const AljazeeraHaniyeh: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        padding: "70px 56px 80px",
      }}
    >
      {/* ── Masthead ── */}
      <Img
        src={staticFile("aljazeera_logo.png")}
        style={{ width: 470, height: 121, objectFit: "contain" }}
      />

      {/* Nav */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "18px 40px",
          marginTop: 38,
          fontFamily: SANS,
          fontSize: 40,
          fontWeight: 500,
          color: "#141414",
        }}
      >
        {NAV.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>

      {/* Green accent + divider */}
      <div style={{ display: "flex", alignItems: "center", margin: "34px 0 30px" }}>
        <div style={{ width: 26, height: 5, background: "#26a69a" }} />
        <div style={{ flex: 1, height: 2, background: "#e2e2e2" }} />
      </div>

      {/* Ticker row */}
      <div
        style={{
          fontFamily: SANS,
          fontSize: 30,
          lineHeight: 1.5,
          color: "#1a1a1a",
        }}
      >
        <span style={{ fontWeight: 700 }}>Israel-Palestine conflict</span>
        {TICKER.map((t) => (
          <span key={t}>
            <span style={{ color: "#cfcfcf", margin: "0 22px" }}>|</span>
            {t}
          </span>
        ))}
      </div>

      {/* ── Focal content ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ marginBottom: 44 }}>
          <span
            style={{
              ...HL,
              fontFamily: SANS,
              fontSize: 40,
              color: "#555",
              padding: "4px 6px",
            }}
          >
            31 Jul 2024
          </span>
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontSize: 74,
            lineHeight: 1.45,
            color: "#0f0f0f",
          }}
        >
          <span style={HL}>Hamas political leader Ismail Haniyeh </span>
          <span
            style={{
              ...HL,
              color: "#1a56c4",
              textDecoration: "underline",
              textUnderlineOffset: "6px",
            }}
          >
            has been killed
          </span>
          <span style={HL}> in Iran&rsquo;s capital Tehran.</span>
        </p>
      </div>
    </div>
  );
};
