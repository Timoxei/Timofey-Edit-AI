import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FernFrame } from "./FernFrame";
import { Kicker, RustUnderline, SourceTag, StaggerLines } from "./components";
import { FERN, STAGGER_FRAMES, easeOutCubic } from "./theme";

export const TOTAL_FRAMES = 300; // default 10s

export type Stat = {
  value: number;
  prefix?: string; // "$"
  suffix?: string; // "M", "%"
  label: string;
  decimals?: number;
};

export type FernStatCounterProps = {
  durationInFrames?: number;
  kicker?: string;
  title?: string;
  stats: Stat[];
  /** small mono chips (e.g. client names) fading in under the stats */
  chips?: string[];
  source?: string;
};

const fmt = (v: number, decimals = 0) =>
  v.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

export const FernStatCounter: React.FC<FernStatCounterProps> = ({
  kicker,
  title,
  stats,
  chips,
  source,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const single = stats.length === 1;
  const statsStart = title ? 34 : 16;
  const chipsStart = statsStart + stats.length * STAGGER_FRAMES + 24;

  return (
    <FernFrame>
      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {kicker ? (
          <div style={{ marginBottom: 30 }}>
            <Kicker text={kicker} start={0} />
          </div>
        ) : null}
        {title ? <StaggerLines lines={[title]} start={8} fontSize={72} /> : null}

        <div
          style={{
            display: "flex",
            gap: single ? 0 : 90,
            marginTop: title ? 70 : 0,
            justifyContent: single ? "center" : "flex-start",
            textAlign: single ? "center" : "left",
          }}
        >
          {stats.map((s, i) => {
            const start = statsStart + i * STAGGER_FRAMES;
            const appear = spring({ frame: frame - start, fps, config: { damping: 200 } });
            const countP = easeOutCubic((frame - start) / 50);
            const val = s.value * countP;
            const size = single ? 230 : Math.min(150, 520 / stats.length + 60);
            return (
              <div
                key={i}
                style={{
                  opacity: appear,
                  transform: `translateY(${interpolate(appear, [0, 1], [24, 0])}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: FERN.headlineFont,
                    fontWeight: 700,
                    fontStretch: "condensed",
                    fontSize: size,
                    lineHeight: 1,
                    color: FERN.cream,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.prefix ?? ""}
                  {fmt(val, s.decimals ?? 0)}
                  {s.suffix ?? ""}
                </div>
                <RustUnderline start={start + 24} width={single ? 420 : 200} thickness={6} />
                <div
                  style={{
                    marginTop: 20,
                    fontFamily: FERN.monoFont,
                    fontSize: single ? 34 : 26,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: FERN.dim,
                  }}
                >
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {chips && chips.length ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              marginTop: 70,
              justifyContent: single ? "center" : "flex-start",
            }}
          >
            {chips.map((c, i) => {
              const p = spring({
                frame: frame - chipsStart - i * 6,
                fps,
                config: { damping: 200 },
              });
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: FERN.monoFont,
                    fontSize: 26,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: FERN.cream,
                    border: `1px solid ${FERN.dim}`,
                    padding: "10px 22px",
                    opacity: p * 0.9,
                    transform: `translateY(${interpolate(p, [0, 1], [14, 0])}px)`,
                  }}
                >
                  {c}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      {source ? <SourceTag text={source} start={chipsStart} /> : null}
    </FernFrame>
  );
};
