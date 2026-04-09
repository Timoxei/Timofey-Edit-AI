import { Img, staticFile } from "remotion";

export const TOTAL_FRAMES = 1;

export const Thumbnail: React.FC = () => {
  const BAR_HEIGHT = 140;

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Impact, Arial Black, sans-serif",
        backgroundColor: "#000",
      }}
    >
      {/* Photo — fills area below the black bar */}
      <Img
        src={staticFile("thumbnail_bg.jpg")}
        style={{
          position: "absolute",
          top: BAR_HEIGHT,
          left: 0,
          width: 1280,
          height: 720 - BAR_HEIGHT,
          objectFit: "cover",
          objectPosition: "center 20%",
        }}
      />

      {/* Black bar at the top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: BAR_HEIGHT,
          backgroundColor: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <span
          style={{
            color: "#1a6cff",
            fontSize: 110,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: 4,
            lineHeight: 1,
          }}
        >
          MAOIST
        </span>
        <span
          style={{
            color: "#d40000",
            fontSize: 110,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: 4,
            lineHeight: 1,
          }}
        >
          EXPOSED
        </span>
      </div>
    </div>
  );
};
