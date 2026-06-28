import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const TOTAL_FRAMES = 120; // 4 seconds @ 30fps

const WIDTH = 1920;
const HEIGHT = 1080;

// Figure positions (silhouettes of mysterious imams across the top)
const FIGURES = [
  { x: 420, y: 360 },
  { x: 960, y: 320 },
  { x: 1500, y: 360 },
];

// Hamas sign center (the flag plaque sits centered around this)
const SIGN_CX = 960;
const SIGN_CY = 760;
const SIGN_W = 540;
const SIGN_H = 260;
const SIGN_TOP_Y = SIGN_CY - SIGN_H / 2;

// Timeline
const SIGN_IN = 0;
const FIGURES_IN = 14;
const HIGHLIGHT_PULSE = 30;
const ARROW_START = 46;
const ARROW_STAGGER = 6;

// Path from a figure's feet to top of the sign — gentle curve
const arrowPath = (fx: number, fy: number) => {
  const sx = fx;
  const sy = fy + 110; // start just below figure
  const ex = SIGN_CX + (fx - SIGN_CX) * 0.18; // land slightly toward source side
  const ey = SIGN_TOP_Y - 8;
  const cx = (sx + ex) / 2;
  const cy = Math.min(sy, ey) - 80; // arc upward
  return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
};

const pathLength = (fx: number, fy: number) => {
  const sx = fx;
  const sy = fy + 110;
  const ex = SIGN_CX + (fx - SIGN_CX) * 0.18;
  const ey = SIGN_TOP_Y - 8;
  const d = Math.hypot(ex - sx, ey - sy);
  return d * 1.08;
};

