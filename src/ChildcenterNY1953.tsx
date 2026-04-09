import { Img, staticFile } from "remotion";

export const TOTAL_FRAMES = 1;

type Segment = { text: string; highlight?: boolean };

const Para: React.FC<{ segments: Segment[]; style?: React.CSSProperties }> = ({
  segments,
  style,
}) => (
  <p style={{ margin: 0, lineHeight: 1.65, ...style }}>
    {segments.map((seg, i) =>
      seg.highlight ? (
        <span key={i} style={{ backgroundColor: "#ffff00" }}>
          {seg.text}
        </span>
      ) : (
        <span key={i}>{seg.text}</span>
      ),
    )}
  </p>
);

export const ChildcenterNY1953: React.FC = () => {
  return (
    <div
      style={{
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "90px 72px",
        fontFamily: "Georgia, 'Times New Roman', serif",
        boxSizing: "border-box",
      }}
    >
      {/* ── Logo (real image) ── */}
      <Img
        src={staticFile("childcenter_logo.png")}
        style={{ width: "100%", marginBottom: 48 }}
      />

      {/* Divider */}
      <div
        style={{ height: 2, background: "#e0e0e0", marginBottom: 56 }}
      />

      {/* First paragraph */}
      <Para
        style={{
          fontSize: 42,
          color: "#1a1a1a",
          marginBottom: 52,
          fontFamily: "Georgia, serif",
        }}
        segments={[
          { text: "Founded in 1953", highlight: true },
          { text: " as a children's counseling center in Queens, " },
          {
            text: "The Child Center of NY has become a powerful community presence in all five boroughs and Long Island.",
            highlight: true,
          },
          { text: " With " },
          {
            text: "more than 70 locations and 100 programs in NYC's",
            highlight: true,
          },
          {
            text: " most under-served communities, our 1,000+ results-oriented professionals make a difference ",
          },
          {
            text: "for nearly 60,000 New Yorkers of all ages and their families each year.",
            highlight: true,
          },
        ]}
      />

      {/* Second paragraph */}
      <p
        style={{
          margin: 0,
          fontSize: 40,
          color: "#1a1a1a",
          lineHeight: 1.65,
          fontFamily: "Georgia, serif",
        }}
      >
        We know that with the right skills, education, and emotional support —
        tools that we provide — children and adults of any background can build a
        happy, healthy, and fulfilling future.
      </p>
    </div>
  );
};
