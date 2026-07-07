import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FernFrame } from "./FernFrame";
import { Kicker, SourceTag, StaggerLines } from "./components";
import { FERN, STAGGER_FRAMES, easeInOutCubic } from "./theme";

export const TOTAL_FRAMES = 300; // default 10s

export type RouteStop = {
  label: string;
  sub?: string; // e.g. "AGE 15 · NIGHT SCHOOL"
};

export type Bloc = {
  title: string;
  items: string[];
  accent?: boolean; // rust title
};

export type FernMapRouteProps = {
  durationInFrames?: number;
  kicker?: string;
  title?: string;
  /** journey mode: stops connected by a drawing dashed arc */
  stops?: RouteStop[];
  /** blocs mode: opposing column groups (e.g. Non-Aligned vs powers) */
  blocs?: Bloc[];
  source?: string;
};

const ROUTE_Y = 620;

/** Abstract graticule backdrop — suggests a map without claiming geography. */
const Graticule: React.FC = () => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{ position: "absolute", inset: 0, opacity: 0.12 }}
  >
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse
        key={`m${i}`}
        cx={960}
        cy={ROUTE_Y}
        rx={240 + i * 240}
        ry={(240 + i * 240) * 0.42}
        fill="none"
        stroke={FERN.dim}
        strokeWidth={1.5}
      />
    ))}
    {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
      <line
        key={`v${i}`}
        x1={960 + i * 260}
        y1={ROUTE_Y - 420}
        x2={960 + i * 260}
        y2={ROUTE_Y + 420}
        stroke={FERN.dim}
        strokeWidth={1}
      />
    ))}
  </svg>
);

export const FernMapRoute: React.FC<FernMapRouteProps> = ({
  kicker,
  title,
  stops,
  blocs,
  source,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headerEnd = title ? 34 : 14;

  return (
    <FernFrame>
      <Graticule />
      <div style={{ position: "absolute", left: 120, top: 100 }}>
        {kicker ? <Kicker text={kicker} start={0} /> : null}
        {title ? (
          <div style={{ marginTop: 16 }}>
            <StaggerLines lines={[title]} start={8} fontSize={80} />
          </div>
        ) : null}
      </div>

      {stops && stops.length > 1 ? (
        <>
          <svg
            width={1920}
            height={1080}
            viewBox="0 0 1920 1080"
            style={{ position: "absolute", inset: 0 }}
          >
            {stops.slice(0, -1).map((_, i) => {
              const n = stops.length;
              const x0 = 260 + (1400 / (n - 1)) * i;
              const x1 = 260 + (1400 / (n - 1)) * (i + 1);
              const segStart = headerEnd + 14 + i * 34;
              const p = easeInOutCubic((frame - segStart) / 30);
              const cx = (x0 + x1) / 2;
              const cy = ROUTE_Y - 150;
              return (
                <path
                  key={i}
                  d={`M ${x0} ${ROUTE_Y} Q ${cx} ${cy} ${x1} ${ROUTE_Y}`}
                  fill="none"
                  stroke={FERN.rust}
                  strokeWidth={4}
                  strokeLinecap="round"
                  opacity={p > 0 ? 0.95 : 0}
                  pathLength={1}
                  strokeDasharray={`${p} 1`}
                />
              );
            })}
            {stops.map((_, i) => {
              const n = stops.length;
              const x = 260 + (1400 / (n - 1)) * i;
              const nodeStart = headerEnd + 8 + i * 34;
              const p = spring({ frame: frame - nodeStart, fps, config: { damping: 200 } });
              return (
                <g key={`n${i}`} opacity={p}>
                  <circle cx={x} cy={ROUTE_Y} r={14} fill={FERN.rust} />
                  <circle
                    cx={x}
                    cy={ROUTE_Y}
                    r={interpolate(p, [0, 1], [14, 30])}
                    fill="none"
                    stroke={FERN.rust}
                    strokeWidth={2}
                    opacity={interpolate(p, [0, 1], [0.7, 0])}
                  />
                </g>
              );
            })}
          </svg>
          {stops.map((s, i) => {
            const n = stops.length;
            const x = 260 + (1400 / (n - 1)) * i;
            const nodeStart = headerEnd + 10 + i * 34;
            const p = spring({ frame: frame - nodeStart, fps, config: { damping: 200 } });
            const up = i % 2 === 0;
            const width = 400;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: Math.min(Math.max(x - width / 2, 30), 1920 - width - 30),
                  top: up ? ROUTE_Y + 60 : ROUTE_Y - 220,
                  width,
                  textAlign: "center",
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [up ? -16 : 16, 0])}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FERN.headlineFont,
                    fontWeight: 700,
                    fontStretch: "condensed",
                    textTransform: "uppercase",
                    fontSize: 54,
                    color: FERN.cream,
                    lineHeight: 1.05,
                  }}
                >
                  {s.label}
                </div>
                {s.sub ? (
                  <div
                    style={{
                      marginTop: 10,
                      fontFamily: FERN.monoFont,
                      fontSize: 24,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: FERN.dim,
                    }}
                  >
                    {s.sub}
                  </div>
                ) : null}
              </div>
            );
          })}
        </>
      ) : null}

      {blocs && blocs.length ? (
        <div
          style={{
            position: "absolute",
            left: 140,
            right: 140,
            top: 340,
            display: "flex",
            gap: 60,
            justifyContent: "center",
          }}
        >
          {blocs.map((b, i) => {
            const start = headerEnd + 10 + i * (STAGGER_FRAMES + 4);
            const p = spring({ frame: frame - start, fps, config: { damping: 200 } });
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  maxWidth: 520,
                  border: `1px solid ${b.accent ? FERN.rust : FERN.dim}`,
                  padding: "36px 40px",
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
                  background: "rgba(0,0,0,0.25)",
                }}
              >
                <div
                  style={{
                    fontFamily: FERN.headlineFont,
                    fontWeight: 700,
                    fontStretch: "condensed",
                    textTransform: "uppercase",
                    fontSize: 44,
                    color: b.accent ? FERN.rust : FERN.cream,
                    marginBottom: 24,
                  }}
                >
                  {b.title}
                </div>
                {b.items.map((item, j) => {
                  const ip = spring({
                    frame: frame - start - 10 - j * 8,
                    fps,
                    config: { damping: 200 },
                  });
                  return (
                    <div
                      key={j}
                      style={{
                        fontFamily: FERN.monoFont,
                        fontSize: 28,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: FERN.dim,
                        lineHeight: 1.9,
                        opacity: ip,
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : null}

      {source ? <SourceTag text={source} start={headerEnd + 40} /> : null}
    </FernFrame>
  );
};
