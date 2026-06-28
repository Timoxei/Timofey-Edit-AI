import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const TOTAL_FRAMES = 120; // 4 seconds @ 30fps

const WIDTH = 1920;
const HEIGHT = 1080;

// Three imam silhouettes — evenly spaced across the top third
const FIGURES = [
  { x: 480, y: 340 },
  { x: 960, y: 320 },
  { x: 1440, y: 340 },
];

// HAMAS sign — centered, lower-mid
const SIGN_CX = 960;
const SIGN_CY = 780;
const SIGN_W = 620;
const SIGN_H = 220;
const SIGN_LEFT = SIGN_CX - SIGN_W / 2;
const SIGN_TOP = SIGN_CY - SIGN_H / 2;

// Timeline (frames)
const SIGN_IN = 0;
const FIGURES_IN = 12;
const ARROW_START = 40;
const ARROW_STAGGER = 5;

// Arrow lands on the top edge of the sign, spaced so they don't overlap
const arrowTarget = (i: number) => {
  const spread = SIGN_W * 0.6;
  const tx = SIGN_CX + ((i - 1) * spread) / 2;
  const ty = SIGN_TOP;
  return { tx, ty };
};

// Bezier control point: arc upward between start and target
const arrowControl = (sx: number, sy: number, tx: number, ty: number) => {
  const cx = (sx + tx) / 2;
  const cy = Math.min(sy, ty) - 90;
  return { cx, cy };
};

