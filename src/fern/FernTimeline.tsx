import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FernFrame } from "./FernFrame";
import { Kicker, SourceTag, StaggerLines } from "./components";
import { FERN, easeInOutCubic } from "./theme";

export const TOTAL_FRAMES = 300; // default 10s

export type TimelineEvent = {
  year: string;
  label: string;
  sub?: string;
  /** 0..1 position along the line; evenly spaced if omitted */
  pos?: number;
};

export type FernTimelineProps = {
  durationInFrames?: number;
  kicker?: string;
  title?: string;
  events: TimelineEvent[];
  source?: string;
};

const LINE_Y = 640;
const LINE_X0 = 200;
const LINE_X1 = 1720;

export const FernTimeline: React.FC<FernTimelineProps> = ({
  kicker,
  title,
  events,
  source,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineStart = title ? 30 : 14;
  const lineDur = 40;
  const lineP = easeInOutCubic((frame - lineStart) / lineDur);

  const positions = events.map((e, i) =>
    e.pos !== undefined ? e.pos : events.length === 1 ? 0.5 : i / (events.length - 1)
  );

  return (
    <FernFrame>
      <div style={{ position: "absolute", left: 120, top: 100 }}>
        {kicker ? <Kicker text={kicker} start={0} /> : null}
        {title ? (
          <div style={{ marginTop: 16 }}>
            <StaggerLines lines={[title]} start={8} fontSize={80} />
          </div>
        ) : null}
      </div>

      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Base line draws left -> right */}
        <line
          x1={LINE_X0}
          y1={LINE_Y}
          x2={LINE_X0 + (LINE_X1 - LINE_X0) * lineP}
          y2={LINE_Y}
          stroke={FERN.dim}
          strokeWidth={3}
          opacity={0.85}
        />
        {events.map((e, i) => {
          const x = LINE_X0 + (LINE_X1 - LINE_X0) * positions[i];
          // Node appears once the drawing line has passed it
          const nodeStart = lineStart + lineDur * positions[i] + 4;
          const p = spring({ frame: frame - nodeStart, fps, config: { damping: 200 } });
          return (
            <g key={i} opacity={p}>
              <circle cx={x} cy={LINE_Y} r={13} fill={FERN.rust} />
              <circle
                cx={x}
                cy={LINE_Y}
                r={interpolate(p, [0, 1], [13, 26])}
                fill="none"
                stroke={FERN.rust}
                strokeWidth={2}
                opacity={interpolate(p, [0, 1], [0.8, 0])}
              />
            </g>
          );
        })}
      </svg>

      {events.map((e, i) => {
        const x = LINE_X0 + (LINE_X1 - LINE_X0) * positions[i];
        const nodeStart = lineStart + lineDur * positions[i] + 6;
        const p = spring({ frame: frame - nodeStart, fps, config: { damping: 200 } });
        const up = i % 2 === 0; // alternate above/below for dense timelines
        const width = 420;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: Math.min(Math.max(x - width / 2, 40), 1920 - width - 40),
              top: up ? LINE_Y - 250 : LINE_Y + 60,
              width,
              textAlign: "center",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [up ? 18 : -18, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FERN.headlineFont,
                fontWeight: 700,
                fontStretch: "condensed",
                fontSize: 76,
                color: FERN.cream,
                lineHeight: 1,
              }}
            >
              {e.year}
            </div>
            <div
              style={{
                marginTop: 12,
                fontFamily: FERN.monoFont,
                fontSize: 26,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: FERN.dim,
                lineHeight: 1.4,
              }}
            >
              {e.label}
            </div>
            {e.sub ? (
              <div
                style={{
                  marginTop: 8,
                  fontFamily: FERN.headlineFont,
                  fontWeight: 300,
                  fontSize: 28,
                  color: FERN.rust,
                }}
              >
                {e.sub}
              </div>
            ) : null}
          </div>
        );
      })}

      {source ? <SourceTag text={source} start={lineStart + lineDur} /> : null}
    </FernFrame>
  );
};
