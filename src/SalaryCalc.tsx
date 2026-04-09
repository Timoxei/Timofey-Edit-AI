import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const TOTAL_FRAMES = 180;

const STEP_DURATION = 35;

const steps = [
  { label: "$56,252,278", result: false },
  { label: "÷ 1,823",     result: false },
  { label: "≈ $30,900",   result: true  },
];

export const SalaryCalc: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        background: "#0a0a0a",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        gap: 48,
      }}
    >
      {steps.map((step, i) => {
        const progress = spring({
          frame: frame - i * STEP_DURATION,
          fps,
          config: { damping: 18, stiffness: 120, mass: 0.6 },
        });

        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateY = interpolate(progress, [0, 1], [40, 0]);

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              textAlign: "center",
              color: step.result ? "#00ff44" : "#00cc33",
              fontSize: step.result ? 144 : 96,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: step.result ? "-3px" : "-1px",
            }}
          >
            {step.label}
          </div>
        );
      })}
    </div>
  );
};
