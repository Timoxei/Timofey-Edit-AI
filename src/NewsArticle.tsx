import { Img, staticFile } from "remotion";

export const TOTAL_FRAMES = 1;

type SocialIcon = "facebook" | "instagram" | "x" | "tiktok" | "youtube";

export type Outlet = {
	name: string;
	mastheadSrc: string;
	mastheadHeight: number;
	headerBg: string;
	socialIcons?: SocialIcon[];
	iconBg?: string;
	iconColor?: string;
	showSearch?: boolean;
	tagline?: { text: string; bg: string; color: string };
	headlineFont?: string;
	bodyFont?: string;
	linkColor?: string;
};

export type Highlight =
	| { type: "yellow" | "green"; text: string; linkInside?: string }
	| { type: "redBox"; text: string };

export type Article = {
	headline: string;
	byline: string;
	date: string;
	paragraphs: string[];
	highlights: Highlight[];
	bylineIsLink?: boolean;
	showWatermark?: boolean;
};

export type NewsArticleProps = {
	outlet: Outlet;
	article: Article;
	width?: number;
	height?: number;
};

const YELLOW = "#ffff00";
const GREEN = "#7be1b0";
const RED = "#e02828";

const Icon: React.FC<{ name: SocialIcon; size: number; color: string }> = ({
	name,
	size,
	color,
}) => {
	const p = (d: string) => (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill={color}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d={d} />
		</svg>
	);
	switch (name) {
		case "facebook":
			return p(
				"M13.5 21v-7.5h2.5l.4-3H13.5V8.6c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.7v3h2.4V21h3.4z",
			);
		case "instagram":
			return (
				<svg
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke={color}
					strokeWidth="2"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect x="3" y="3" width="18" height="18" rx="5" />
					<circle cx="12" cy="12" r="4" />
					<circle cx="17.5" cy="6.5" r="1" fill={color} />
				</svg>
			);
		case "x":
			return p(
				"M17.5 4h2.7l-5.9 6.7L21 20h-5.4l-4.2-5.5L6.5 20H3.8l6.3-7.2L3 4h5.5l3.8 5 4.2-5zm-1 14.5h1.5L8.5 5.5H6.9l9.6 13z",
			);
		case "tiktok":
			return p(
				"M16.5 3c.2 1.5 1 2.8 2.3 3.6.6.4 1.3.6 2 .7v3c-1.5 0-2.9-.5-4.1-1.3v6.1c0 3.4-2.8 6.2-6.2 6.2S4.3 18.5 4.3 15.1 7.1 8.9 10.5 8.9c.3 0 .6 0 .9.1v3c-.3-.1-.6-.1-.9-.1-1.7 0-3.1 1.4-3.1 3.1 0 1.7 1.4 3.1 3.1 3.1 1.7 0 3.1-1.4 3.1-3.1V3h2.9z",
			);
		case "youtube":
			return p(
				"M21.6 8.4c-.2-.9-.9-1.6-1.8-1.8C18.2 6.2 12 6.2 12 6.2s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 10 2 12 2 12s0 2 .4 3.6c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-3.6.4-3.6s0-2-.4-3.6zM10 15V9l5.2 3L10 15z",
			);
	}
};

const SearchIcon: React.FC<{ size: number; color: string }> = ({
	size,
	color,
}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth="2.2"
		strokeLinecap="round"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="10.5" cy="10.5" r="6" />
		<line x1="15" y1="15" x2="20" y2="20" />
	</svg>
);

const styleFor = (h: Highlight): React.CSSProperties => {
	switch (h.type) {
		case "yellow":
			return {
				backgroundColor: YELLOW,
				mixBlendMode: "multiply",
				boxDecorationBreak: "clone",
				WebkitBoxDecorationBreak: "clone",
				padding: "0 2px",
			};
		case "green":
			return {
				backgroundColor: GREEN,
				mixBlendMode: "multiply",
				boxDecorationBreak: "clone",
				WebkitBoxDecorationBreak: "clone",
				padding: "0 2px",
			};
		case "redBox":
			return {
				outline: `3px solid ${RED}`,
				outlineOffset: 2,
				padding: "0 2px",
			};
	}
};

type Token =
	| { plain: string }
	| { highlight: Highlight; matched: string };

const tokenize = (paragraph: string, highlights: Highlight[]): Token[] => {
	const sorted = [...highlights].sort((a, b) => b.text.length - a.text.length);
	const matches: { start: number; end: number; h: Highlight }[] = [];
	for (const h of sorted) {
		let from = 0;
		while (true) {
			const idx = paragraph.indexOf(h.text, from);
			if (idx === -1) break;
			const overlaps = matches.some(
				(m) => !(idx + h.text.length <= m.start || idx >= m.end),
			);
			if (!overlaps) {
				matches.push({ start: idx, end: idx + h.text.length, h });
			}
			from = idx + 1;
		}
	}
	matches.sort((a, b) => a.start - b.start);

	const tokens: Token[] = [];
	let cursor = 0;
	for (const m of matches) {
		if (m.start > cursor) tokens.push({ plain: paragraph.slice(cursor, m.start) });
		tokens.push({ highlight: m.h, matched: paragraph.slice(m.start, m.end) });
		cursor = m.end;
	}
	if (cursor < paragraph.length) tokens.push({ plain: paragraph.slice(cursor) });
	return tokens;
};

