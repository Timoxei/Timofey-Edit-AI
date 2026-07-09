import { Img, staticFile } from "remotion";

export const TOTAL_FRAMES = 1;

// Vertical (1080x1920) rebuild of the Dar Al-Hijrah / Mohammed Al-Hanooti card.
// Keeps the photo, caption and highlighted linked text. No watermarks.

const HL: React.CSSProperties = {
  backgroundColor: "#ffff00",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
};

const LINK: React.CSSProperties = {
  ...HL,
  color: "#1a56c4",
  textDecoration: "underline",
  textUnderlineOffset: "4px",
};

const IMG_W = 968;
const IMG_H = Math.round((IMG_W * 552) / 1003);

export const HanootiDarAlHijrah: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#ffffff",
        padding: "0 56px",
        fontFamily: '-apple-system, "Segoe UI", Arial, sans-serif',
      }}
    >
      <Img
        src={staticFile("hanooti_photo.png")}
        style={{ width: IMG_W, height: IMG_H, objectFit: "cover", display: "block" }}
      />

      {/* Caption */}
      <div
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 44,
          color: "#1a1a1a",
          margin: "44px 0 52px",
          textAlign: "center",
        }}
      >
        Dar Al-Hijrah Islamic Center
      </div>

      {/* Body text */}
      <p
        style={{
          margin: 0,
          fontSize: 52,
          lineHeight: 1.7,
          color: "#1a1a1a",
          fontWeight: 400,
          alignSelf: "stretch",
        }}
      >
        <span style={LINK}>Mohammed Al-Hanooti</span>, who officiated Mills&rsquo;
        wedding in 2014, is perhaps{" "}
        <span style={HL}>
          best known for being an unindicted co-conspirator in both the{" "}
        </span>
        <span style={LINK}>2008 Holy Land Foundation Hamas financing trial</span>
        <span style={HL}> and the </span>
        <span style={LINK}>1993 World Trade Center bombing plot</span>.
      </p>
    </div>
  );
};
