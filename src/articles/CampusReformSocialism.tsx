import { Img, staticFile } from "remotion";

export const TOTAL_FRAMES = 1;
export const HEIGHT = 1200;

const BAR = "#2b2b2b";

const Quote: React.FC<{ children: React.ReactNode; highlight?: boolean }> = ({
  children,
  highlight,
}) => (
  <div style={{ display: "flex", gap: 28 }}>
    <div style={{ width: 10, background: BAR, flexShrink: 0 }} />
    <div
      style={{
        fontSize: 45,
        fontWeight: 700,
        lineHeight: 1.45,
        color: "#111",
        paddingTop: 2,
      }}
    >
      <span style={highlight ? { backgroundColor: "#ffff00", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", padding: "6px 4px" } : undefined}>
        {children}
      </span>
    </div>
  </div>
);

export const CampusReformSocialism: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* Black header bar */}
      <div
        style={{
          background: "#000",
          height: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 44px",
          flexShrink: 0,
        }}
      >
        <Img
          src={staticFile("campusreform_logo.png")}
          style={{ height: 86, width: "auto" }}
        />
        {/* hamburger menu */}
        <div
          style={{
            width: 64,
            height: 64,
            border: "3px solid #fff",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 34, height: 4, background: "#fff" }} />
          ))}
        </div>
      </div>

      {/* Article content */}
      <div style={{ padding: "90px 56px 90px", display: "flex", flexDirection: "column" }}>
        <h1
          style={{
            margin: 0,
            fontSize: 92,
            fontWeight: 700,
            lineHeight: 1.18,
            color: "#0a0a0a",
            letterSpacing: "-1px",
          }}
        >
          Survey: Nearly two-thirds of young Americans support socialism
        </h1>

        <div style={{ height: 70 }} />

        <Quote highlight>
          The survey found 62 percent of American adults under age 30 hold a
          &#39;favorable&#39; view of socialism.
        </Quote>

        <div style={{ height: 48 }} />

        <Quote>
          34 percent of American adults under age 30 hold a &#39;favorable&#39;
          view of communism.
        </Quote>
      </div>
    </div>
  );
};
