import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const TOTAL_FRAMES = 120; // 4 seconds @ 30fps

const WIDTH = 1920;
const HEIGHT = 1080;

// Locked text strings from research/FINAL_FACTS.md — DO NOT EDIT
type ImamSpec = {
  name: string;
  position: string;
  mosque: string;
  legal: string;
  legalColor: string; // visual coding: red for convicted, amber for UCC
  arrowColor: string;
  arrowStroke: number;
};

const IMAMS: ImamSpec[] = [
  {
    name: "MOHAMMAD EL-MEZAIN",
    position: "Co-founder & first imam, Islamic Center of Passaic County",
    mosque: "Islamic Center of Passaic County — Paterson, NJ",
    legal: "CONVICTED 2008 — DEPORTED 2022 TO TURKEY",
    legalColor: "#ff3838",
    arrowColor: "#ff2626",
    arrowStroke: 9,
  },
  {
    name: "KIFAH MUSTAPHA",
    position: "Imam, Mosque Foundation (2002–2014); paid HLF Illinois rep 1996–2000",
    mosque: "Mosque Foundation — Bridgeview, IL",
    legal: "NAMED UNINDICTED CO-CONSPIRATOR (2007)",
    legalColor: "#ffb23a",
    arrowColor: "#ffb23a",
    arrowStroke: 5,
  },
  {
    name: "JAMAL SAID",
    position: "Principal imam, Mosque Foundation (since 1985)",
    mosque: "Mosque Foundation — Bridgeview, IL",
    legal: "NAMED UNINDICTED CO-CONSPIRATOR (2007)",
    legalColor: "#ffb23a",
    arrowColor: "#ffb23a",
    arrowStroke: 5,
  },
];

const SOURCE_LINE =
  "Source: U.S. v. Holy Land Foundation, No. 3:04-CR-240-G (N.D. Tex.); aff'd U.S. v. El-Mezain, 664 F.3d 467 (5th Cir. 2011)";

// Figure positions (top third) — raised so the 4-line chyron stack
// fits comfortably ABOVE each silhouette without overlap
const FIGURES = [
  { x: 380, y: 290 },   // El-Mezain (left)
  { x: 960, y: 270 },   // Mustapha (center)
  { x: 1540, y: 290 },  // Said (right)
];

// HLF badge — center of screen
const HLF_CX = 960;
const HLF_CY = 690;
const HLF_W = 720;
const HLF_H = 270;
const HLF_LEFT = HLF_CX - HLF_W / 2;
const HLF_TOP = HLF_CY - HLF_H / 2;

// HAMAS secondary tag — to the right of HLF
const HAMAS_CX = 1700;
const HAMAS_CY = HLF_CY;
const HAMAS_W = 280;
const HAMAS_H = 110;
const HAMAS_LEFT = HAMAS_CX - HAMAS_W / 2;
const HAMAS_TOP = HAMAS_CY - HAMAS_H / 2;

// Timeline
const HLF_IN = 0;
const FIGURE_IN_BASE = 10;
const CHYRON_IN_BASE = 30;
const ARROW_EL_MEZAIN_START = 45;
const ARROW_OTHERS_START = 55;
const HAMAS_CONNECTOR_START = 80;
const SOURCE_IN = 100;

// Each imam arrow goes from below the figure down to the top edge of the HLF badge
const arrowTargetX = (i: number) => {
  // Spread targets across upper edge of HLF badge so arrows don't overlap
  const spread = HLF_W * 0.55;
  return HLF_CX + ((i - 1) * spread) / 2;
};

const arrowControl = (sx: number, sy: number, tx: number, ty: number) => {
  const cx = (sx + tx) / 2;
  const cy = Math.min(sy, ty) - 40;
  return { cx, cy };
};

