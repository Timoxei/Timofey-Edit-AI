import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FERN, STAGGER_FRAMES, easeOutCubic } from "./theme";

/** Ease-out rise+fade entrance. Returns style fragment. */
export const useRiseIn = (start: number, rise = 22) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - start, fps, config: { damping: 200 } });
  return {
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [rise, 0])}px)`,
  };
};

/** Mono ALL-CAPS kicker label, wide tracking. e.g. "CASE FILE · NO. 001" */
export const Kicker: React.FC<{ text: string; start?: number; color?: string }> = ({
  text,
  start = 0,
  color = FERN.dim,
}) => {
  const rise = useRiseIn(start, 16);
  return (
    <div
      style={{
        fontFamily: FERN.monoFont,
        fontSize: 30,
        letterSpacing: "6px",
        textTransform: "uppercase",
        color,
        ...rise,
      }}
    >
      {text}
    </div>
  );
};

/** Headline lines, ALL CAPS condensed, staggered rise-in. */
export const StaggerLines: React.FC<{
  lines: string[];
  start?: number;
  fontSize?: number;
  color?: string;
  stagger?: number;
  align?: "left" | "center";
}> = ({ lines, start = 0, fontSize = 130, color = FERN.cream, stagger = STAGGER_FRAMES, align = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ textAlign: align }}>
      {lines.map((line, i) => {
        const p = spring({ frame: frame - start - i * stagger, fps, config: { damping: 200 } });
        return (
          <div
            key={i}
            style={{
              fontFamily: FERN.headlineFont,
              fontWeight: 700,
              fontStretch: "condensed",
              textTransform: "uppercase",
              fontSize,
              lineHeight: 1.04,
              color,
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

/** Rust underline that draws on (grows from left). */
export const RustUnderline: React.FC<{
  start: number;
  width: number;
  thickness?: number;
  grow?: "left" | "center";
}> = ({ start, width, thickness = 8, grow = "left" }) => {
  const frame = useCurrentFrame();
  const p = easeOutCubic((frame - start) / 20);
  return (
    <div
      style={{
        width,
        height: thickness,
        marginTop: 26,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: grow === "center" ? "50%" : 0,
          top: 0,
          height: "100%",
          width: width * p,
          background: FERN.rust,
          transform: grow === "center" ? "translateX(-50%)" : undefined,
        }}
      />
    </div>
  );
};

/** Small mono citation, bottom-left of frame. */
export const SourceTag: React.FC<{ text: string; start?: number }> = ({ text, start = 20 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start + 15], [0, 0.75], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        bottom: 54,
        fontFamily: FERN.monoFont,
        fontSize: 24,
        letterSpacing: "3px",
        textTransform: "uppercase",
        color: FERN.dim,
        opacity,
      }}
    >
      SOURCE · {text}
    </div>
  );
};

/** Push pin for evidence cards. */
export const PushPin: React.FC<{ color?: string }> = ({ color = FERN.rust }) => (
  <div
    style={{
      position: "absolute",
      top: -14,
      left: "50%",
      transform: "translateX(-50%)",
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 30%, #E06A4B, ${color} 60%, #7E2C18 100%)`,
      boxShadow: "0 6px 10px rgba(0,0,0,0.55)",
      zIndex: 3,
    }}
  />
);

export type PhotoCardData = {
  /** Path under public/, e.g. "singham_ch1/castro.jpg". Omit for a text-only paper card. */
  src?: string;
  caption: string;
  /** Text body for text-only cards */
  body?: string;
  x: number; // center, px in 1920x1080 space
  y: number;
  w: number;
  rot?: number; // deg
};

/** Polaroid-style evidence card: white border, pushpin, caption; settles 1.08 -> 1.00. */
export const PhotoCard: React.FC<{ card: PhotoCardData; start: number }> = ({ card, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - start, fps, config: { damping: 200 } });
  const settle = interpolate(p, [0, 1], [1.08, 1.0]);
  const rot = card.rot ?? 0;
  return (
    <div
      style={{
        position: "absolute",
        left: card.x,
        top: card.y,
        width: card.w,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${settle})`,
        opacity: p,
        background: "#F5F0E4",
        padding: "16px 16px 14px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.6)",
      }}
    >
      <PushPin />
      {card.src ? (
        <Img
          src={staticFile(card.src)}
          style={{ width: "100%", display: "block", filter: "sepia(0.14) contrast(1.02)" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            minHeight: card.w * 0.5,
            background: FERN.paper,
            color: FERN.ink,
            fontFamily: FERN.serifFont,
            fontSize: card.w * 0.062,
            lineHeight: 1.35,
            padding: "8%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
          }}
        >
          {card.body}
        </div>
      )}
      <div
        style={{
          marginTop: 12,
          fontFamily: FERN.monoFont,
          fontSize: Math.max(19, card.w * 0.045),
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "#4A443A",
          textAlign: "center",
        }}
      >
        {card.caption}
      </div>
    </div>
  );
};

/** Rust "red string" between two points, draws on via dashoffset. */
export const RedString: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  start: number;
  sag?: number;
}> = ({ x1, y1, x2, y2, start, sag = 40 }) => {
  const frame = useCurrentFrame();
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.1;
  const p = easeOutCubic((frame - start) / 24);
  const cx = (x1 + x2) / 2;
  const cy = Math.max(y1, y2) + sag;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}
    >
      <path
        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
        fill="none"
        stroke={FERN.rust}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
        opacity={p > 0 ? 0.95 : 0}
      />
    </svg>
  );
};

/** Redaction bar that sweeps over text. */
export const Redaction: React.FC<{ start: number; width: number; height?: number }> = ({
  start,
  width,
  height = 34,
}) => {
  const frame = useCurrentFrame();
  const p = easeOutCubic((frame - start) / 14);
  return (
    <span
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        width: width * p,
        height,
        background: "#141210",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.4)",
        margin: "0 6px",
      }}
    />
  );
};
