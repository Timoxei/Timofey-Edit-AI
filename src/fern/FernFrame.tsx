import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FERN } from "./theme";

export type FernFrameProps = {
  children: React.ReactNode;
  /** Ken Burns scale across the whole shot (1.00 -> 1.05). Default on. */
  kenBurns?: boolean;
};

/**
 * Full-frame Fern wrapper: warm charcoal gradient, vignette, animated grain,
 * constant slow zoom, global fade in/out (fades to transparent for alpha renders).
 */
export const FernFrame: React.FC<FernFrameProps> = ({ children, kenBurns = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = kenBurns
    ? interpolate(frame, [0, durationInFrames], [1.0, 1.05])
    : 1;

  // Deterministic grain jitter
  const gx = (frame * 97) % 256;
  const gy = (frame * 61) % 256;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
      {/* Everything (bg + content) rides the slow zoom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale})`,
          background: `linear-gradient(180deg, ${FERN.bgTop} 0%, ${FERN.bgBottom} 100%)`,
        }}
      >
        {children}
      </div>
      {/* Vignette — edges 25-40% darker */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.38) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Film grain — pure SVG turbulence, jittered per frame */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.055,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter id="fern-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect
          x={-300}
          y={-300}
          width={2520}
          height={1680}
          filter="url(#fern-grain)"
          transform={`translate(${-gx % 256}, ${-gy % 256})`}
        />
      </svg>
    </div>
  );
};
