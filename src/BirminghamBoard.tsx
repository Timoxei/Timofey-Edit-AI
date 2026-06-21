import {
	AbsoluteFill,
	Audio,
	Easing,
	Img,
	interpolate,
	Loop,
	OffthreadVideo,
	staticFile,
	useCurrentFrame,
} from "remotion";

const FPS = 30;
const DURATION_SEC = 56;
export const TOTAL_FRAMES = DURATION_SEC * FPS;

const VIEW_W = 1920;
const VIEW_H = 1080;
const BOARD_W = 7200;
const BOARD_H = 1200;

// Fern palette
const BG_TOP = "#181613";
const BG_BOTTOM = "#0F0E0C";
const PAPER_BG = "#E8DEC8";
const PAPER_INK = "#2B2620";
const PAPER_DIM = "#7a6f5c";
const RUST = "#C2492A";

const HEAD_FONT =
	'"Arial Narrow", "Helvetica Neue", "Liberation Sans", Helvetica, Arial, sans-serif';
const MONO_FONT = '"Courier New", ui-monospace, Menlo, Consolas, monospace';

// ---- Camera keyframes (time in seconds → x position of viewport left edge) ----
const CAM_KEYS: { t: number; x: number }[] = [
	{ t: 0, x: 0 },
	{ t: 9, x: 0 },
	{ t: 16.5, x: 1700 },
	{ t: 19, x: 1900 },
	{ t: 22.5, x: 3400 },
	{ t: 29, x: 3700 },
	{ t: 33.5, x: 4230 },
	{ t: 36, x: 4660 },
	{ t: 56, x: 4660 },
];

const sampleCameraX = (frame: number) => {
	const t = frame / FPS;
	for (let i = 0; i < CAM_KEYS.length - 1; i++) {
		const a = CAM_KEYS[i];
		const b = CAM_KEYS[i + 1];
		if (t >= a.t && t <= b.t) {
			return interpolate(t, [a.t, b.t], [a.x, b.x], {
				easing: Easing.bezier(0.42, 0, 0.58, 1),
			});
		}
	}
	return CAM_KEYS[CAM_KEYS.length - 1].x;
};

// ---- Reusable: paper photo card ----
const PhotoCard: React.FC<{
	src?: string;
	videoSrc?: string;
	videoDurationFrames?: number;
	x: number;
	y: number;
	w: number;
	rot: number;
	caption?: string;
	kicker?: string;
	revealAt: number; // frame when it starts showing
	pinColor?: string;
	tapeColor?: string;
}> = ({
	src,
	videoSrc,
	videoDurationFrames,
	x,
	y,
	w,
	rot,
	caption,
	kicker,
	revealAt,
	pinColor,
	tapeColor,
}) => {
	const frame = useCurrentFrame();
	const local = frame - revealAt;
	const t = interpolate(local, [0, 18], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const settle = interpolate(local, [0, 22], [1.06, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	const h = (w * 9) / 16;
	const captionH = caption ? 56 : 0;
	const cardW = w + 36;
	const cardH = h + 36 + captionH;

	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y,
				width: cardW,
				height: cardH,
				transform: `rotate(${rot}deg) scale(${settle})`,
				transformOrigin: "center",
				opacity: t,
				filter:
					"drop-shadow(0 12px 18px rgba(0,0,0,0.55)) drop-shadow(0 3px 4px rgba(0,0,0,0.45))",
			}}
		>
			{kicker ? (
				<div
					style={{
						position: "absolute",
						top: -34,
						left: 10,
						fontFamily: MONO_FONT,
						fontSize: 18,
						letterSpacing: 4,
						color: "#d6cbb1",
						textTransform: "uppercase",
						textShadow: "0 2px 4px rgba(0,0,0,0.6)",
					}}
				>
					{kicker}
				</div>
			) : null}
			<div
				style={{
					width: cardW,
					height: cardH,
					background: "#f4ecd6",
					padding: 18,
					boxSizing: "border-box",
					border: "1px solid rgba(0,0,0,0.18)",
				}}
			>
				<div
					style={{
						width: w,
						height: h,
						overflow: "hidden",
						background: "#000",
					}}
				>
					{videoSrc && videoDurationFrames ? (
						<Loop durationInFrames={videoDurationFrames}>
							<OffthreadVideo
								src={videoSrc}
								muted
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
									filter: "saturate(0.92) contrast(1.02)",
								}}
							/>
						</Loop>
					) : src ? (
						<Img
							src={src}
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								filter: "saturate(0.92) contrast(1.02)",
							}}
						/>
					) : null}
				</div>
				{caption ? (
					<div
						style={{
							marginTop: 10,
							fontFamily: MONO_FONT,
							fontSize: 22,
							color: PAPER_INK,
							letterSpacing: 1.5,
							textAlign: "center",
							textTransform: "uppercase",
						}}
					>
						{caption}
					</div>
				) : null}
			</div>
			{/* pin */}
			{pinColor ? (
				<div
					style={{
						position: "absolute",
						left: cardW / 2 - 10,
						top: -8,
						width: 20,
						height: 20,
						borderRadius: 999,
						background: `radial-gradient(circle at 35% 30%, #fff 0%, ${pinColor} 45%, #5a1a0a 100%)`,
						boxShadow: "0 4px 6px rgba(0,0,0,0.55)",
					}}
				/>
			) : null}
			{/* tape strip */}
			{tapeColor ? (
				<div
					style={{
						position: "absolute",
						left: cardW / 2 - 60,
						top: -14,
						width: 120,
						height: 30,
						background: tapeColor,
						opacity: 0.78,
						boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
					}}
				/>
			) : null}
		</div>
	);
};

