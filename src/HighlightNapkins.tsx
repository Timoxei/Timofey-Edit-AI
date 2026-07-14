import { Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const SCREENSHOT = "napkins_tweet.png";
const IMG_WIDTH = 1484;
const IMG_HEIGHT = 695;

const COMP_WIDTH = 1920;
const COMP_HEIGHT = 1080;
const SWEEP_DURATION = 2.5;
const PRE_PAUSE = 0.5;
const POST_HOLD = 1;

const S = COMP_WIDTH / IMG_WIDTH;
const IMG_H = Math.round(IMG_HEIGHT * S);
const IMG_TOP = Math.round((COMP_HEIGHT - IMG_H) / 2);

export const TOTAL_FRAMES = Math.ceil((PRE_PAUSE + SWEEP_DURATION + POST_HOLD) * 30);

const LINES = [
	{
		x: Math.round(42 * S),
		y: IMG_TOP + Math.round(206 * S),
		x2: Math.round(1272 * S),
		y2: IMG_TOP + Math.round(275 * S),
	},
	{
		x: Math.round(40 * S),
		y: IMG_TOP + Math.round(294 * S),
		x2: Math.round(1179 * S),
		y2: IMG_TOP + Math.round(349 * S),
	},
];

const LINE_W = LINES.map((l) => l.x2 - l.x);
const TOTAL_W = LINE_W.reduce((a, b) => a + b, 0);
const BREAKPOINTS = LINE_W.reduce<number[]>((acc, w, i) => {
	acc.push((i === 0 ? 0 : acc[i - 1]) + w / TOTAL_W);
	return acc;
}, []);

export const HighlightNapkins: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const progress = interpolate(
		frame,
		[PRE_PAUSE * fps, (PRE_PAUSE + SWEEP_DURATION) * fps],
		[0, 1],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.inOut(Easing.quad),
		},
	);

	const lineWidths = LINES.map((line, i) => {
		const start = i === 0 ? 0 : BREAKPOINTS[i - 1];
		const end = BREAKPOINTS[i];
		if (progress <= start) return 0;
		if (progress >= end) return line.x2 - line.x;
		return ((progress - start) / (end - start)) * (line.x2 - line.x);
	});

	return (
		<div
			style={{
				width: COMP_WIDTH,
				height: COMP_HEIGHT,
				background: "#fff",
				position: "relative",
			}}
		>
			<div
				style={{
					position: "absolute",
					top: IMG_TOP,
					left: 0,
					width: COMP_WIDTH,
					height: IMG_H,
					backgroundImage: `url(${staticFile(SCREENSHOT)})`,
					backgroundSize: `${COMP_WIDTH}px ${IMG_H}px`,
					backgroundRepeat: "no-repeat",
				}}
			/>

			{LINES.map((line, i) => {
				const w = lineWidths[i];
				if (w <= 0) return null;
				return (
					<div
						key={i}
						style={{
							position: "absolute",
							top: line.y,
							left: line.x,
							width: w,
							height: line.y2 - line.y,
							backgroundColor: "#ffff00",
							mixBlendMode: "multiply",
						}}
					/>
				);
			})}
		</div>
	);
};