const arrowPath = (sx: number, sy: number, tx: number, ty: number) => {
  const { cx, cy } = arrowControl(sx, sy, tx, ty);
  return `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;
};

const arrowLength = (sx: number, sy: number, tx: number, ty: number) => {
  const { cx, cy } = arrowControl(sx, sy, tx, ty);
  const d1 = Math.hypot(cx - sx, cy - sy);
  const d2 = Math.hypot(tx - cx, ty - cy);
  const chord = Math.hypot(tx - sx, ty - sy);
  return (d1 + d2 + chord) / 2;
};

const arrowEndAngleDeg = (sx: number, sy: number, tx: number, ty: number) => {
  const { cx, cy } = arrowControl(sx, sy, tx, ty);
  const dx = tx - cx;
  const dy = ty - cy;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};

export const ThreeImamsHLF: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // HLF badge entrance
  const hlfIn = spring({ frame: frame - HLF_IN, fps, config: { damping: 200 } });
  const hlfOffsetY = interpolate(hlfIn, [0, 1], [28, 0]);

  // HLF impact glow when arrows land
  const impactGlow = interpolate(frame, [70, 85, 110], [0, 1, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // HAMAS connector
  const hamasIn = spring({
    frame: frame - HAMAS_CONNECTOR_START,
    fps,
    config: { damping: 200, stiffness: 90 },
  });

  // Source line
  const sourceIn = spring({
    frame: frame - SOURCE_IN,
    fps,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at 50% 60%, #14141c 0%, #050507 75%)",
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
          <radialGradient id="hlfImpactGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd24a" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#ff6b3a" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ff6b3a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hlfGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1c1c24" />
            <stop offset="100%" stopColor="#0a0a10" />
          </linearGradient>
          <linearGradient id="hamasGrad" x1="0%" y1="0%" x2="0%" y2="100%">
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

        {/* HLF impact glow ring */}
        <ellipse
          cx={HLF_CX}
          cy={HLF_CY}
          rx={HLF_W / 2 + 80}
          ry={HLF_H / 2 + 70}
          fill="url(#hlfImpactGlow)"
          opacity={impactGlow}
        />

        {/* HLF BADGE — central institution */}
        <g transform={`translate(0, ${hlfOffsetY})`} opacity={hlfIn}>
          {/* Drop shadow */}
          <rect
            x={HLF_LEFT + 6}
            y={HLF_TOP + 8}
            width={HLF_W}
            height={HLF_H}
            rx={8}
            fill="rgba(0,0,0,0.55)"
          />
          {/* Card body — OFAC-style dark with red/green border */}
          <rect
            x={HLF_LEFT}
            y={HLF_TOP}
            width={HLF_W}
            height={HLF_H}
            rx={8}
            fill="url(#hlfGrad)"
            stroke="#ff3838"
            strokeWidth={3}
          />
          {/* Inner border */}
          <rect
            x={HLF_LEFT + 10}
            y={HLF_TOP + 10}
            width={HLF_W - 20}
            height={HLF_H - 20}
            rx={4}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={1.5}
          />
          {/* "DESIGNATED" stamp strip top */}
          <rect
            x={HLF_LEFT}
            y={HLF_TOP}
            width={HLF_W}
            height={32}
            rx={8}
            fill="#ff3838"
          />
          <text
            x={HLF_CX}
            y={HLF_TOP + 23}
            textAnchor="middle"
            fontSize={15}
            fontWeight={900}
            fill="#0a0a10"
            letterSpacing={3}
            fontFamily="'Inter', Arial, sans-serif"
          >
            U.S. TREASURY — DESIGNATED TERRORIST FINANCIER
          </text>

          {/* Main title */}
          <text
            x={HLF_CX}
            y={HLF_TOP + 90}
            textAnchor="middle"
            fontSize={42}
            fontWeight={900}
            fill="#ffffff"
            letterSpacing={2}
            fontFamily="'Impact', 'Arial Black', sans-serif"
          >
            HOLY LAND FOUNDATION FOR RELIEF AND DEVELOPMENT
          </text>
          {/* Subline 1 — designation */}
          <text
            x={HLF_CX}
            y={HLF_TOP + 138}
            textAnchor="middle"
            fontSize={22}
            fontWeight={700}
            fill="#ffd24a"
            letterSpacing={2}
            fontFamily="'Inter', Arial, sans-serif"
          >
            Designated SDGT — Exec. Order 13224 (2001)
          </text>
          {/* Subline 2 — $ funneled */}
          <text
            x={HLF_CX}
            y={HLF_TOP + 200}
            textAnchor="middle"
            fontSize={42}
            fontWeight={900}
            fill="#ff6b6b"
            letterSpacing={3}
            fontFamily="'Impact', 'Arial Black', sans-serif"
          >
            $12.4M FUNNELED TO HAMAS
          </text>
        </g>

        {/* HAMAS secondary tag */}
        <g opacity={hamasIn}>
          {/* Connector arrow HLF → HAMAS */}
          {(() => {
            const sx = HLF_LEFT + HLF_W;
            const sy = HLF_CY;
            const tx = HAMAS_LEFT;
            const ty = HAMAS_CY;
            const len = Math.hypot(tx - sx, ty - sy);
            const dashOffset = interpolate(hamasIn, [0, 1], [len, 0]);
            return (
              <>
                <path
                  d={`M ${sx} ${sy} L ${tx - 14} ${ty}`}
                  stroke="#ff3838"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={len}
                  strokeDashoffset={dashOffset}
                  fill="none"
                  filter="url(#softGlow)"
                />
                <polygon
                  points={`${tx - 14},${ty - 9} ${tx},${ty} ${tx - 14},${ty + 9}`}
                  fill="#ff3838"
                  opacity={interpolate(hamasIn, [0.7, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}
                />
              </>
            );
          })()}
          {/* HAMAS plaque */}
          <rect
            x={HAMAS_LEFT + 4}
            y={HAMAS_TOP + 5}
            width={HAMAS_W}
            height={HAMAS_H}
            rx={6}
            fill="rgba(0,0,0,0.55)"
          />
          <rect
            x={HAMAS_LEFT}
            y={HAMAS_TOP}
            width={HAMAS_W}
            height={HAMAS_H}
            rx={6}
            fill="url(#hamasGrad)"
            stroke="#0a3318"
            strokeWidth={2}
          />
          <text
            x={HAMAS_CX}
            y={HAMAS_CY + 18}
            textAnchor="middle"
            fontSize={64}
            fontWeight={900}
            fill="#ffffff"
            letterSpacing={8}
            fontFamily="'Impact', 'Arial Black', sans-serif"
          >
            HAMAS
          </text>
          <text
            x={HAMAS_CX}
            y={HAMAS_TOP + HAMAS_H + 24}
            textAnchor="middle"
            fontSize={14}
            fontWeight={700}
            fill="#ff6b6b"
            letterSpacing={3}
            fontFamily="'Inter', Arial, sans-serif"
          >
            U.S. STATE DEPT. DESIGNATED FTO
          </text>
        </g>

        {/* Three imam silhouettes */}
        {FIGURES.map((fig, i) => {
          const figSpring = spring({
            frame: frame - FIGURE_IN_BASE - i * 5,
            fps,
            config: { damping: 200 },
          });
          const dropY = interpolate(figSpring, [0, 1], [22, 0]);
          const glowOpacity = Math.min(
            1,
            Math.max(0, (frame - FIGURE_IN_BASE - i * 5 - 6) / 14)
          );

          return (
            <g
              key={`fig-${i}`}
              transform={`translate(${fig.x}, ${fig.y + dropY})`}
              opacity={figSpring}
            >
              {/* Ambient red glow */}
              <ellipse
                cx={0}
                cy={70}
                rx={120}
                ry={105}
                fill="url(#figureGlow)"
                opacity={glowOpacity}
              />
              {/* Robe body */}
              <path
                d="M -42 90 L -68 175 L 68 175 L 42 90 Z"
                fill="#0a0a0a"
                stroke="#ff3838"
                strokeWidth={1.5}
              />
              {/* Shoulders */}
              <path
                d="M -42 50 L -52 98 L 52 98 L 42 50 Z"
                fill="#0a0a0a"
                stroke="#ff3838"
                strokeWidth={1.5}
              />
              {/* Hood drape */}
              <path
                d="M -36 18 Q -60 50 -44 92 L 44 92 Q 60 50 36 18 Q 28 -22 0 -26 Q -28 -22 -36 18 Z"
                fill="#0a0a0a"
                stroke="#ff3838"
                strokeWidth={1.5}
              />
              {/* Face void */}
              <ellipse cx={0} cy={28} rx={22} ry={26} fill="#000000" />
              {/* Question mark */}
              <text
                x={0}
                y={40}
                textAnchor="middle"
                fontSize={30}
                fontWeight={900}
                fill="#ff3838"
                fontFamily="Arial, sans-serif"
              >
                ?
              </text>
            </g>
          );
        })}

        {/* ARROWS — each imam → HLF badge top edge */}
        {IMAMS.map((imam, i) => {
          const start =
            i === 0 ? ARROW_EL_MEZAIN_START : ARROW_OTHERS_START;
          if (frame < start) return null;

          const fig = FIGURES[i];
          const sx = fig.x;
          const sy = fig.y + 185; // start just below robe hem
          const tx = arrowTargetX(i);
          const ty = HLF_TOP - 22; // arrowhead tip kisses top edge of HLF badge
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
                stroke={imam.arrowColor}
                strokeWidth={imam.arrowStroke}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={dashOffset}
              />
              <g
                transform={`translate(${tx}, ${ty}) rotate(${angleDeg + 90})`}
                opacity={headOpacity}
              >
                <path
                  d={
                    i === 0
                      ? "M 0 0 L -16 -26 L 0 -16 L 16 -26 Z"
                      : "M 0 0 L -11 -19 L 0 -11 L 11 -19 Z"
                  }
                  fill={imam.arrowColor}
                  stroke="#0a0a0a"
                  strokeWidth={1}
                />
              </g>
            </g>
          );
        })}
      </svg>

      {/* Name labels + chyrons — HTML overlay for crisp text */}
      {IMAMS.map((imam, i) => {
        const fig = FIGURES[i];
        const chyronProg = spring({
          frame: frame - CHYRON_IN_BASE - i * 4,
          fps,
          config: { damping: 200 },
        });
        const chyronY = interpolate(chyronProg, [0, 1], [12, 0]);

        return (
          <div
            key={`label-${i}`}
            style={{
              position: "absolute",
              left: fig.x - 280,
              top: fig.y - 170,
              width: 560,
              textAlign: "center",
              opacity: chyronProg,
              transform: `translateY(${chyronY}px)`,
            }}
          >
            {/* Name */}
            <div
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: 2,
                textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                marginBottom: 6,
              }}
            >
              {imam.name}
            </div>
            {/* Position chyron */}
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#cfcfd6",
                background: "rgba(20,20,28,0.85)",
                border: "1px solid rgba(255,255,255,0.18)",
                padding: "4px 10px",
                borderRadius: 3,
                marginBottom: 4,
                display: "inline-block",
                maxWidth: 540,
              }}
            >
              {imam.position}
            </div>
            <br />
            {/* Mosque chyron */}
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#9ca0aa",
                background: "rgba(20,20,28,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "3px 9px",
                borderRadius: 3,
                marginBottom: 4,
                display: "inline-block",
              }}
            >
              {imam.mosque}
            </div>
            <br />
            {/* Legal status chyron — colored band */}
            <div
              style={{
                fontSize: 15,
                fontWeight: 900,
                color: "#0a0a10",
                background: imam.legalColor,
                padding: "5px 12px",
                borderRadius: 3,
                marginTop: 2,
                display: "inline-block",
                letterSpacing: 1.5,
                fontFamily: "'Inter', Arial, sans-serif",
                boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
              }}
            >
              {imam.legal}
            </div>
          </div>
        );
      })}

      {/* SOURCE CITATION — bottom strip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 24,
          textAlign: "center",
          opacity: sourceIn,
          transform: `translateY(${interpolate(sourceIn, [0, 1], [10, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 18,
            fontWeight: 600,
            color: "#e8e8ee",
            background: "rgba(10,10,16,0.85)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "8px 20px",
            borderRadius: 4,
            letterSpacing: 0.5,
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          }}
        >
          {SOURCE_LINE}
        </div>
      </div>
    </div>
  );
};