// ---- Reusable: paper note card with text ----
const NoteCard: React.FC<{
	x: number;
	y: number;
	w: number;
	rot: number;
	revealAt: number;
	headline?: string;
	body?: string;
	footer?: string;
	kicker?: string;
	tint?: string;
}> = ({ x, y, w, rot, revealAt, headline, body, footer, kicker, tint }) => {
	const frame = useCurrentFrame();
	const local = frame - revealAt;
	const op = interpolate(local, [0, 22], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const settle = interpolate(local, [0, 22], [1.05, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const isDark = tint != null && tint !== PAPER_BG;
	const inkColor = isDark ? "#E9E1CF" : PAPER_INK;
	const dimColor = isDark ? "#9a9180" : PAPER_DIM;
	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y,
				width: w,
				transform: `rotate(${rot}deg) scale(${settle})`,
				transformOrigin: "center",
				opacity: op,
				filter:
					"drop-shadow(0 10px 14px rgba(0,0,0,0.5)) drop-shadow(0 3px 4px rgba(0,0,0,0.4))",
			}}
		>
			{kicker ? (
				<div
					style={{
						fontFamily: MONO_FONT,
						fontSize: 16,
						letterSpacing: 5,
						color: "#d6cbb1",
						textTransform: "uppercase",
						marginBottom: 10,
						textShadow: "0 2px 4px rgba(0,0,0,0.6)",
					}}
				>
					{kicker}
				</div>
			) : null}
			<div
				style={{
					background: tint ?? PAPER_BG,
					padding: "28px 34px",
					border: "1px solid rgba(0,0,0,0.12)",
					boxSizing: "border-box",
				}}
			>
				{headline ? (
					<div
						style={{
							fontFamily: HEAD_FONT,
							fontWeight: 900,
							fontSize: 56,
							lineHeight: 1.02,
							color: inkColor,
							textTransform: "uppercase",
							letterSpacing: 0.5,
							whiteSpace: "pre-line",
						}}
					>
						{headline}
					</div>
				) : null}
				{body ? (
					<div
						style={{
							marginTop: 14,
							fontFamily: MONO_FONT,
							fontSize: 26,
							lineHeight: 1.35,
							color: inkColor,
							letterSpacing: 0.5,
						}}
					>
						{body}
					</div>
				) : null}
				{footer ? (
					<div
						style={{
							marginTop: 20,
							fontFamily: MONO_FONT,
							fontSize: 20,
							color: dimColor,
							letterSpacing: 2,
							textTransform: "uppercase",
						}}
					>
						{footer}
					</div>
				) : null}
			</div>
		</div>
	);
};

