import React from "react";
import { useCurrentFrame } from "remotion";
import { FernFrame } from "./FernFrame";
import { Kicker, RustUnderline, SourceTag, StaggerLines, useRiseIn } from "./components";
import { FERN, STAGGER_FRAMES } from "./theme";

export const TOTAL_FRAMES = 240; // default 8s @ 30fps

export type FernTitleCardProps = {
  durationInFrames?: number;
  kicker?: string;
  lines: string[];
  sub?: string;
  /** second dim line under sub */
  sub2?: string;
  source?: string;
  fontSize?: number;
};

export const FernTitleCard: React.FC<FernTitleCardProps> = ({
  kicker,
  lines,
  sub,
  sub2,
  source,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  void frame;
  const maxChars = Math.max(...lines.map((l) => l.length), 1);
  // Auto-shrink long lines to stay within ~86% of frame width
  const size = fontSize ?? Math.min(150, Math.floor(1650 / (maxChars * 0.52)));
  const linesStart = kicker ? 10 : 0;
  const underlineStart = linesStart + lines.length * STAGGER_FRAMES + 6;
  const subStart = underlineStart + 10;
  const subStyle = useRiseIn(subStart, 18);
  const sub2Style = useRiseIn(subStart + 12, 18);

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
          <div style={{ marginBottom: 38 }}>
            <Kicker text={kicker} start={0} />
          </div>
        ) : null}
        <StaggerLines lines={lines} start={linesStart} fontSize={size} />
        <RustUnderline start={underlineStart} width={Math.min(560, maxChars * size * 0.28)} />
        {sub ? (
          <div
            style={{
              marginTop: 40,
              fontFamily: FERN.headlineFont,
              fontWeight: 300,
              fontSize: 46,
              letterSpacing: "1px",
              color: FERN.dim,
              ...subStyle,
            }}
          >
            {sub}
          </div>
        ) : null}
        {sub2 ? (
          <div
            style={{
              marginTop: 14,
              fontFamily: FERN.headlineFont,
              fontWeight: 300,
              fontSize: 40,
              color: FERN.dim,
              ...sub2Style,
            }}
          >
            {sub2}
          </div>
        ) : null}
      </div>
      {source ? <SourceTag text={source} start={subStart + 10} /> : null}
    </FernFrame>
  );
};
