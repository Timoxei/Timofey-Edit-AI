import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const TOTAL_FRAMES = 90;

export const SalaryArrow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const arrowProgress = spring({ frame, fps, config: { damping: 80, stiffness: 150 }, durationInFrames: 40 });
  const textOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" });

  const stemHeight = interpolate(arrowProgress, [0, 1], [0, 90]);

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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {/* Salary text */}
        <span
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 80,
            fontWeight: "bold",
            color: "#22c55e",
            opacity: textOpacity,
            WebkitTextStroke: "3px white",
            textShadow: "3px 3px 8px rgba(0,0,0,0.7)",
            letterSpacing: 1,
          }}
        >
          $71,315
        </span>

        {/* Arrow */}
        <svg width="60" height="120" viewBox="0 0 60 120" style={{ overflow: "visible" }}>
          <defs>
            <filter id="arrowShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="3" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.7)" />
            </filter>
          </defs>
          <g filter="url(#arrowShadow)">
            {/* Stem */}
            <rect x="22" y="0" width="16" height={stemHeight} fill="#e02020" />
            {/* Arrowhead always attached to stem bottom */}
            <polygon
              points={`0,${stemHeight} 30,${stemHeight + 30} 60,${stemHeight}`}
              fill="#e02020"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