// ---- "Red string" between two points ----
const RedString: React.FC<{
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	revealAt: number;
}> = ({ x1, y1, x2, y2, revealAt }) => {
	const frame = useCurrentFrame();
	const local = frame - revealAt;
	const grow = interpolate(local, [0, 30], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.bezier(0.42, 0, 0.58, 1),
	});
	const dx = x2 - x1;
	const dy = y2 - y1;
	const len = Math.sqrt(dx * dx + dy * dy);
	const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
	return (
		<div
			style={{
				position: "absolute",
				left: x1,
				top: y1,
				width: len * grow,
				height: 4,
				background: RUST,
				transform: `rotate(${angle}deg)`,
				transformOrigin: "0 50%",
				opacity: 0.85,
				boxShadow: "0 2px 3px rgba(0,0,0,0.45)",
				zIndex: 0,
			}}
		/>
	);
};

// ---- Cork board background ----
const Board: React.FC = () => {
	return (
		<>
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"radial-gradient(120% 80% at 50% 40%, #6b4f2a 0%, #4a361d 60%, #2c1f10 100%)",
				}}
			/>
			{/* paper-fiber noise via SVG */}
			<svg
				width="100%"
				height="100%"
				style={{ position: "absolute", inset: 0, opacity: 0.35, mixBlendMode: "multiply" }}
			>
				<filter id="cork-noise">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.9"
						numOctaves="2"
						stitchTiles="stitch"
					/>
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.1  0 0 0 0.9 0"
					/>
				</filter>
				<rect width="100%" height="100%" filter="url(#cork-noise)" />
			</svg>
			{/* warm vignette */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"radial-gradient(80% 60% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)",
				}}
			/>
		</>
	);
};

// ---- Grain overlay (animated noise) ----
const Grain: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = (frame % 30) * 0.1;
	return (
		<svg
			width="100%"
			height="100%"
			style={{
				position: "absolute",
				inset: 0,
				opacity: 0.08,
				mixBlendMode: "overlay",
				pointerEvents: "none",
			}}
		>
			<filter id={`grain-${frame}`}>
				<feTurbulence
					type="fractalNoise"
					baseFrequency="1.8"
					numOctaves="1"
					seed={seed}
					stitchTiles="stitch"
				/>
				<feColorMatrix
					type="matrix"
					values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"
				/>
			</filter>
			<rect width="100%" height="100%" filter={`url(#grain-${frame})`} />
		</svg>
	);
};

