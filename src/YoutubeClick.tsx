import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";

// 3 s @ 30 fps
export const TOTAL_FRAMES = 90;

const W = 334;
const H = 112;

// Cursor starts off-canvas (bottom-right) and moves to the click target.
const START_X = W + 30;
const START_Y = H + 30;
const TARGET_X = 195; // center of the "YouTube" wordmark
const TARGET_Y = 60;

// Timeline
const MOVE_END = 30;    // 1.0 s — cursor arrives at logo
const SETTLE_END = 40;  // 1.33 s — brief hover before press
const PRESS_END = 47;   // 1.57 s — bottom of press
const RELEASE_END = 56; // 1.87 s — cursor released, ring pulse starts

export const YoutubeClick: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Move-in: ease-out spring from offscreen to target
  const moveProgress = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.6 },
    durationInFrames: MOVE_END,
  });
  const cursorX = interpolate(moveProgress, [0, 1], [START_X, TARGET_X]);
  const cursorY = interpolate(moveProgress, [0, 1], [START_Y, TARGET_Y]);

  // Press scale: quick dip then release
  const pressDown = interpolate(
    frame,
    [SETTLE_END, PRESS_END],
    [1, 0.82],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const pressUp = interpolate(
    frame,
    [PRESS_END, RELEASE_END],
    [0.82, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const cursorScale = frame < PRESS_END ? pressDown : pressUp;

  // Logo gets a quick darken on press (mimics click feedback)
  const logoDim = interpolate(
    frame,
    [SETTLE_END, PRESS_END, RELEASE_END],
    [1, 0.75, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Click ripple: expands & fades after release
  const rippleProgress = interpolate(
    frame,
    [PRESS_END, PRESS_END + 22],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const rippleSize = interpolate(rippleProgress, [0, 1], [10, 90]);
  const rippleOpacity = interpolate(rippleProgress, [0, 1], [0.55, 0]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#0f0f0f",
        overflow: "hidden",
      }}
    >
      {/* YouTube logo screenshot */}
      <Img
        src={staticFile("youtube_kz_logo.png")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: H,
          filter: `brightness(${logoDim})`,
        }}
      />

      {/* Click ripple */}
      <div
        style={{
          position: "absolute",
          left: TARGET_X - rippleSize / 2,
          top: TARGET_Y - rippleSize / 2,
          width: rippleSize,
          height: rippleSize,
          borderRadius: "50%",
          border: "2px solid #ffffff",
          opacity: rippleOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Cursor (Windows-style pointer) */}
      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          transform: `scale(${cursorScale})`,
          transformOrigin: "0 0",
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.55))",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24">
          <path
            d="M3 2 L3 19 L7.5 15 L10.5 22 L13 21 L10 14 L16 14 Z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
