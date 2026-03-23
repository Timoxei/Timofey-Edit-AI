import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Layout
const CELL_SIZE = 150;
const GRID_SIZE = CELL_SIZE * 3; // 450

// SVG stroke lengths
const X_STROKE_LENGTH = 70 * Math.SQRT2; // line (15,15)→(85,85) in 100×100 viewBox
const O_STROKE_LENGTH = 2 * Math.PI * 38; // circle r=38

// Game moves: X wins the main diagonal [0,0]→[1,1]→[2,2]
const MOVES: Array<{ row: number; col: number; player: "X" | "O" }> = [
  { row: 1, col: 1, player: "X" },
  { row: 0, col: 2, player: "O" },
  { row: 0, col: 0, player: "X" },
  { row: 2, col: 0, player: "O" },
  { row: 2, col: 2, player: "X" },
];

const INITIAL_DELAY = 25;
const FRAMES_PER_MOVE = 45;

function moveStartFrame(i: number) {
  return INITIAL_DELAY + i * FRAMES_PER_MOVE;
}

// Win line: center of (0,0) → center of (2,2)
const WIN_X1 = CELL_SIZE / 2;
const WIN_Y1 = CELL_SIZE / 2;
const WIN_X2 = GRID_SIZE - CELL_SIZE / 2;
const WIN_Y2 = GRID_SIZE - CELL_SIZE / 2;
const WIN_LINE_LENGTH = Math.sqrt((WIN_X2 - WIN_X1) ** 2 + (WIN_Y2 - WIN_Y1) ** 2);

const WIN_LINE_START = moveStartFrame(MOVES.length) + 10;
const WIN_TEXT_START = WIN_LINE_START + 25;
export const TOTAL_FRAMES = WIN_TEXT_START + 90;

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Board entrance
  const boardSpring = spring({ frame, fps, config: { damping: 200 } });
  const titleY = interpolate(boardSpring, [0, 1], [-20, 0]);

  // Per-move draw-on progress
  const moveProgs = MOVES.map((_, i) =>
    spring({ frame: frame - moveStartFrame(i), fps, config: { damping: 200 } }),
  );

  // Win line draw-on
  const winLineSpring = spring({
    frame: frame - WIN_LINE_START,
    fps,
    config: { damping: 200 },
  });
  const winLineDashOffset = interpolate(winLineSpring, [0, 1], [WIN_LINE_LENGTH, 0]);

  // Win text bounce-in
  const winTextSpring = spring({
    frame: frame - WIN_TEXT_START,
    fps,
    config: { damping: 8 },
  });
  const winTextOpacity = interpolate(
    frame,
    [WIN_TEXT_START, WIN_TEXT_START + 5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0d0d1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* Title */}
      <div
        style={{
          color: "#ffffff",
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: 8,
          marginBottom: 48,
          opacity: boardSpring,
          transform: `translateY(${titleY}px)`,
        }}
      >
        TIC TAC TOE
      </div>

      {/* Board */}
      <div
        style={{
          position: "relative",
          width: GRID_SIZE,
          height: GRID_SIZE,
          transform: `scale(${boardSpring})`,
        }}
      >
        {/* Grid lines */}
        {[1, 2].map((i) => (
          <React.Fragment key={i}>
            {/* Vertical */}
            <div
              style={{
                position: "absolute",
                left: i * CELL_SIZE - 3,
                top: 0,
                width: 6,
                height: GRID_SIZE,
                backgroundColor: "#3a3a5c",
                borderRadius: 3,
              }}
            />
            {/* Horizontal */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: i * CELL_SIZE - 3,
                width: GRID_SIZE,
                height: 6,
                backgroundColor: "#3a3a5c",
                borderRadius: 3,
              }}
            />
          </React.Fragment>
        ))}

        {/* Symbols */}
        {MOVES.map(({ row, col, player }, i) => {
          if (frame < moveStartFrame(i)) return null;
          const prog = moveProgs[i];
          return (
            <div
              key={`${row}-${col}`}
              style={{
                position: "absolute",
                left: col * CELL_SIZE,
                top: row * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {player === "X" ? (
                <svg width={90} height={90} viewBox="0 0 100 100">
                  <line
                    x1="15"
                    y1="15"
                    x2="85"
                    y2="85"
                    stroke="#ff6b6b"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={X_STROKE_LENGTH}
                    strokeDashoffset={interpolate(prog, [0, 1], [X_STROKE_LENGTH, 0])}
                  />
                  <line
                    x1="85"
                    y1="15"
                    x2="15"
                    y2="85"
                    stroke="#ff6b6b"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={X_STROKE_LENGTH}
                    strokeDashoffset={interpolate(prog, [0, 1], [X_STROKE_LENGTH, 0])}
                  />
                </svg>
              ) : (
                <svg width={90} height={90} viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#4ecdc4"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={O_STROKE_LENGTH}
                    strokeDashoffset={interpolate(prog, [0, 1], [O_STROKE_LENGTH, 0])}
                  />
                </svg>
              )}
            </div>
          );
        })}

        {/* Win line */}
        {frame >= WIN_LINE_START && (
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: GRID_SIZE,
              height: GRID_SIZE,
              overflow: "visible",
            }}
          >
            <line
              x1={WIN_X1}
              y1={WIN_Y1}
              x2={WIN_X2}
              y2={WIN_Y2}
              stroke="#ffd700"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={WIN_LINE_LENGTH}
              strokeDashoffset={winLineDashOffset}
            />
          </svg>
        )}
      </div>

      {/* Win text */}
      {frame >= WIN_TEXT_START && (
        <div
          style={{
            color: "#ffd700",
            fontSize: 64,
            fontWeight: 700,
            marginTop: 48,
            letterSpacing: 4,
            transform: `scale(${winTextSpring})`,
            opacity: winTextOpacity,
          }}
        >
          X WINS!
        </div>
      )}
    </div>
  );
};
