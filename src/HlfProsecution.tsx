import { Img, staticFile } from "remotion";

export const TOTAL_FRAMES = 1;

// Vertical (1080x1920) rebuild of the GW Program on Extremism / HLF card.
// All source content preserved EXCEPT the "The Nate Friedman Show" watermark.

const NAVY = "#16233f";
const RED = "#7c1522";
const GRAY = "#6f6f6f";
const CREAM = "#faf7ee";
const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = '"Helvetica Neue", Arial, sans-serif';

const HL: React.CSSProperties = {
  backgroundColor: "#ffff00",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
  fontWeight: 700,
  padding: "2px 4px",
};

export const HlfProsecution: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: CREAM,
        padding: "72px 68px 60px",
      }}
    >
      {/* ── Masthead ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <Img src={staticFile("gw_logo.png")} style={{ width: 150, height: 103 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontFamily: SANS, fontSize: 46, fontWeight: 700, color: NAVY }}>
            Program on Extremism
          </span>
          <span style={{ fontFamily: SANS, fontSize: 30, color: GRAY }}>
            The George Washington University · extremism.gwu.edu
          </span>
        </div>
      </div>

      <div style={{ height: 4, background: NAVY, margin: "34px 0 44px" }} />

      {/* ── Kicker ── */}
      <span
        style={{
          fontFamily: SANS,
          fontSize: 33,
          fontWeight: 800,
          color: RED,
          letterSpacing: 3,
        }}
      >
        HOLY LAND FOUNDATION&nbsp;&nbsp;•&nbsp;&nbsp;HAMAS FINANCING PROSECUTION
      </span>

      {/* ── Headline ── */}
      <h1
        style={{
          fontFamily: SERIF,
          fontSize: 82,
          fontWeight: 700,
          color: NAVY,
          lineHeight: 1.12,
          margin: "28px 0 0",
        }}
      >
        The largest successful terrorism-financing prosecution in U.S. history.
      </h1>

      {/* ── Body ── */}
      <p
        style={{
          fontFamily: SERIF,
          fontSize: 56,
          lineHeight: 1.55,
          color: "#1d1d1d",
          margin: "56px 0 0",
        }}
      >
        The 2001 designation of HLF and subsequent prosecution of part of its
        leadership for funneling approximately $12.4 million to Hamas
        constitutes to date the{" "}
        <span style={HL}>
          largest successful terrorism financing prosecution in US history.
        </span>
      </p>

      {/* ── Footer ── */}
      <div style={{ marginTop: "auto" }}>
        <div style={{ height: 1, background: "#d8d2c2", margin: "0 0 34px" }} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40 }}>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 32,
              lineHeight: 1.5,
              color: "#3a3a3a",
              margin: 0,
              flex: 1,
            }}
          >
            <b>Source:</b> Lorenzo Vidino,{" "}
            <i>The Hamas Networks in America: A Short History</i> — GW Program
            on Extremism, October 2023.&nbsp;&nbsp;Holy Land Foundation: 2001
            Treasury designation → 2008 federal convictions (Dallas), sentences
            up to 65 yrs.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <span style={{ fontFamily: SANS, fontSize: 36, fontWeight: 800, color: NAVY, letterSpacing: 4 }}>
              PROOF
            </span>
            <span style={{ fontFamily: SANS, fontSize: 24, color: GRAY, letterSpacing: 2 }}>
              HLF · HAMAS · $12.4M
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