export const ThreeImamsHamas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sign entrance
  const signIn = spring({ frame: frame - SIGN_IN, fps, config: { damping: 200 } });
  const signY = interpolate(signIn, [0, 1], [40, 0]);
  const signScale = interpolate(signIn, [0, 1], [0.92, 1]);

  // Background vignette pulse (red warning glow under sign)
  const vignettePulse = 0.5 + 0.5 * Math.sin((frame / 30) * Math.PI);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at center, #0a0a0f 0%, #000000 75%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* Red warning pulse behind sign */}
      <div
        style={{
          position: "absolute",
          left: SIGN_CX - 520,
          top: SIGN_CY - 280,
          width: 1040,
          height: 600,
          background:
            "radial-gradient(ellipse, rgba(220,50,50,0.22) 0%, rgba(220,50,50,0) 70%)",
          opacity: 0.5 + 0.4 * vignettePulse,
          pointerEvents: "none",
        }}
      />

      {/* SVG layer for sign, figures, arrows */}
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="figureGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff3838" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#ff3838" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ff3838" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff3838" />
            <stop offset="100%" stopColor="#ffcc00" />
          </linearGradient>
          <linearGradient id="signGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1c7a3a" />
            <stop offset="100%" stopColor="#0f5424" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* HAMAS SIGN — green plaque, white text, red warning border */}
        <g
          transform={`translate(${SIGN_CX}, ${SIGN_CY + signY}) scale(${signScale}) translate(${-SIGN_CX}, ${-SIGN_CY})`}
          opacity={signIn}
          filter="url(#softGlow)"
        >
          {/* Pole shadow */}
          <rect
            x={SIGN_CX - 8}
            y={SIGN_CY + SIGN_H / 2}
            width={16}
            height={160}
            fill="#1a1a1a"
          />
          {/* Red warning border */}
          <rect
            x={SIGN_CX - SIGN_W / 2 - 10}
            y={SIGN_CY - SIGN_H / 2 - 10}
            width={SIGN_W + 20}
            height={SIGN_H + 20}
            rx={8}
            fill="#cc1f1f"
          />
          {/* Green plaque */}
          <rect
            x={SIGN_CX - SIGN_W / 2}
            y={SIGN_CY - SIGN_H / 2}
            width={SIGN_W}
            height={SIGN_H}
            rx={4}
            fill="url(#signGrad)"
          />
          {/* Top accent line */}
          <rect
            x={SIGN_CX - SIGN_W / 2 + 20}
            y={SIGN_CY - SIGN_H / 2 + 18}
            width={SIGN_W - 40}
            height={3}
            fill="rgba(255,255,255,0.35)"
          />
          {/* HAMAS text */}
          <text
            x={SIGN_CX}
            y={SIGN_CY + 28}
            textAnchor="middle"
            fontSize={150}
            fontWeight={900}
            fill="#ffffff"
            letterSpacing={10}
            fontFamily="'Impact', 'Arial Black', sans-serif"
            style={{ textTransform: "uppercase" }}
          >
            HAMAS
          </text>
          {/* Designation tag */}
          <rect
            x={SIGN_CX - 230}
            y={SIGN_CY + 60}
            width={460}
            height={32}
            rx={3}
            fill="#0a0a0a"
          />
          <text
            x={SIGN_CX}
            y={SIGN_CY + 83}
            textAnchor="middle"
            fontSize={20}
            fontWeight={700}
            fill="#ff5555"
            letterSpacing={3}
            fontFamily="Arial, sans-serif"
          >
            DESIGNATED TERRORIST ORGANIZATION
          </text>
        </g>

        {/* FIGURES — mysterious imam silhouettes */}
        {FIGURES.map((fig, i) => {
          const figureSpring = spring({
            frame: frame - FIGURES_IN - i * 5,
            fps,
            config: { damping: 200 },
          });
          const figureY = interpolate(figureSpring, [0, 1], [30, 0]);
          const figureOpacity = figureSpring;

          // Pulsing red highlight under each figure (staggered)
          const pulseFrame = frame - HIGHLIGHT_PULSE - i * 6;
          const pulse =
            pulseFrame < 0
              ? 0
              : 0.5 + 0.5 * Math.sin((pulseFrame / 12) * Math.PI);
          const glowOpacity = pulseFrame < 0 ? 0 : Math.min(1, pulseFrame / 8);

          return (
            <g
              key={i}
              transform={`translate(${fig.x}, ${fig.y + figureY})`}
              opacity={figureOpacity}
            >
              {/* Red mysterious glow */}
              <ellipse
                cx={0}
                cy={60}
                rx={150 + pulse * 25}
                ry={130 + pulse * 20}
                fill="url(#figureGlow)"
                opacity={glowOpacity * (0.6 + pulse * 0.4)}
              />
              {/* Robe body (trapezoid) */}
              <path
                d={`M -55 110
                    L -85 200
                    L 85 200
                    L 55 110 Z`}
                fill="#0a0a0a"
                stroke="#ff3838"
                strokeWidth={2}
              />
              {/* Shoulders / chest */}
              <path
                d={`M -55 60
                    L -65 115
                    L 65 115
                    L 55 60 Z`}
                fill="#0a0a0a"
                stroke="#ff3838"
                strokeWidth={2}
              />
              {/* Head + hood */}
              <ellipse cx={0} cy={20} rx={45} ry={52} fill="#0a0a0a" stroke="#ff3838" strokeWidth={2} />
              <ellipse cx={0} cy={30} rx={28} ry={32} fill="#000000" />
              {/* Hood drape */}
              <path
                d={`M -45 25
                    Q -75 60 -55 110
                    L 55 110
                    Q 75 60 45 25
                    Q 35 -25 0 -30
                    Q -35 -25 -45 25 Z`}
                fill="#0a0a0a"
                stroke="#ff3838"
                strokeWidth={2}
              />
              {/* Re-cut face hole */}
              <ellipse cx={0} cy={30} rx={26} ry={30} fill="#000000" />
              {/* Question mark inside face */}
              <text
                x={0}
                y={42}
                textAnchor="middle"
                fontSize={36}
                fontWeight={900}
                fill="#ff3838"
                opacity={0.85}
                fontFamily="Arial, sans-serif"
              >
                ?
              </text>
            </g>
          );
        })}

        {/* ARROWS from each figure to HAMAS sign */}
        {FIGURES.map((fig, i) => {
          const start = ARROW_START + i * ARROW_STAGGER;
          if (frame < start) return null;
          const len = pathLength(fig.x, fig.y);
          const prog = spring({
            frame: frame - start,
            fps,
            config: { damping: 200, stiffness: 80 },
          });
          const dashOffset = interpolate(prog, [0, 1], [len, 0]);

          const headOpacity = interpolate(prog, [0.85, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const ex = SIGN_CX + (fig.x - SIGN_CX) * 0.18;
          const ey = SIGN_TOP_Y - 8;
          const headAngle =
            Math.atan2(ey - (fig.y + 110), ex - fig.x) * (180 / Math.PI) + 90;

          return (
            <g key={`arrow-${i}`}>
              <path
                d={arrowPath(fig.x, fig.y)}
                fill="none"
                stroke="url(#arrowGrad)"
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={dashOffset}
                filter="url(#softGlow)"
              />
              {/* Arrowhead at sign top */}
              <g
                transform={`translate(${ex}, ${ey}) rotate(${headAngle})`}
                opacity={headOpacity}
              >
                <path
                  d="M 0 0 L -14 -22 L 0 -14 L 14 -22 Z"
                  fill="#ffcc00"
                  stroke="#ff3838"
                  strokeWidth={1.5}
                />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
