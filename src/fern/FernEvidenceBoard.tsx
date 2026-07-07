import React from "react";
import { FernFrame } from "./FernFrame";
import { Kicker, PhotoCard, PhotoCardData, RedString, SourceTag, StaggerLines } from "./components";
import { STAGGER_FRAMES } from "./theme";

export const TOTAL_FRAMES = 330; // default 11s

export type StringLink = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  sag?: number;
};

export type FernEvidenceBoardProps = {
  durationInFrames?: number;
  kicker?: string;
  title?: string;
  cards: PhotoCardData[];
  /** rust string connectors, drawn after all cards settle (coords in 1920x1080) */
  strings?: StringLink[];
  source?: string;
};

export const FernEvidenceBoard: React.FC<FernEvidenceBoardProps> = ({
  kicker,
  title,
  cards,
  strings = [],
  source,
}) => {
  const cardsStart = title ? 26 : 12;
  const stringsStart = cardsStart + cards.length * STAGGER_FRAMES + 12;

  return (
    <FernFrame>
      {/* Header, top-left */}
      <div style={{ position: "absolute", left: 120, top: 84 }}>
        {kicker ? <Kicker text={kicker} start={0} /> : null}
        {title ? (
          <div style={{ marginTop: 16 }}>
            <StaggerLines lines={[title]} start={8} fontSize={72} />
          </div>
        ) : null}
      </div>

      {/* Strings behind cards' pins but above bg */}
      {strings.map((s, i) => (
        <RedString
          key={`s${i}`}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          sag={s.sag}
          start={stringsStart + i * 10}
        />
      ))}

      {cards.map((card, i) => (
        <PhotoCard key={i} card={card} start={cardsStart + i * STAGGER_FRAMES} />
      ))}

      {source ? <SourceTag text={source} start={stringsStart + 10} /> : null}
    </FernFrame>
  );
};