export const BirminghamBoard: React.FC = () => {
	const frame = useCurrentFrame();

	const camX = sampleCameraX(frame);
	const zoom = interpolate(frame, [0, TOTAL_FRAMES], [1.0, 1.045]);

	// Global fade in / fade out
	const fadeIn = interpolate(frame, [0, 18], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const fadeOut = interpolate(
		frame,
		[TOTAL_FRAMES - 30, TOTAL_FRAMES],
		[1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
	);
	const fade = Math.min(fadeIn, fadeOut);

	return (
		<AbsoluteFill style={{ background: BG_BOTTOM, overflow: "hidden" }}>
			<AbsoluteFill style={{ opacity: fade }}>
				{/* warm bg gradient under everything */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_BOTTOM} 100%)`,
					}}
				/>
				{/* The CAMERA: translates the board */}
				<div
					style={{
						position: "absolute",
						left: -camX,
						top: (VIEW_H - BOARD_H) / 2,
						width: BOARD_W,
						height: BOARD_H,
						transform: `scale(${zoom})`,
						transformOrigin: `${camX + VIEW_W / 2}px ${BOARD_H / 2}px`,
					}}
				>
					<Board />

					{/* ===== ZONE 1: PERFUME VENDOR / CERTAINTY (0–9s) ===== */}
					<PhotoCard
						videoSrc={staticFile("birmingham/clips/vendor.mp4")}
						videoDurationFrames={90}
						x={160}
						y={260}
						w={900}
						rot={-1.5}
						revealAt={6}
						kicker="EXHIBIT A · ALUM ROCK RD · 2025"
						caption="THE INTERVIEW"
						pinColor={RUST}
					/>
					<NoteCard
						x={1180}
						y={300}
						w={620}
						rot={2.2}
						revealAt={60}
						kicker="QUOTE — VERBATIM"
						headline={'"THE WORLD WILL\nEVENTUALLY BECOME\nFULLY MUSLIM."'}
						footer="— perfume vendor"
					/>

					{/* ===== ZONE 2: BEFORE / AFTER (10–18s) ===== */}
					<NoteCard
						x={1900}
						y={140}
						w={1400}
						rot={-0.4}
						revealAt={285}
						headline={"BEFORE & AFTER"}
						body={"Same streets. Different city."}
						tint={"#1a1612"}
					/>
					<PhotoCard
						videoSrc={staticFile("birmingham/clips/old_bus.mp4")}
						videoDurationFrames={150}
						x={1960}
						y={400}
						w={620}
						rot={-2.5}
						revealAt={310}
						kicker="ARCHIVE · c. 1965"
						caption="BIRMINGHAM — THEN"
						pinColor={RUST}
					/>
					<PhotoCard
						x={2680}
						y={400}
						w={620}
						rot={2.0}
						videoSrc={staticFile("birmingham/clips/halal.mp4")}
						videoDurationFrames={51}
						revealAt={340}
						kicker="FIELD · 2025"
						caption="BIRMINGHAM — NOW"
						pinColor={RUST}
					/>
					<RedString
						x1={2580}
						y1={620}
						x2={2700}
						y2={620}
						revealAt={380}
					/>

					{/* ===== ZONE 3: INVESTIGATION / FIELD NOTE (19–34s) ===== */}
					<NoteCard
						x={3500}
						y={140}
						w={950}
						rot={-0.8}
						revealAt={555}
						kicker="FIELD NOTE"
						headline={"ASK THEM\nWHAT THEY SEE."}
						footer="show them the old footage"
					/>
					<PhotoCard
						videoSrc={staticFile("birmingham/clips/nate.mp4")}
						videoDurationFrames={150}
						x={3500}
						y={520}
						w={380}
						rot={-3.0}
						revealAt={600}
						caption="THE INVESTIGATOR"
						pinColor={RUST}
					/>
					<PhotoCard
						videoSrc={staticFile("birmingham/clips/old_mini.mp4")}
						videoDurationFrames={150}
						x={3920}
						y={520}
						w={680}
						rot={2.0}
						revealAt={680}
						kicker="km6nab · ARCHIVE"
						caption="OLD BIRMINGHAM · 16mm"
						tapeColor="#d7c89a"
					/>
					<PhotoCard
						videoSrc={staticFile("birmingham/clips/niqab_street.mp4")}
						videoDurationFrames={180}
						x={4670}
						y={150}
						w={520}
						rot={1.8}
						revealAt={770}
						caption="MARKET STREET · 2025"
						pinColor={RUST}
					/>

					{/* ===== ZONE 4: APPROACH / BENGALI (35–47s) ===== */}
					<NoteCard
						x={5050}
						y={140}
						w={1100}
						rot={-0.6}
						revealAt={1020}
						kicker="ENCOUNTER · 0:34"
						headline={'"WHAT LANGUAGE\nDO YOU SPEAK?"'}
						footer="— field interview"
					/>
					<PhotoCard
						videoSrc={staticFile("birmingham/clips/approach.mp4")}
						videoDurationFrames={90}
						x={5100}
						y={520}
						w={620}
						rot={-1.6}
						revealAt={1080}
						kicker="ALUM ROCK RD"
						caption="THE APPROACH"
						pinColor={RUST}
					/>
					<NoteCard
						x={5800}
						y={560}
						w={380}
						rot={2.8}
						revealAt={1260}
						tint={"#1a1612"}
						headline={"BENGALI."}
						footer="recorded answer"
					/>
					<RedString
						x1={5720}
						y1={700}
						x2={5800}
						y2={660}
						revealAt={1320}
					/>
				</div>

				<Grain />

				{/* corner kicker label fixed to viewport */}
				<div
					style={{
						position: "absolute",
						top: 38,
						left: 48,
						fontFamily: MONO_FONT,
						fontSize: 16,
						letterSpacing: 6,
						color: "#cdc3a8",
						textTransform: "uppercase",
						opacity: 0.85,
					}}
				>
					CASE FILE · BIRMINGHAM · NO. 06
				</div>
				<div
					style={{
						position: "absolute",
						top: 62,
						left: 48,
						width: 80,
						height: 2,
						background: RUST,
					}}
				/>
			</AbsoluteFill>

			<Audio src={staticFile("birmingham/narration.m4a")} />
		</AbsoluteFill>
	);
};
