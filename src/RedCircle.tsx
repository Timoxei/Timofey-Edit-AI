import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const TOTAL_FRAMES = 60;

export const RedCircle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 200, mass: 1 },
    durationInFrames: 40,
  });

  const strokeDasharray = 2 * Math.PI * 120; // circumference for r=120
  const strokeDashoffset = interpolate(progress, [0, 1], [strokeDasharray, 0]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111",
      }}
    >
      <svg width="300" height="300" viewBox="0 0 300 300">
        <circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke="#e02020"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 150 150)"
        />
      </svg>
    </div>
  );
};
