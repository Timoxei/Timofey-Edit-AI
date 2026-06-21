import {
	AbsoluteFill,
	Audio,
	Easing,
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

// Wide board on a tall vertical canvas
const BOARD_W = 1920;
const BOARD_H = 6800;

// Camera = translateY on board (board scrolls UP past viewport).
// camY ranges 0 (showing top of board) → MAX (showing bottom).
const MAX_CAM_Y = BOARD_H - VIEW_H - 400;

// Perspective tilt
const TILT_DEG = 22;

// Fern palette
const PAPER_BG = "#ece3cc";
const PAPER_INK = "#2B2620";
const PAPER_DIM = "#7a6f5c";
const RUST = "#C2492A";

const HEAD_FONT =
	'"Arial Narrow", "Helvetica Neue", "Liberation Sans", Helvetica, Arial, sans-serif';
const MONO_FONT = '"Courier New", ui-monospace, Menlo, Consolas, monospace';

// ---- Camera keyframes: t (s) -> camY (px scrolled) ----
const CAM_KEYS: { t: number; y: number }[] = [
	{ t: 0, y: 0 },
	{ t: 7, y: 250 },
	{ t: 11, y: 950 },
	{ t: 18, y: 1700 },
	{ t: 22, y: 2400 },
	{ t: 29, y: 3200 },
	{ t: 31, y: 3850 }, // arrive on Zone 4 burqa as "Sorry to bother you" begins
	{ t: 42, y: 4250 },
	{ t: 48, y: 4900 },
	{ t: 52, y: 5400 }, // land on burqa shopping
	{ t: 56, y: 5500 }, // hold burqa shopping centered
];

const sampleCamY = (frame: number) => {
	const t = frame / FPS;
	for (let i = 0; i < CAM_KEYS.length - 1; i++) {
		const a = CAM_KEYS[i];
		const b = CAM_KEYS[i + 1];
		if (t >= a.t && t <= b.t) {
			return interpolate(t, [a.t, b.t], [a.y, b.y], {
				easing: Easing.bezier(0.42, 0, 0.58, 1),
			});
		}
	}
	return CAM_KEYS[CAM_KEYS.length - 1].y;
};

// ---- Paper photo / video card ----
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
	revealAt: number;
	pinColor?: string;
	tapeColor?: string;
	ratio?: number; // height = w * ratio (default 9/16)
}> = ({
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
	ratio = 9 / 16,
}) => {
	const frame = useCurrentFrame();
	const local = frame - revealAt;
	const op = interpolate(local, [0, 18], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const settle = interpolate(local, [0, 22], [1.06, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	const h = w * ratio;
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
				opacity: op,
				filter:
					"drop-shadow(0 28px 22px rgba(0,0,0,0.55)) drop-shadow(0 6px 8px rgba(0,0,0,0.45))",
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
						textShadow: "0 2px 4px rgba(0,0,0,0.8)",
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
						boxShadow: "0 4px 6px rgba(0,0,0,0.6)",
					}}
				/>
			) : null}
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

// ---- Paper note card with text ----
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
	headlineSize?: number;
}> = ({
	x,
	y,
	w,
	rot,
	revealAt,
	headline,
	body,
	footer,
	kicker,
	tint,
	headlineSize = 56,
}) => {
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
					"drop-shadow(0 24px 18px rgba(0,0,0,0.55)) drop-shadow(0 5px 6px rgba(0,0,0,0.45))",
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
						textShadow: "0 2px 4px rgba(0,0,0,0.8)",
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
							fontSize: headlineSize,
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

// ---- Dark wooden table background ----
const WoodTable: React.FC = () => {
	return (
		<>
			{/* Base color */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(180deg, #2a1c10 0%, #3a2614 30%, #321e0e 70%, #1d1207 100%)",
				}}
			/>
			{/* Long horizontal wood-grain striations */}
			<svg
				width="100%"
				height="100%"
				style={{
					position: "absolute",
					inset: 0,
					opacity: 0.7,
					mixBlendMode: "multiply",
				}}
			>
				<filter id="wood-grain">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.012 0.55"
						numOctaves="3"
						seed="3"
						stitchTiles="stitch"
					/>
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.18  0 0 0 0 0.10  0 0 0 0 0.04  0 0 0 0.7 0"
					/>
				</filter>
				<rect width="100%" height="100%" filter="url(#wood-grain)" />
			</svg>
			{/* Subtle fine grain for closeup texture */}
			<svg
				width="100%"
				height="100%"
				style={{
					position: "absolute",
					inset: 0,
					opacity: 0.25,
					mixBlendMode: "overlay",
				}}
			>
				<filter id="wood-fine">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.04 2.8"
						numOctaves="2"
						seed="11"
						stitchTiles="stitch"
					/>
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.45  0 0 0 0 0.28  0 0 0 0 0.12  0 0 0 0.5 0"
					/>
				</filter>
				<rect width="100%" height="100%" filter="url(#wood-fine)" />
			</svg>
			{/* Soft highlight band suggesting overhead light */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"radial-gradient(70% 40% at 50% 35%, rgba(255,220,170,0.10) 0%, rgba(0,0,0,0) 70%)",
				}}
			/>
			{/* Vignette */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"radial-gradient(75% 65% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)",
				}}
			/>
		</>
	);
};

