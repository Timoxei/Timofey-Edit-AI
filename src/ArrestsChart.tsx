export const TOTAL_FRAMES = 1;

// Vertical (1080x1920) rebuild of the ABC7 "Approximate Arrests for
// Online/Social Media Posts" bar chart, with enlarged phone-readable text.

const DATA: { country: string; value: number }[] = [
  { country: "United Kingdom", value: 12183 },
  { country: "Belarus", value: 6205 },
  { country: "Germany", value: 3500 },
  { country: "China", value: 1500 },
  { country: "Turkey", value: 500 },
  { country: "Russia", value: 400 },
  { country: "Poland", value: 300 },
  { country: "Thailand", value: 258 },
  { country: "Brazil", value: 200 },
  { country: "Syria", value: 146 },
  { country: "India", value: 100 },
  { country: "Iran", value: 100 },
  { country: "France", value: 54 },
  { country: "United States", value: 50 },
  { country: "Vietnam", value: 45 },
  { country: "Egypt", value: 20 },
  { country: "Saudi Arabia", value: 15 },
  { country: "Azerbaijan", value: 13 },
  { country: "Hungary", value: 10 },
];

const MAX = 14000;
const TICKS = [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000];
const BAR = "#2e3d4f";
const COUNTRY_W = 250;
const ROW_H = 70;
const fmt = (n: number) => n.toLocaleString("en-US");

export const ArrestsChart: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        padding: "70px 34px 44px",
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        color: "#1e1e1e",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 54,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.2,
          marginBottom: 40,
        }}
      >
        Approximate Arrests for Online/Social Media Posts
      </div>

      {/* Chart */}
      <div style={{ position: "relative", flex: 1 }}>
        {/* Gridlines */}
        <div style={{ position: "absolute", left: COUNTRY_W, right: 0, top: 0, bottom: 0 }}>
          {TICKS.map((t) => (
            <div
              key={t}
              style={{
                position: "absolute",
                left: `${(t / MAX) * 100}%`,
                top: 0,
                bottom: 0,
                width: t === 0 ? 3 : 2,
                background: t === 0 ? "#3a3a3a" : "#dcdcdc",
              }}
            />
          ))}
        </div>

        {/* Rows */}
        {DATA.map((d) => {
          const pct = (d.value / MAX) * 100;
          const inside = pct > 58;
          return (
            <div
              key={d.country}
              style={{ display: "flex", alignItems: "center", height: ROW_H }}
            >
              <div
                style={{
                  width: COUNTRY_W,
                  textAlign: "right",
                  paddingRight: 18,
                  fontSize: 32,
                  color: "#2a2a2a",
                }}
              >
                {d.country}
              </div>
              <div style={{ flex: 1, position: "relative", height: "100%" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: 0,
                    width: `${pct}%`,
                    minWidth: 3,
                    height: 44,
                    background: BAR,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {inside && (
                    <span style={{ color: "#fff", fontSize: 30, fontWeight: 600, paddingRight: 14 }}>
                      {fmt(d.value)}
                    </span>
                  )}
                </div>
                {!inside && (
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                      left: `calc(${pct}% + 12px)`,
                      fontSize: 30,
                      fontWeight: 600,
                      color: "#2a2a2a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmt(d.value)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* X axis */}
      <div style={{ display: "flex", marginTop: 8 }}>
        <div style={{ width: COUNTRY_W }} />
        <div style={{ flex: 1, position: "relative", height: 44 }}>
          {TICKS.map((t) => (
            <span
              key={t}
              style={{
                position: "absolute",
                left: `${(t / MAX) * 100}%`,
                transform: "translateX(-50%)",
                fontSize: 26,
                color: "#444",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: COUNTRY_W }} />
        <div style={{ flex: 1, textAlign: "center", fontSize: 30, color: "#2a2a2a", marginTop: 6 }}>
          Number of Arrests (Reported/Estimated)
        </div>
      </div>

      {/* Source */}
      <div
        style={{
          marginTop: 30,
          textAlign: "right",
          fontSize: 30,
          fontWeight: 700,
          color: "#555",
          letterSpacing: 1,
        }}
      >
        Source: ABC7
      </div>
    </div>
  );
};
