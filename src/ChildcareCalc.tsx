import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const TOTAL_FRAMES = 180;

const steps = [
  { label: "$12,400,000", sub: "total taxpayer dollars" },
  { label: "÷ 5 years  =  $2,480,000 / yr", sub: "" },
  { label: "÷ 52 weeks  =  $47,692 / wk", sub: "" },
  { label: "÷ 5 days  =  $9,538 / day", sub: "" },
  { label: "÷ 15 children", sub: "" },
  { label: "$636", sub: "per child · per day" },
];

const STEP_DURATION = 25; // frames each step stays visible before next appears

export const ChildcareCalc: React.FC = () => {
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
        fontFamily: "'Arial', sans-serif",
        gap: 28,
        padding: "0 80px",
      }}
    >
      {steps.map((step, i) => {
        const startFrame = i * STEP_DURATION;
        const progress = spring({
          frame: frame - startFrame,
          fps,
          config: { damping: 18, stiffness: 120, mass: 0.6 },
        });

        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateY = interpolate(progress, [0, 1], [30, 0]);
        const isResult = i === steps.length - 1;

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: isResult ? "#00ff44" : "#00cc33",
                fontSize: isResult ? 96 : 42,
                fontWeight: "bold",
                lineHeight: 1.1,
                letterSpacing: isResult ? "-2px" : "0px",
              }}
            >
              {step.label}
            </div>
            {step.sub && (
              <div
                style={{
                  color: "#aaaaaa",
                  fontSize: isResult ? 32 : 22,
                  marginTop: 6,
                  fontWeight: "normal",
                }}
              >
                {step.sub}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
