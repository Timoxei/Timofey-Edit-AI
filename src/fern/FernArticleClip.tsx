import React from "react";
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FERN, clamp01, easeInOutCubic, easeOutCubic } from "./theme";
import { FernFrame } from "./FernFrame";
import { PhotoCard, PhotoCardData, PushPin } from "./components";

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

type HighlightRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** seconds; overrides the staggered highlightStart sequence for this rect */
  start?: number;
};

/** A second article snippet pinned on the desk, with its own highlights. */
type PinnedClipping = {
  src: string;
  /** natural CSS size of the snippet capture */
  imgW: number;
  imgH: number;
  /** top-left position in article coordinate space */
  x: number;
  y: number;
  rot?: number;
  /** seconds at which the snippet pins in */
  start: number;
  /** highlight rects in snippet space; each needs an absolute start (seconds) */
  highlights?: HighlightRect[];
  string?: { x1: number; y1: number; x2: number; y2: number; sag?: number; start?: number };
};

/** Evidence photo pinned beside the clipping, in article coordinate space. */
type PinnedPhoto = PhotoCardData & {
  /** seconds at which the photo pins in */
  start: number;
  /** rust string drawn in article space, e.g. from the photo pin to the headline */
  string?: { x1: number; y1: number; x2: number; y2: number; sag?: number; start?: number };
};

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
  /** evidence photos pinned on the desk next to the clipping (article space) */
  photos?: PinnedPhoto[];
  /** additional article snippets pinned on the desk, with their own highlights */
  clippings?: PinnedClipping[];
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
  photos = [],
  clippings = [],
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
            const startF = h.start !== undefined ? h.start * fps : hlStartF + i * sweepFrames;
            const p = easeOutCubic(clamp01((frame - startF) / sweepFrames));
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
        {/* second article snippets pinned on the desk, with their own highlights */}
        {clippings.map((c, ci) => {
          const startF = c.start * fps;
          const pIn = spring({ frame: frame - startF, fps, config: { damping: 200 } });
          const settle = 1.05 - 0.05 * pIn;
          const str = c.string;
          const strStartF = (str?.start ?? c.start + 0.4) * fps;
          const sag = str?.sag ?? 50;
          const len = str ? Math.hypot(str.x2 - str.x1, str.y2 - str.y1) * 1.1 : 0;
          const strP = str ? easeOutCubic(clamp01((frame - strStartF) / 24)) : 0;
          const svgW = imgW + 3000;
          return (
            <React.Fragment key={`clip-${ci}`}>
              {str && (
                <svg
                  width={svgW}
                  height={imgH + 1000}
                  viewBox={`0 0 ${svgW} ${imgH + 1000}`}
                  style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 2 }}
                >
                  <path
                    d={`M ${str.x1} ${str.y1} Q ${(str.x1 + str.x2) / 2} ${Math.max(str.y1, str.y2) + sag} ${str.x2} ${str.y2}`}
                    fill="none"
                    stroke={FERN.rust}
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeDasharray={len}
                    strokeDashoffset={len * (1 - strP)}
                    opacity={strP > 0 ? 0.95 : 0}
                  />
                </svg>
              )}
              <div
                style={{
                  position: "absolute",
                  left: c.x,
                  top: c.y,
                  width: c.imgW,
                  height: c.imgH,
                  transform: `rotate(${c.rot ?? 0}deg) scale(${settle})`,
                  opacity: pIn,
                  boxShadow: "0 24px 70px rgba(0,0,0,0.7)",
                  outline: "1px solid rgba(0,0,0,0.4)",
                  zIndex: 3,
                }}
              >
                <PushPin />
                <Img
                  src={staticFile(c.src)}
                  style={{
                    width: c.imgW,
                    height: c.imgH,
                    display: "block",
                    filter: "saturate(0.9) sepia(0.08) brightness(0.97)",
                  }}
                />
                {(c.highlights ?? []).map((h, i) => {
                  const hs = (h.start ?? 0) * fps;
                  const p = easeOutCubic(clamp01((frame - hs) / sweepFrames));
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
            </React.Fragment>
          );
        })}
        {/* evidence photos pinned on the desk beside the clipping */}
        {photos.map((ph, i) => {
          const startF = ph.start * fps;
          const str = ph.string;
          const strStartF = (str?.start ?? ph.start + 0.4) * fps;
          const sag = str?.sag ?? 60;
          const len = str ? Math.hypot(str.x2 - str.x1, str.y2 - str.y1) * 1.1 : 0;
          const strP = str ? easeOutCubic(clamp01((frame - strStartF) / 24)) : 0;
          const svgW = imgW + 3000;
          return (
            <React.Fragment key={`photo-${i}`}>
              {str && (
                <svg
                  width={svgW}
                  height={imgH}
                  viewBox={`0 0 ${svgW} ${imgH}`}
                  style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 2 }}
                >
                  <path
                    d={`M ${str.x1} ${str.y1} Q ${(str.x1 + str.x2) / 2} ${Math.max(str.y1, str.y2) + sag} ${str.x2} ${str.y2}`}
                    fill="none"
                    stroke={FERN.rust}
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeDasharray={len}
                    strokeDashoffset={len * (1 - strP)}
                    opacity={strP > 0 ? 0.95 : 0}
                  />
                </svg>
              )}
              <PhotoCard card={ph} start={startF} />
            </React.Fragment>
          );
        })}
      </div>
    </FernFrame>
  );
};