// ---- Animated grain overlay ----
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
				opacity: 0.07,
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
	const camY = sampleCamY(frame);

	const fadeIn = interpolate(frame, [0, 22], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const fadeOut = interpolate(
		frame,
		[TOTAL_FRAMES - 36, TOTAL_FRAMES],
		[1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
	);
	const fade = Math.min(fadeIn, fadeOut);

	return (
		<AbsoluteFill style={{ background: "#0F0E0C", overflow: "hidden" }}>
			<AbsoluteFill style={{ opacity: fade }}>
				{/* Camera frustum: perspective viewer */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						perspective: "2200px",
						perspectiveOrigin: "50% 35%",
						overflow: "hidden",
					}}
				>
					{/* The TABLE: tilted plane that we scroll */}
					<div
						style={{
							position: "absolute",
							left: (VIEW_W - BOARD_W) / 2,
							top: 0,
							width: BOARD_W,
							height: BOARD_H,
							transformStyle: "preserve-3d",
							transformOrigin: "50% 0%",
							transform: `rotateX(${TILT_DEG}deg) translate3d(0, ${-camY}px, 0)`,
						}}
					>
						<WoodTable />

						{/* ===== ZONE 1: VENDOR + QUOTE (y=80–1150) ===== */}
						<NoteCard
							x={210}
							y={150}
							w={620}
							rot={-1.0}
							revealAt={4}
							kicker="EXHIBIT A · ALUM ROCK RD · 2025"
							headline={'"THE WORLD\nWILL EVENTUALLY\nBECOME\nFULLY MUSLIM."'}
							footer="— perfume vendor, recorded on tape"
							headlineSize={56}
						/>
						<PhotoCard
							videoSrc={staticFile("birmingham/clips/vendor.mp4")}
							videoDurationFrames={90}
							x={900}
							y={200}
							w={880}
							rot={1.5}
							revealAt={20}
							caption="THE INTERVIEW · ALUM ROCK RD"
							pinColor={RUST}
						/>

						{/* ===== ZONE 2: BEFORE — non-Islamic Birmingham (y=1250–2400) ===== */}
						<NoteCard
							x={140}
							y={1280}
							w={1640}
							rot={-0.3}
							revealAt={240}
							headline={"BEFORE."}
							body={"Birmingham, c. 1965. A white English city."}
							tint={"#1a1612"}
							headlineSize={120}
						/>
						<PhotoCard
							videoSrc={staticFile("birmingham/clips/old_bus.mp4")}
							videoDurationFrames={150}
							x={120}
							y={1620}
							w={820}
							rot={-1.8}
							revealAt={280}
							kicker="ARCHIVE · 16mm"
							caption="BIRMINGHAM · c. 1965"
							tapeColor="#d7c89a"
						/>
						<PhotoCard
							videoSrc={staticFile("birmingham/clips/old_mini.mp4")}
							videoDurationFrames={150}
							x={1010}
							y={1700}
							w={820}
							rot={2.2}
							revealAt={350}
							kicker="km6nab · ARCHIVE"
							caption="HIGH STREET · c. 1965"
							tapeColor="#d7c89a"
						/>

						{/* ===== ZONE 3: AFTER — Islamic Birmingham today (y=2500–4000) ===== */}
						<NoteCard
							x={140}
							y={2530}
							w={1640}
							rot={0.4}
							revealAt={580}
							headline={"AFTER."}
							body={"Same streets. Burqas, niqabs, halal."}
							tint={"#1a1612"}
							headlineSize={120}
						/>
						<PhotoCard
							videoSrc={staticFile("birmingham/clips/bus_stop.mp4")}
							videoDurationFrames={60}
							x={110}
							y={2870}
							w={780}
							rot={-2.0}
							revealAt={620}
							kicker="FIELD · 2025"
							caption="BUS STOP · ALUM ROCK RD"
							pinColor={RUST}
						/>
						<PhotoCard
							videoSrc={staticFile("birmingham/clips/halal.mp4")}
							videoDurationFrames={51}
							x={960}
							y={2890}
							w={780}
							rot={1.6}
							revealAt={690}
							kicker="MORRISONS · MEAT AISLE"
							caption="HALAL"
							pinColor={RUST}
						/>
						<PhotoCard
							videoSrc={staticFile("birmingham/clips/niqab_street.mp4")}
							videoDurationFrames={180}
							x={420}
							y={3470}
							w={1080}
							rot={-1.0}
							revealAt={830}
							kicker="MARKET STREET · 2025"
							caption="BIRMINGHAM TODAY"
							pinColor={RUST}
						/>

						{/* ===== ZONE 4: THE ENCOUNTER (y=4080–5050) ===== */}
						<PhotoCard
							videoSrc={staticFile("birmingham/clips/burqa_walking.mp4")}
							videoDurationFrames={90}
							x={310}
							y={4080}
							w={1300}
							rot={1.0}
							revealAt={900}
							kicker="THE WOMAN APPROACHED"
							caption="COMPLETE BLACK BURQA"
							pinColor={RUST}
						/>
						<NoteCard
							x={140}
							y={4860}
							w={1640}
							rot={-0.3}
							revealAt={930}
							kicker="ENCOUNTER · 0:34"
							headline={'"HI, SORRY\nTO BOTHER YOU."'}
							footer="— field interview"
							headlineSize={100}
						/>

						{/* ===== ZONE 5: THE ENDING — burqa shopping (y=5250–6600) ===== */}
						<NoteCard
							x={140}
							y={5250}
							w={1100}
							rot={0.2}
							revealAt={1350}
							headline={"THIS IS BIRMINGHAM\nNOW."}
							tint={"#1a1612"}
							headlineSize={72}
						/>
						<PhotoCard
							videoSrc={staticFile("birmingham/clips/burqa_shopping.mp4")}
							videoDurationFrames={150}
							x={120}
							y={5550}
							w={1680}
							rot={-0.6}
							revealAt={1400}
							kicker="MALL · CLOTHING DEPT"
							caption="THE BURQA SHOPS"
							pinColor={RUST}
						/>
					</div>
				</div>

				<Grain />

				{/* Fixed corner kicker (stays with camera) */}
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
