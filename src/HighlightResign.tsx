import { useCurrentFrame, useVideoConfig, interpolate, Easing, OffthreadVideo, staticFile, Img } from "remotion";

const SPEECH_DURATION = 10; // seconds — full sweep "250,000" → "RESIGN"
const PRE_PAUSE = 0.5;
const POST_HOLD = 0.5;

export const TOTAL_FRAMES = Math.ceil((PRE_PAUSE + SPEECH_DURATION + POST_HOLD) * 30);

// Original screenshot: 1196×332 — scale to fit 1920px wide
const S = 1920 / 1196;
const IMG_H = Math.round(332 * S); // 533
const IMG_TOP = 20;

// Video placed below the screenshot
const VIDEO_TOP = IMG_TOP + IMG_H + 30; // 583
const VIDEO_SIZE = 1000; // 1000×1000 square
const VIDEO_LEFT = Math.round(33 * S); // align with text left edge

// Engagement stats row below the video
const STATS_TOP = VIDEO_TOP + VIDEO_SIZE + 36; // 1619
const STATS_HEIGHT = 56;

const CANVAS_H = STATS_TOP + STATS_HEIGHT + 24; // 1699

// Highlight regions in original-image coords (detected from pixel scan)
const LINES = [
	{ x: Math.round(33 * S),  y: IMG_TOP + Math.round(126 * S), x2: Math.round(1143 * S), y2: IMG_TOP + Math.round(159 * S) },
	{ x: Math.round(34 * S),  y: IMG_TOP + Math.round(175 * S), x2: Math.round(450 * S),  y2: IMG_TOP + Math.round(207 * S) },
];

const LINE_W = LINES.map((l) => l.x2 - l.x);
const TOTAL_W = LINE_W.reduce((a, b) => a + b, 0);
const BREAKPOINTS = LINE_W.reduce<number[]>((acc, w, i) => {
	acc.push((i === 0 ? 0 : acc[i - 1]) + w / TOTAL_W);
	return acc;
}, []);

// X engagement-row icon stroke color (muted gray)
const ICON_COLOR = "#71767b";

const ICON_SIZE = 36;
const TEXT_FONT = `${ICON_SIZE - 6}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

const IconReply: React.FC = () => (
	<svg viewBox="0 0 24 24" width={ICON_SIZE} height={ICON_SIZE} fill={ICON_COLOR} aria-hidden>
		<path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
	</svg>
);

const IconRepost: React.FC = () => (
	<svg viewBox="0 0 24 24" width={ICON_SIZE} height={ICON_SIZE} fill={ICON_COLOR} aria-hidden>
		<path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
	</svg>
);

const IconLike: React.FC = () => (
	<svg viewBox="0 0 24 24" width={ICON_SIZE} height={ICON_SIZE} fill={ICON_COLOR} aria-hidden>
		<path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.030-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
	</svg>
);

const IconView: React.FC = () => (
	<svg viewBox="0 0 24 24" width={ICON_SIZE} height={ICON_SIZE} fill={ICON_COLOR} aria-hidden>
		<path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
	</svg>
);

const IconBookmark: React.FC = () => (
	<svg viewBox="0 0 24 24" width={ICON_SIZE} height={ICON_SIZE} fill={ICON_COLOR} aria-hidden>
		<path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />
	</svg>
);

const IconShare: React.FC = () => (
	<svg viewBox="0 0 24 24" width={ICON_SIZE} height={ICON_SIZE} fill={ICON_COLOR} aria-hidden>
		<path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.29 3.3-1.42-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
	</svg>
);

const StatItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
	<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
		{icon}
		<span style={{ color: ICON_COLOR, font: TEXT_FONT }}>{label}</span>
	</div>
);

export const HighlightResign: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const startFrame = PRE_PAUSE * fps;
	const endFrame = (PRE_PAUSE + SPEECH_DURATION) * fps;

	const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.inOut(Easing.ease),
	});

	const lineWidths = LINES.map((line, i) => {
		const lineStart = i === 0 ? 0 : BREAKPOINTS[i - 1];
		const lineEnd = BREAKPOINTS[i];
		if (progress <= lineStart) return 0;
		if (progress >= lineEnd) return line.x2 - line.x;
		return ((progress - lineStart) / (lineEnd - lineStart)) * (line.x2 - line.x);
	});

	return (
		<div style={{ width: 1920, height: CANVAS_H, background: "#000", position: "relative" }}>
			{/* Tweet header + text screenshot */}
			<Img
				src={staticFile("liz_churchill_resign.png")}
				style={{
					position: "absolute",
					top: IMG_TOP,
					left: 0,
					width: 1920,
					height: IMG_H,
				}}
			/>

			{/* Highlight bars (inverted screenshot + multiply gives yellow bg with black text) */}
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
							overflow: "hidden",
							isolation: "isolate",
						}}
					>
						<div style={{ position: "absolute", inset: 0, backgroundColor: "#ffff00" }} />
						<Img
							src={staticFile("liz_churchill_resign.png")}
							style={{
								position: "absolute",
								top: IMG_TOP - line.y,
								left: -line.x,
								width: 1920,
								height: IMG_H,
								filter: "invert(1)",
								mixBlendMode: "multiply",
							}}
						/>
					</div>
				);
			})}

			{/* Embedded tweet video, live, with rounded corners like X */}
			<div
				style={{
					position: "absolute",
					top: VIDEO_TOP,
					left: VIDEO_LEFT,
					width: VIDEO_SIZE,
					height: VIDEO_SIZE,
					borderRadius: 24,
					overflow: "hidden",
					border: `1px solid #2f3336`,
				}}
			>
				<OffthreadVideo
					src={staticFile("liz_tweet_video.mp4")}
					muted
					style={{ width: "100%", height: "100%", objectFit: "cover" }}
				/>
			</div>

			{/* Engagement stats row — matches X's feed-style icon row */}
			<div
				style={{
					position: "absolute",
					top: STATS_TOP,
					left: VIDEO_LEFT,
					width: VIDEO_SIZE,
					height: STATS_HEIGHT,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<StatItem icon={<IconReply />} label="413" />
				<StatItem icon={<IconRepost />} label="7.5K" />
				<StatItem icon={<IconLike />} label="20K" />
				<StatItem icon={<IconView />} label="98K" />
				<div style={{ display: "flex", alignItems: "center", gap: 24 }}>
					<IconBookmark />
					<IconShare />
				</div>
			</div>
		</div>
	);
};