const arrowPath = (sx: number, sy: number, tx: number, ty: number) => {
  const { cx, cy } = arrowControl(sx, sy, tx, ty);
  return `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;
};

// Approximate length of the quadratic curve (chord + control fudge)
const arrowLength = (sx: number, sy: number, tx: number, ty: number) => {
  const { cx, cy } = arrowControl(sx, sy, tx, ty);
  const d1 = Math.hypot(cx - sx, cy - sy);
  const d2 = Math.hypot(tx - cx, ty - cy);
  const chord = Math.hypot(tx - sx, ty - sy);
  return (d1 + d2 + chord) / 2;
};

// Tangent at t=1 for quadratic Bezier is 2*(P2 - P1)
const arrowEndAngleDeg = (sx: number, sy: number, tx: number, ty: number) => {
  const { cx, cy } = arrowControl(sx, sy, tx, ty);
  const dx = tx - cx;
  const dy = ty - cy;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};

export const ThreeImamsHamas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const signIn = spring({ frame: frame - SIGN_IN, fps, config: { damping: 200 } });
  const signOffsetY = interpolate(signIn, [0, 1], [30, 0]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at 50% 65%, #14141c 0%, #050507 75%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      }}
    >
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="figureGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff3838" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#ff3838" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ff3838" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="100%" stopColor="#ffd24a" />
          </linearGradient>
          <linearGradient id="signGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#187a39" />
            <stop offset="100%" stopColor="#0e5023" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* HAMAS sign */}
        <g
          transform={`translate(0, ${signOffsetY})`}
          opacity={signIn}
        >
          {/* Drop shadow */}
          <rect
            x={SIGN_LEFT + 6}
            y={SIGN_TOP + 8}
            width={SIGN_W}
            height={SIGN_H}
            rx={6}
            fill="rgba(0,0,0,0.55)"
          />
          {/* Plaque */}
          <rect
            x={SIGN_LEFT}
            y={SIGN_TOP}
            width={SIGN_W}
            height={SIGN_H}
            rx={6}
            fill="url(#signGrad)"
            stroke="#0a3318"
            strokeWidth={2}
          />
          {/* Inner border */}
          <rect
            x={SIGN_LEFT + 12}
            y={SIGN_TOP + 12}
            width={SIGN_W - 24}
            height={SIGN_H - 24}
            rx={3}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1.5}
          />
          {/* HAMAS wordmark */}
          <text
            x={SIGN_CX}
            y={SIGN_CY + 38}
            textAnchor="middle"
            fontSize={140}
            fontWeight={900}
            fill="#ffffff"
            letterSpacing={14}
            fontFamily="'Impact', 'Arial Black', sans-serif"
          >
            HAMAS
          </text>
        </g>

        {/* Caption beneath sign */}
        <g opacity={signIn}>
          <text
            x={SIGN_CX}
            y={SIGN_TOP + SIGN_H + 50}
            textAnchor="middle"
            fontSize={22}
            fontWeight={700}
            fill="#ff6b6b"
            letterSpacing={6}
            fontFamily="'Inter', Arial, sans-serif"
          >
            U.S. STATE DEPT. DESIGNATED FTO
          </text>
        </g>

        {/* Three imam silhouettes */}
        {FIGURES.map((fig, i) => {
          const figureSpring = spring({
            frame: frame - FIGURES_IN - i * 4,
            fps,
            config: { damping: 200 },
          });
          const dropY = interpolate(figureSpring, [0, 1], [24, 0]);
          const glowOpacity = Math.min(1, Math.max(0, (frame - FIGURES_IN - i * 4 - 6) / 14));

          return (
            <g
              key={i}
              transform={`translate(${fig.x}, ${fig.y + dropY})`}
              opacity={figureSpring}
            >
              {/* Ambient red glow */}
              <ellipse
                cx={0}
                cy={80}
                rx={140}
                ry={120}
                fill="url(#figureGlow)"
                opacity={glowOpacity}
              />
              {/* Robe body */}
              <path
                d="M -50 100 L -80 200 L 80 200 L 50 100 Z"
                fill="#0a0a0a"
                stroke="#ff3838"
                strokeWidth={1.5}
              />
              {/* Shoulders */}
              <path
                d="M -50 55 L -60 110 L 60 110 L 50 55 Z"
                fill="#0a0a0a"
                stroke="#ff3838"
                strokeWidth={1.5}
              />
              {/* Hood drape */}
              <path
                d="M -42 22 Q -70 58 -52 108 L 52 108 Q 70 58 42 22 Q 32 -26 0 -30 Q -32 -26 -42 22 Z"
                fill="#0a0a0a"
                stroke="#ff3838"
                strokeWidth={1.5}
              />
              {/* Face void */}
              <ellipse cx={0} cy={32} rx={26} ry={30} fill="#000000" />
              {/* Question mark */}
              <text
                x={0}
                y={46}
                textAnchor="middle"
                fontSize={36}
                fontWeight={900}
                fill="#ff3838"
                fontFamily="Arial, sans-serif"
              >
                ?
              </text>
            </g>
          );
        })}

        {/* Arrows — figure → sign */}
        {FIGURES.map((fig, i) => {
          const start = ARROW_START + i * ARROW_STAGGER;
          if (frame < start) return null;

          const sx = fig.x;
          const sy = fig.y + 210; // start just below the robe hem
          const { tx, ty } = arrowTarget(i);
          const len = arrowLength(sx, sy, tx, ty);
          const angleDeg = arrowEndAngleDeg(sx, sy, tx, ty);

          const prog = spring({
            frame: frame - start,
            fps,
            config: { damping: 200, stiffness: 90 },
          });
          const dashOffset = interpolate(prog, [0, 1], [len, 0]);
          const headOpacity = interpolate(prog, [0.88, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <g key={`arrow-${i}`}>
              <path
                d={arrowPath(sx, sy, tx, ty)}
                fill="none"
                stroke="url(#arrowGrad)"
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={dashOffset}
                filter="url(#softGlow)"
              />
              {/* Arrowhead — rotated so the tip points along the curve tangent */}
              <g
                transform={`translate(${tx}, ${ty}) rotate(${angleDeg + 90})`}
                opacity={headOpacity}
              >
                <path
                  d="M 0 0 L -12 -20 L 0 -12 L 12 -20 Z"
                  fill="#ffd24a"
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
