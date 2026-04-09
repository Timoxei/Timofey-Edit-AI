import { useCurrentFrame, useVideoConfig } from "remotion";

const TEXT = "Ibtihal Malley";

export const TOTAL_FRAMES = 120;

export const TypingText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const charsPerSecond = 20;
  const charsToShow = Math.min(
    Math.floor((frame / fps) * charsPerSecond),
    TEXT.length
  );


  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <span
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 72,
          fontWeight: "bold",
          color: "#ffffff",
          textShadow: "2px 2px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000",
          letterSpacing: 2,
          whiteSpace: "nowrap",
        }}
      >
        {TEXT.slice(0, charsToShow)}
      </span>
    </div>
  );
};
