import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FernFrame } from "./FernFrame";
import { Kicker, PhotoCard, PhotoCardData, RustUnderline, SourceTag } from "./components";
import { FERN, STAGGER_FRAMES } from "./theme";

export const TOTAL_FRAMES = 270; // default 9s

export type FernQuoteCardProps = {
  durationInFrames?: number;
  kicker?: string;
  quote: string;
  attribution: string;
  /** dim context line under attribution */
  sub?: string;
  photo?: PhotoCardData;
  source?: string;
  fontSize?: number;
};

// Break quote into visual lines of roughly maxChars characters.
const wrap = (text: string, maxChars: number): string[] => {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars && cur) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
};

export const FernQuoteCard: React.FC<FernQuoteCardProps> = ({
  kicker,
  quote,
  attribution,
  sub,
  photo,
  source,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hasPhoto = Boolean(photo);
  const maxChars = hasPhoto ? 24 : 30;
  const lines = wrap(quote, maxChars);
  const size = fontSize ?? Math.min(92, lines.length > 4 ? 68 : 84);

  const markIn = spring({ frame, fps, config: { damping: 200 } });
  const linesStart = 8;
  const attrStart = linesStart + lines.length * STAGGER_FRAMES + 8;
  const attrP = spring({ frame: frame - attrStart, fps, config: { damping: 200 } });

  return (
    <FernFrame>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 0,
          bottom: 0,
          width: hasPhoto ? 980 : 1600,
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
        {/* Big rust quote mark */}
        <div
          style={{
            fontFamily: FERN.serifFont,
            fontSize: 150,
            lineHeight: 0.6,
            color: FERN.rust,
            opacity: markIn,
            transform: `translateY(${interpolate(markIn, [0, 1], [20, 0])}px)`,
            marginBottom: 22,
          }}
        >
          “
        </div>
        {lines.map((line, i) => {
          const p = spring({
            frame: frame - linesStart - i * STAGGER_FRAMES,
            fps,
            config: { damping: 200 },
          });
          return (
            <div
              key={i}
              style={{
                fontFamily: FERN.serifFont,
                fontSize: size,
                lineHeight: 1.22,
                color: FERN.cream,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [22, 0])}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
        <RustUnderline start={attrStart - 4} width={340} thickness={6} />
        <div
          style={{
            marginTop: 26,
            fontFamily: FERN.monoFont,
            fontSize: 30,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: FERN.cream,
            opacity: attrP,
            transform: `translateY(${interpolate(attrP, [0, 1], [16, 0])}px)`,
          }}
        >
          {attribution}
        </div>
        {sub ? (
          <div
            style={{
              marginTop: 12,
              fontFamily: FERN.headlineFont,
              fontWeight: 300,
              fontSize: 34,
              color: FERN.dim,
              opacity: attrP,
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
      {photo ? <PhotoCard card={photo} start={attrStart + 6} /> : null}
      {source ? <SourceTag text={source} start={attrStart + 14} /> : null}
    </FernFrame>
  );
};
