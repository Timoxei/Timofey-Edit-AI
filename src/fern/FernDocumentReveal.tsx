import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FernFrame } from "./FernFrame";
import { Kicker, Redaction, SourceTag } from "./components";
import { FERN, STAGGER_FRAMES } from "./theme";

export const TOTAL_FRAMES = 300; // default 10s

export type DocLine = {
  /** Runs of █ (one or more) become sliding redaction bars (width = count * 22px). */
  text: string;
  /** substring to mark with a rust highlight box after the line lands */
  highlight?: string;
};

export type FernDocumentRevealProps = {
  durationInFrames?: number;
  kicker?: string;
  docTitle: string;
  docSub?: string;
  lines: DocLine[];
  /** rotated rust stamp, e.g. "POTENTIALLY DANGEROUS" */
  stamp?: string;
  source?: string;
};

const REDACT_RE = /(█+)/g;

const LineContent: React.FC<{ line: DocLine; start: number; fontSize: number }> = ({
  line,
  start,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const parts = line.text.split(REDACT_RE);
  const hlStart = start + 14;
  const hlP = interpolate(frame, [hlStart, hlStart + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {parts.map((part, i) => {
        if (/^█+$/.test(part)) {
          return <Redaction key={i} start={start + 6} width={part.length * 22} height={fontSize * 0.9} />;
        }
        if (line.highlight && part.includes(line.highlight)) {
          const [before, after] = part.split(line.highlight);
          return (
            <React.Fragment key={i}>
              {before}
              <span
                style={{
                  position: "relative",
                  whiteSpace: "nowrap",
                }}
              >
                {line.highlight}
                <span
                  style={{
                    position: "absolute",
                    left: -6,
                    right: -6,
                    top: -3,
                    bottom: -3,
                    border: `3px solid ${FERN.rust}`,
                    opacity: hlP,
                    transform: `scale(${interpolate(hlP, [0, 1], [1.12, 1])})`,
                  }}
                />
              </span>
              {after}
            </React.Fragment>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

export const FernDocumentReveal: React.FC<FernDocumentRevealProps> = ({
  kicker,
  docTitle,
  docSub,
  lines,
  stamp,
  source,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const paperIn = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const linesStart = 26;
  const stampStart = linesStart + lines.length * STAGGER_FRAMES + 14;
  const stampP = spring({ frame: frame - stampStart, fps, config: { damping: 200 } });

  const fontSize = lines.length > 7 ? 30 : 36;

  return (
    <FernFrame>
      {kicker ? (
        <div style={{ position: "absolute", left: 120, top: 90 }}>
          <Kicker text={kicker} start={0} />
        </div>
      ) : null}

      {/* Paper document */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          width: 1150,
          transform: `translate(-50%, -50%) rotate(-1deg) translateY(${interpolate(
            paperIn,
            [0, 1],
            [40, 0]
          )}px)`,
          opacity: paperIn,
          background: `linear-gradient(180deg, #EFE8D6 0%, ${FERN.paper} 100%)`,
          boxShadow: "0 30px 70px rgba(0,0,0,0.65)",
          padding: "60px 80px 70px",
          boxSizing: "border-box",
          color: FERN.ink,
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontFamily: FERN.monoFont,
            fontSize: 34,
            letterSpacing: "4px",
            textTransform: "uppercase",
            borderBottom: `3px solid ${FERN.ink}`,
            paddingBottom: 18,
            marginBottom: 8,
          }}
        >
          {docTitle}
        </div>
        {docSub ? (
          <div
            style={{
              textAlign: "center",
              fontFamily: FERN.monoFont,
              fontSize: 22,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#5A5348",
              marginBottom: 26,
              paddingTop: 10,
            }}
          >
            {docSub}
          </div>
        ) : (
          <div style={{ marginBottom: 26 }} />
        )}

        {lines.map((line, i) => {
          const start = linesStart + i * STAGGER_FRAMES;
          const p = spring({ frame: frame - start, fps, config: { damping: 200 } });
          return (
            <div
              key={i}
              style={{
                fontFamily: FERN.monoFont,
                fontSize,
                lineHeight: 1.75,
                opacity: p,
              }}
            >
              <LineContent line={line} start={start} fontSize={fontSize} />
            </div>
          );
        })}
      </div>

      {/* Stamp */}
      {stamp ? (
        <div
          style={{
            position: "absolute",
            right: 260,
            top: 200,
            transform: `rotate(-12deg) scale(${interpolate(stampP, [0, 1], [1.3, 1])})`,
            opacity: stampP * 0.92,
            border: `6px solid ${FERN.rust}`,
            color: FERN.rust,
            fontFamily: FERN.monoFont,
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "6px",
            textTransform: "uppercase",
            padding: "16px 30px",
            boxShadow: "inset 0 0 0 2px rgba(194,73,42,0.4)",
          }}
        >
          {stamp}
        </div>
      ) : null}

      {source ? <SourceTag text={source} start={stampStart} /> : null}
    </FernFrame>
  );
};
