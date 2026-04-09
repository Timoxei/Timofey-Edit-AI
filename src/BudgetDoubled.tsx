import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const TOTAL_FRAMES = 60; // 2 seconds at 30fps

export const BudgetDoubled: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const left = spring({ frame, fps, config: { damping: 20, stiffness: 150 } });
  const right = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 150 } });
  const arrow = spring({ frame: frame - 35, fps, config: { damping: 20, stiffness: 150 } });

  return (
    <div style={{
      background: "transparent",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
      gap: 40,
    }}>
      {/* 2017–2021 */}
      <div style={{
        opacity: interpolate(left, [0, 1], [0, 1]),
        transform: `scale(${interpolate(left, [0, 1], [0.5, 1])})`,
        textAlign: "center",
      }}>
        <div style={{ color: "#00cc33", fontSize: 52, fontWeight: "bold" }}>$5.5M</div>
        <div style={{ color: "#888", fontSize: 18, marginTop: 4 }}>2017 – 2021</div>
      </div>

      {/* Arrow */}
      <div style={{
        opacity: interpolate(arrow, [0, 1], [0, 1]),
        color: "#00ff44",
        fontSize: 48,
        fontWeight: "bold",
      }}>→ ×2</div>

      {/* 2021–2026 */}
      <div style={{
        opacity: interpolate(right, [0, 1], [0, 1]),
        transform: `scale(${interpolate(right, [0, 1], [0.5, 1])})`,
        textAlign: "center",
      }}>
        <div style={{ color: "#00ff44", fontSize: 52, fontWeight: "bold" }}>$12.4M</div>
        <div style={{ color: "#888", fontSize: 18, marginTop: 4 }}>2021 – 2026</div>
      </div>
    </div>
  );
};