const renderHighlightedText = (
	text: string,
	h: Highlight,
	linkColor: string,
): React.ReactNode => {
	if (h.type !== "redBox" && h.linkInside && text.includes(h.linkInside)) {
		const idx = text.indexOf(h.linkInside);
		return (
			<>
				{text.slice(0, idx)}
				<span style={{ color: linkColor, textDecoration: "underline" }}>
					{h.linkInside}
				</span>
				{text.slice(idx + h.linkInside.length)}
			</>
		);
	}
	return text;
};

export const NewsArticle: React.FC<NewsArticleProps> = ({
	outlet,
	article,
	width = 1920,
	height = 1080,
}) => {
	const {
		mastheadSrc,
		mastheadHeight,
		headerBg,
		socialIcons = [],
		iconBg = "#15334f",
		iconColor = "#ffffff",
		showSearch = true,
		tagline,
		headlineFont = "Georgia, 'Times New Roman', serif",
		bodyFont = "Georgia, 'Times New Roman', serif",
		linkColor = "#1455a3",
	} = outlet;

	const headerPad = Math.round(mastheadHeight * 0.45);
	const headerHeight = mastheadHeight + headerPad * 2;
	const iconSize = Math.round(mastheadHeight * 0.42);
	const iconBox = Math.round(iconSize * 1.5);

	return (
		<div
			style={{
				width,
				height,
				background: "white",
				fontFamily: bodyFont,
				color: "#222",
				display: "flex",
				flexDirection: "column",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Top black hairline */}
			<div style={{ height: 4, background: "#000" }} />

			{/* Header strip */}
			<div
				style={{
					background: headerBg,
					height: headerHeight,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: `0 ${Math.round(width * 0.04)}px`,
				}}
			>
				{/* Social icons (left) */}
				<div style={{ display: "flex", gap: 10 }}>
					{socialIcons.map((s) => (
						<div
							key={s}
							style={{
								width: iconBox,
								height: iconBox,
								background: iconBg,
								borderRadius: 4,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Icon name={s} size={iconSize} color={iconColor} />
						</div>
					))}
				</div>

				{/* Masthead (center) */}
				<Img
					src={staticFile(mastheadSrc)}
					style={{ height: mastheadHeight, width: "auto" }}
				/>

				{/* Search (right) */}
				<div style={{ width: socialIcons.length * (iconBox + 10), display: "flex", justifyContent: "flex-end" }}>
					{showSearch && (
						<div
							style={{
								width: iconBox,
								height: iconBox,
								background: iconBg,
								borderRadius: 4,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<SearchIcon size={iconSize} color={iconColor} />
						</div>
					)}
				</div>
			</div>

			{/* Tagline strip */}
			{tagline && (
				<div
					style={{
						background: tagline.bg,
						color: tagline.color,
						textAlign: "center",
						padding: "10px 0",
						fontSize: Math.round(width * 0.0095),
						fontFamily: "Arial, Helvetica, sans-serif",
						letterSpacing: 1.6,
						fontWeight: 600,
					}}
				>
					{tagline.text}
				</div>
			)}

			{/* Article body */}
			<div
				style={{
					flex: 1,
					padding: `${Math.round(height * 0.04)}px ${Math.round(width * 0.085)}px`,
					display: "flex",
					flexDirection: "column",
					gap: Math.round(height * 0.018),
				}}
			>
				<h1
					style={{
						fontFamily: headlineFont,
						fontSize: Math.round(width * 0.038),
						lineHeight: 1.1,
						fontWeight: 700,
						color: "#111",
						margin: 0,
					}}
				>
					{article.headline}
				</h1>

				<div
					style={{
						fontSize: Math.round(width * 0.014),
						lineHeight: 1.4,
						color: "#333",
					}}
				>
					<div>
						By{" "}
						<span
							style={{
								color: article.bylineIsLink === false ? "#333" : linkColor,
								textDecoration:
									article.bylineIsLink === false ? "none" : "underline",
								fontStyle: "italic",
							}}
						>
							{article.byline}
						</span>
					</div>
					<div style={{ marginTop: 4 }}>{article.date}</div>
				</div>

				<div
					style={{
						fontSize: Math.round(width * 0.0175),
						lineHeight: 1.5,
						color: "#1a1a1a",
						display: "flex",
						flexDirection: "column",
						gap: Math.round(height * 0.018),
					}}
				>
					{article.paragraphs.map((para, pi) => (
						<p key={pi} style={{ margin: 0 }}>
							{tokenize(para, article.highlights).map((tok, ti) =>
								"plain" in tok ? (
									<span key={ti}>{tok.plain}</span>
								) : (
									<span key={ti} style={styleFor(tok.highlight)}>
										{renderHighlightedText(tok.matched, tok.highlight, linkColor)}
									</span>
								),
							)}
						</p>
					))}
				</div>
			</div>

			{/* Optional watermark */}
			{article.showWatermark && (
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "20%",
						transform: "translate(-50%, -50%) rotate(-22deg)",
						fontFamily: "Impact, 'Arial Black', sans-serif",
						fontSize: Math.round(width * 0.05),
						color: "rgba(255,255,255,0.15)",
						textShadow: "0 0 4px rgba(0,0,0,0.25)",
						whiteSpace: "nowrap",
						pointerEvents: "none",
					}}
				>
					THE NATE FRIEDMAN SHOW
				</div>
			)}
		</div>
	);
};
