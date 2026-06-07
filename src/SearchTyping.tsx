import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const TEXT = "people's conference for palestine 2025";

// 5.5 s @ 30 fps
export const TOTAL_FRAMES = 165;

const TYPING_START_FRAME = 6;      // ~0.2 s pause before typing
const TYPING_END_FRAME = 141;       // ~4.7 s — finishes typing, then ~0.8 s hold

export const SearchTyping: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Character count (typed naturally over TYPING_START → TYPING_END)
  const typedRaw = interpolate(
    frame,
    [TYPING_START_FRAME, TYPING_END_FRAME],
    [0, TEXT.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const typed = Math.floor(typedRaw);
  const visibleText = TEXT.slice(0, typed);

  // Cursor: solid while typing, blinks when idle
  const isTyping = frame > TYPING_START_FRAME && frame < TYPING_END_FRAME;
  const blinkPhase = Math.floor((frame / fps) * 2) % 2; // 2 Hz blink
  const cursorVisible = isTyping ? true : blinkPhase === 0;

  // X (clear) button fades in once text appears
  const clearOpacity = interpolate(typed, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f0f0f",
        fontFamily: "Roboto, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          width: 880,
          height: 86,
          borderRadius: 43,
          border: "1px solid #303030",
          overflow: "hidden",
          backgroundColor: "#121212",
        }}
      >
        {/* Text input area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            paddingLeft: 28,
            paddingRight: 12,
            color: "#ffffff",
            fontSize: 32,
            fontWeight: 400,
            letterSpacing: 0.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <span>{visibleText}</span>
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 36,
              backgroundColor: "#ffffff",
              marginLeft: 1,
              opacity: cursorVisible ? 1 : 0,
            }}
          />
        </div>

        {/* X (clear) button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            opacity: clearOpacity,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6 L18 18 M18 6 L6 18"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Search button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            backgroundColor: "#222222",
            borderLeft: "1px solid #303030",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#ffffff" strokeWidth="2" />
            <path
              d="M16.5 16.5 L21 21"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
