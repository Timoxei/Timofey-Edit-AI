import { Img, staticFile } from "remotion";

export const TOTAL_FRAMES = 1;

const BAR_HEIGHT = 140;

export const Thumbnail2: React.FC = () => {
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
      {/* RIGHT HALF: Sam Lee confrontation scene */}
      <div
        style={{
          position: "absolute",
          top: BAR_HEIGHT,
          left: 640,
          width: 640,
          height: 720 - BAR_HEIGHT,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("thumbnail2_bg.jpg")}
          style={{
            width: "200%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "75% 20%",
            marginLeft: "-100%",
          }}
        />
      </div>

      {/* LEFT HALF: Nate facing camera — cropped to his face, no watermark */}
      <div
        style={{
          position: "absolute",
          top: BAR_HEIGHT,
          left: 0,
          width: 640,
          height: 720 - BAR_HEIGHT,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("nate_front.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "8% 20%",
          }}
        />
      </div>

      {/* Gradient blend between the two halves */}
      <div
        style={{
          position: "absolute",
          top: BAR_HEIGHT,
          left: 560,
          width: 160,
          height: 720 - BAR_HEIGHT,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 50%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
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
          INTERVIEW
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
          BLOCKED
        </span>
      </div>
    </div>
  );
};
