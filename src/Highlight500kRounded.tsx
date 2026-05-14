import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";

// 00:00:33:08 → 00:00:37:16 at 30fps = 128 frames = 4.267s
const SPEECH_DURATION = 128 / 30;
const PRE_PAUSE = 0.5;
const POST_HOLD = 0.5;

export const TOTAL_FRAMES = Math.ceil((PRE_PAUSE + SPEECH_DURATION + POST_HOLD) * 30);

const S = 1920 / 1567;
const IMG_H = Math.round(389 * S);
const IMG_TOP = Math.round((1080 - IMG_H) / 2);

const LINES = [
	{ x: Math.round(58 * S), y: IMG_TOP + Math.round(37 * S), x2: Math.round(1304 * S), y2: IMG_TOP + Math.round(112 * S) },
	{ x: Math.round(57 * S), y: IMG_TOP + Math.round(125 * S), x2: Math.round(1413 * S), y2: IMG_TOP + Math.round(200 * S) },
	{ x: Math.round(58 * S), y: IMG_TOP + Math.round(220 * S), x2: Math.round(269 * S),  y2: IMG_TOP + Math.round(271 * S) },
];

const BREAKPOINTS = [6 / 11, 10 / 11, 1];

// Corner radius — scales with line height so it looks proportional
const RADIUS = 10;

export const Highlight500kRounded: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const startFrame = PRE_PAUSE * fps;
	const endFrame = (PRE_PAUSE + SPEECH_DURATION) * fps;

	const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const lineWidths = LINES.map((line, i) => {
		const lineStart = i === 0 ? 0 : BREAKPOINTS[i - 1];
		const lineEnd = BREAKPOINTS[i];
		if (progress <= lineStart) return 0;
		if (progress >= lineEnd) return line.x2 - line.x;
		return ((progress - lineStart) / (lineEnd - lineStart)) * (line.x2 - line.x);
	});

	return (
		<div style={{ width: 1920, height: 1080, background: "white", position: "relative" }}>
			<Img
				src={staticFile("spain_500k.png")}
				style={{ position: "absolute", top: IMG_TOP, left: 0, width: 1920, height: IMG_H }}
			/>
			{LINES.map((line, i) => {
				const w = lineWidths[i];
				if (w <= 0) return null;
				const h = line.y2 - line.y;
				// Only show rounded corners once the rect is wide enough to display them cleanly
				const r = Math.min(RADIUS, w / 2, h / 2);
				return (
					<div
						key={i}
						style={{
							position: "absolute",
							top: line.y,
							left: line.x,
							width: w,
							height: h,
							backgroundColor: "#ffff00",
							mixBlendMode: "multiply",
							borderRadius: r,
						}}
					/>
				);
			})}
		</div>
	);
};
