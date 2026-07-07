import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FERN, clamp01, easeInOutCubic, easeOutCubic } from "./theme";
import { FernFrame } from "./FernFrame";
import { Kicker } from "./components";

export const FERN_ARTICLE_FRAMES = 270;

type CameraShot = {
  /** seconds at which the camera has fully arrived on this framing */
  t: number;
  /** focus point in article coordinate space (CSS px of the capture) */
  cx: number;
  cy: number;
  /** zoom: article px -> screen px multiplier */
  s: number;
};

type HighlightRect = { x: number; y: number; w: number; h: number };

export type FernArticleClipProps = {
  /** capture under public/, e.g. "singham_ch1/articles/federalist_singham.png" */
  src: string;
  /** coordinate-space size of the capture (CSS px at capture time) */
  imgW: number;
  imgH: number;
  shots: CameraShot[];
  /** rust underline drawn in article space (e.g. under the headline) */
  underline?: { x: number; y: number; w: number; start: number };
  /** yellow sweep rects in article space (line boxes of the key phrase) */
  highlights?: HighlightRect[];
  highlightStart?: number;
  kicker?: string;
  source?: string;
  durationInFrames?: number;
};

/**
 * Real article clipping with a documentary camera: eased push-ins and pans
 * between keyframed focus points, rust underline draw-on, yellow sweep
 * highlight over the exact quoted lines.
 */
export const FernArticleClip: React.FC<FernArticleClipProps> = ({
  src,
  imgW,
  imgH,
  shots,
  underline,
  highlights = [],
  highlightStart = 0,
  kicker,
  source,
}) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = frame / fps;

  // Piecewise eased interpolation between camera keyframes
  const cam = (() => {
    if (t <= shots[0].t) return shots[0];
    const last = shots[shots.length - 1];
    if (t >= last.t) return last;
    let i = 0;
    while (t > shots[i + 1].t) i++;
    const a = shots[i];
    const b = shots[i + 1];
    const p = easeInOutCubic((t - a.t) / (b.t - a.t));
    return {
      t,
      cx: a.cx + (b.cx - a.cx) * p,
      cy: a.cy + (b.cy - a.cy) * p,
      s: a.s + (b.s - a.s) * p,
    };
  })();

  // Constant micro-drift so held framings are never static
  const s = cam.s * (1 + frame * 0.00005);

  const sweepFrames = 16; // per highlight line
  const hlStartF = highlightStart * fps;

  const ulStartF = (underline?.start ?? 0) * fps;
  const ulProgress = underline
    ? easeInOutCubic(clamp01((frame - ulStartF) / 22))
    : 0;

  return (
    <FernFrame kenBurns={false}>
      {/* camera space */}
      <div
        style={{
          position: "absolute",
          transformOrigin: "0 0",
          transform: `translate(${W / 2 - cam.cx * s}px, ${H / 2 - cam.cy * s}px) scale(${s})`,
        }}
      >
        {/* the clipping itself */}
        <div
          style={{
            position: "relative",
            width: imgW,
            height: imgH,
            boxShadow: "0 30px 90px rgba(0,0,0,0.75)",
            outline: `1px solid rgba(0,0,0,0.4)`,
          }}
        >
          <Img
            src={staticFile(src)}
            style={{
              width: imgW,
              height: imgH,
              display: "block",
              // sit the white page into the warm Fern world
              filter: "saturate(0.9) sepia(0.08) brightness(0.97)",
            }}
          />
          {/* rust underline draw-on (article space) */}
          {underline && (
            <div
              style={{
                position: "absolute",
                left: underline.x,
                top: underline.y,
                width: underline.w * ulProgress,
                height: 5,
                background: FERN.rust,
                opacity: 0.9,
              }}
            />
          )}
          {/* yellow sweep highlights, line by line */}
          {highlights.map((h, i) => {
            const p = easeOutCubic(
              clamp01((frame - (hlStartF + i * sweepFrames)) / sweepFrames)
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: h.x - 3,
                  top: h.y - 2,
                  width: (h.w + 6) * p,
                  height: h.h + 4,
                  background: "#ffff00",
                  mixBlendMode: "multiply",
                }}
              />
            );
          })}
        </div>
      </div>
      {/* screen-space furniture — charcoal chips so they read over the white page */}
      {kicker && (
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 64,
            background: "rgba(24,22,19,0.88)",
            borderLeft: `4px solid ${FERN.rust}`,
            padding: "12px 22px",
          }}
        >
          <Kicker text={kicker} start={6} />
        </div>
      )}
      {source && (
        <div
          style={{
            position: "absolute",
            left: 90,
            bottom: 54,
            background: "rgba(24,22,19,0.88)",
            padding: "10px 18px",
            fontFamily: FERN.monoFont,
            fontSize: 24,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: FERN.dim,
            opacity: interpolate(frame, [20, 35], [0, 0.9], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          SOURCE · {source}
        </div>
      )}
    </FernFrame>
  );
};
