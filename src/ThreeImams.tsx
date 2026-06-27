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

// Mosque target point (top of dome) — bottom center
const MOSQUE_X = 960;
const MOSQUE_Y = 760;
const MOSQUE_DOME_TIP_Y = 640;

// Timeline
const MOSQUE_IN = 0;
const FIGURES_IN = 14;
const HIGHLIGHT_PULSE = 30;
const ARROW_START = 46;
const ARROW_STAGGER = 6;
const TEXT_START = 72;
const HAMAS_HIGHLIGHT = 100;

const SENTENCE = "This mosque that they own has had three imams connected to Hamas.";

// Path from a figure's feet to the dome tip — gentle curve
const arrowPath = (fx: number, fy: number) => {
  const sx = fx;
  const sy = fy + 110; // start just below figure
  const ex = MOSQUE_X;
  const ey = MOSQUE_DOME_TIP_Y;
  const cx = (sx + ex) / 2;
  const cy = Math.min(sy, ey) - 80; // arc upward
  return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
};

// Rough path length for stroke-dash animation
const pathLength = (fx: number, fy: number) => {
  const sx = fx;
  const sy = fy + 110;
  const ex = MOSQUE_X;
  const ey = MOSQUE_DOME_TIP_Y;
  // Approximate with straight-line + arc fudge
  const d = Math.hypot(ex - sx, ey - sy);
  return d * 1.08;
};

export const ThreeImams: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mosque entrance
  const mosqueIn = spring({ frame: frame - MOSQUE_IN, fps, config: { damping: 200 } });
  const mosqueY = interpolate(mosqueIn, [0, 1], [40, 0]);

  // Background vignette pulse
  const vignettePulse = 0.5 + 0.5 * Math.sin((frame / 30) * Math.PI);

  // Text reveal — sentence-level fade with word-by-word stagger
  const words = SENTENCE.split(" ");

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
      {/* Subtle radial pulse behind mosque */}
      <div
        style={{
          position: "absolute",
          left: MOSQUE_X - 500,
          top: MOSQUE_DOME_TIP_Y - 100,
          width: 1000,
          height: 600,
          background:
            "radial-gradient(ellipse, rgba(220,50,50,0.18) 0%, rgba(220,50,50,0) 70%)",
          opacity: 0.4 + 0.4 * vignettePulse,
          pointerEvents: "none",
        }}
      />

      {/* SVG layer for mosque, figures, arrows */}
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
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* MOSQUE silhouette */}
        <g
          transform={`translate(0, ${mosqueY})`}
          opacity={mosqueIn}
          filter="url(#softGlow)"
        >
          {/* Ground line */}
          <rect x={MOSQUE_X - 300} y={MOSQUE_Y + 60} width={600} height={4} fill="#2a2a2a" />
          {/* Main building */}
          <rect x={MOSQUE_X - 180} y={MOSQUE_Y - 80} width={360} height={140} fill="#e8e8e8" />
          {/* Dome */}
          <path
            d={`M ${MOSQUE_X - 180} ${MOSQUE_Y - 80}
                Q ${MOSQUE_X} ${MOSQUE_DOME_TIP_Y - 60}
                  ${MOSQUE_X + 180} ${MOSQUE_Y - 80} Z`}
            fill="#e8e8e8"
          />
          {/* Crescent on top */}
          <circle cx={MOSQUE_X} cy={MOSQUE_DOME_TIP_Y - 30} r={14} fill="#ffd24a" />
          <circle cx={MOSQUE_X + 6} cy={MOSQUE_DOME_TIP_Y - 32} r={11} fill="#0a0a0f" />
          {/* Left minaret */}
          <rect x={MOSQUE_X - 250} y={MOSQUE_Y - 160} width={28} height={220} fill="#e8e8e8" />
          <path
            d={`M ${MOSQUE_X - 250} ${MOSQUE_Y - 160}
                L ${MOSQUE_X - 236} ${MOSQUE_Y - 200}
                L ${MOSQUE_X - 222} ${MOSQUE_Y - 160} Z`}
            fill="#e8e8e8"
          />
          {/* Right minaret */}
          <rect x={MOSQUE_X + 222} y={MOSQUE_Y - 160} width={28} height={220} fill="#e8e8e8" />
          <path
            d={`M ${MOSQUE_X + 222} ${MOSQUE_Y - 160}
                L ${MOSQUE_X + 236} ${MOSQUE_Y - 200}
                L ${MOSQUE_X + 250} ${MOSQUE_Y - 160} Z`}
            fill="#e8e8e8"
          />
          {/* Door */}
          <path
            d={`M ${MOSQUE_X - 40} ${MOSQUE_Y + 60}
                L ${MOSQUE_X - 40} ${MOSQUE_Y - 10}
                Q ${MOSQUE_X} ${MOSQUE_Y - 50}
                  ${MOSQUE_X + 40} ${MOSQUE_Y - 10}
                L ${MOSQUE_X + 40} ${MOSQUE_Y + 60} Z`}
            fill="#0a0a0f"
          />
          {/* Windows */}
          <circle cx={MOSQUE_X - 110} cy={MOSQUE_Y - 10} r={14} fill="#0a0a0f" />
          <circle cx={MOSQUE_X + 110} cy={MOSQUE_Y - 10} r={14} fill="#0a0a0f" />
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
              {/* Robed figure silhouette */}
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
              {/* Inner face shadow (anonymous) */}
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
              {/* Question mark hint inside face */}
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

        {/* ARROWS from each figure to mosque */}
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

          // Arrow head appears at the very end
          const headOpacity = interpolate(prog, [0.85, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

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
              {/* Arrowhead at dome tip */}
              <g
                transform={`translate(${MOSQUE_X}, ${MOSQUE_DOME_TIP_Y}) rotate(${
                  Math.atan2(MOSQUE_DOME_TIP_Y - (fig.y + 110), MOSQUE_X - fig.x) *
                    (180 / Math.PI) +
                  90
                })`}
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

      {/* TEXT at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 80px",
          fontSize: 54,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: 0.5,
          lineHeight: 1.25,
          textShadow: "0 2px 12px rgba(0,0,0,0.9)",
        }}
      >
        {words.map((word, i) => {
          const wordStart = TEXT_START + i * 2.5;
          const wordOpacity = interpolate(
            frame,
            [wordStart, wordStart + 8],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const wordY = interpolate(
            frame,
            [wordStart, wordStart + 12],
            [12, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          const cleaned = word.replace(/[.,]/g, "").toLowerCase();
          const isHamas = cleaned === "hamas";
          const isThree = cleaned === "three";

          // Highlight color flash on Hamas
          const hamasFlash =
            frame < HAMAS_HIGHLIGHT
              ? 0
              : Math.min(1, (frame - HAMAS_HIGHLIGHT) / 8);

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: wordOpacity,
                transform: `translateY(${wordY}px)`,
                color: isHamas
                  ? `rgb(${255}, ${interpolate(hamasFlash, [0, 1], [255, 56])}, ${interpolate(
                      hamasFlash,
                      [0, 1],
                      [255, 56],
                    )})`
                  : isThree
                    ? "#ffd24a"
                    : "#ffffff",
                fontWeight: isHamas || isThree ? 900 : 700,
                marginRight: 14,
                textShadow: isHamas
                  ? `0 0 ${interpolate(hamasFlash, [0, 1], [0, 24])}px rgba(255,56,56,${hamasFlash})`
                  : "0 2px 12px rgba(0,0,0,0.9)",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
