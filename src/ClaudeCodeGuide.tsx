import React from "react";
import { useCurrentFrame } from "remotion";

export const TOTAL_FRAMES = 6;

const ACCENT = "#6C63FF";
const BG = "#111118";
const CARD_BG = "#1C1C28";
const CODE_BG = "#0D0D14";
const WHITE = "#FFFFFF";
const GRAY = "#999";

const Badge: React.FC<{ n: number }> = ({ n }) => (
	<div
		style={{
			width: 80,
			height: 80,
			borderRadius: 40,
			backgroundColor: ACCENT,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexShrink: 0,
		}}
	>
		<span style={{ color: WHITE, fontSize: 40, fontWeight: 800 }}>{n}</span>
	</div>
);

const CodeBlock: React.FC<{ children: string }> = ({ children }) => (
	<div
		style={{
			backgroundColor: CODE_BG,
			border: "2px solid #333",
			borderRadius: 12,
			padding: "28px 36px",
			marginTop: 30,
			width: "100%",
		}}
	>
		<code
			style={{
				fontFamily: "'Cascadia Code', 'Fira Code', monospace",
				fontSize: 30,
				color: "#4EC9B0",
				wordBreak: "break-all",
				whiteSpace: "pre-wrap",
			}}
		>
			{children}
		</code>
	</div>
);

const SlideWrapper: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => (
	<div
		style={{
			width: 1080,
			height: 1920,
			backgroundColor: BG,
			display: "flex",
			flexDirection: "column",
			padding: "100px 60px",
		}}
	>
		{children}
	</div>
);

/* ── Slide 0: Title ── */
const TitleSlide: React.FC = () => (
	<SlideWrapper>
		<div
			style={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				gap: 40,
			}}
		>
			<div
				style={{
					fontSize: 72,
					fontWeight: 900,
					color: WHITE,
					textAlign: "center",
					lineHeight: 1.2,
					fontFamily: "Arial, Helvetica, sans-serif",
				}}
			>
				How to Set Up
				<br />
				<span style={{ color: ACCENT }}>Claude Code</span>
			</div>
			<div
				style={{
					width: 120,
					height: 4,
					backgroundColor: ACCENT,
					borderRadius: 2,
				}}
			/>
			<div
				style={{
					fontSize: 34,
					color: GRAY,
					textAlign: "center",
					lineHeight: 1.6,
					fontFamily: "Arial, Helvetica, sans-serif",
				}}
			>
				A step-by-step guide to get
				<br />
				VS Code + Claude Code + GitHub
				<br />
				running on your machine
			</div>
		</div>
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				gap: 16,
				marginTop: 40,
			}}
		>
			{[1, 2, 3, 4, 5].map((n) => (
				<div
					key={n}
					style={{
						width: 16,
						height: 16,
						borderRadius: 8,
						backgroundColor: "#333",
					}}
				/>
			))}
		</div>
	</SlideWrapper>
);

/* ── Step slides helper ── */
const StepSlide: React.FC<{
	step: number;
	title: string;
	children: React.ReactNode;
}> = ({ step, title, children }) => (
	<SlideWrapper>
		{/* Header */}
		<div style={{ display: "flex", alignItems: "center", gap: 24 }}>
			<Badge n={step} />
			<span
				style={{
					fontSize: 52,
					fontWeight: 800,
					color: WHITE,
					fontFamily: "Arial, Helvetica, sans-serif",
				}}
			>
				{title}
			</span>
		</div>
		<div
			style={{
				width: "100%",
				height: 3,
				backgroundColor: "#2a2a3a",
				marginTop: 36,
				marginBottom: 50,
			}}
		/>
		{/* Content */}
		<div
			style={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				gap: 36,
			}}
		>
			{children}
		</div>
		{/* Progress dots */}
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				gap: 16,
				marginTop: 40,
			}}
		>
			{[1, 2, 3, 4, 5].map((n) => (
				<div
					key={n}
					style={{
						width: 16,
						height: 16,
						borderRadius: 8,
						backgroundColor: n === step ? ACCENT : "#333",
					}}
				/>
			))}
		</div>
	</SlideWrapper>
);

const Instruction: React.FC<{ emoji: string; text: string }> = ({
	emoji,
	text,
}) => (
	<div
		style={{
			display: "flex",
			alignItems: "flex-start",
			gap: 20,
		}}
	>
		<span style={{ fontSize: 38, flexShrink: 0 }}>{emoji}</span>
		<span
			style={{
				fontSize: 36,
				color: "#ddd",
				lineHeight: 1.6,
				fontFamily: "Arial, Helvetica, sans-serif",
			}}
		>
			{text}
		</span>
	</div>
);

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div
		style={{
			backgroundColor: CARD_BG,
			borderRadius: 16,
			padding: "40px 44px",
			display: "flex",
			flexDirection: "column",
			gap: 28,
		}}
	>
		{children}
	</div>
);

const UrlBox: React.FC<{ url: string }> = ({ url }) => (
	<div
		style={{
			backgroundColor: CODE_BG,
			border: "2px solid " + ACCENT,
			borderRadius: 12,
			padding: "24px 36px",
			marginTop: 10,
		}}
	>
		<span
			style={{
				fontFamily: "'Cascadia Code', monospace",
				fontSize: 30,
				color: ACCENT,
			}}
		>
			{url}
		</span>
	</div>
);

/* ── Slide 1: VS Code ── */
const VSCodeSlide: React.FC = () => (
	<StepSlide step={1} title="Install VS Code">
		<Card>
			<Instruction emoji="1." text="Open your browser and go to:" />
			<UrlBox url="code.visualstudio.com" />
		</Card>
		<Card>
			<Instruction emoji="2." text='Click the big blue "Download" button' />
			<Instruction emoji="3." text="Run the installer — click Next through all steps" />
			<Instruction
				emoji="4."
				text='Check "Add to PATH" when prompted'
			/>
		</Card>
		<Card>
			<Instruction emoji="5." text="Open VS Code to confirm it works" />
		</Card>
	</StepSlide>
);

/* ── Slide 2: Node.js ── */
const NodeSlide: React.FC = () => (
	<StepSlide step={2} title="Install Node.js">
		<Card>
			<Instruction emoji="1." text="Go to:" />
			<UrlBox url="nodejs.org" />
			<Instruction emoji="2." text='Download the LTS (green "Recommended") version' />
		</Card>
		<Card>
			<Instruction emoji="3." text="Run the installer — click Next through all steps" />
		</Card>
		<Card>
			<Instruction emoji="4." text="Open a terminal and verify:" />
			<CodeBlock>node -v</CodeBlock>
			<div
				style={{
					fontSize: 30,
					color: GRAY,
					fontFamily: "Arial, Helvetica, sans-serif",
				}}
			>
				You should see a version number like v22.x.x
			</div>
		</Card>
	</StepSlide>
);

/* ── Slide 3: Claude Code ── */
const ClaudeCodeSlide: React.FC = () => (
	<StepSlide step={3} title="Install Claude Code">
		<Card>
			<Instruction emoji="1." text="Open a terminal (in VS Code or standalone)" />
		</Card>
		<Card>
			<Instruction emoji="2." text="Run this command:" />
			<CodeBlock>npm install -g @anthropic-ai/claude-code</CodeBlock>
		</Card>
		<Card>
			<Instruction emoji="3." text="Wait for it to finish installing" />
			<Instruction emoji="4." text="Verify by typing:" />
			<CodeBlock>claude --version</CodeBlock>
		</Card>
	</StepSlide>
);

/* ── Slide 4: Clone Repo ── */
const CloneSlide: React.FC = () => (
	<StepSlide step={4} title="Clone the Repo">
		<Card>
			<Instruction emoji="1." text="Open a terminal and run:" />
			<CodeBlock>{"git clone <REPO_URL>"}</CodeBlock>
			<div
				style={{
					fontSize: 28,
					color: GRAY,
					fontStyle: "italic",
					fontFamily: "Arial, Helvetica, sans-serif",
				}}
			>
				Replace {"<REPO_URL>"} with the link I shared with you
			</div>
		</Card>
		<Card>
			<Instruction emoji="2." text="Open VS Code" />
			<Instruction emoji="3." text='Go to File → Open Folder' />
			<Instruction emoji="4." text="Select the cloned folder" />
		</Card>
	</StepSlide>
);

/* ── Slide 5: Launch Claude ── */
const LaunchSlide: React.FC = () => (
	<StepSlide step={5} title="Start Working">
		<Card>
			<Instruction emoji="1." text="In VS Code, open the terminal:" />
			<CodeBlock>Ctrl + `</CodeBlock>
		</Card>
		<Card>
			<Instruction emoji="2." text="Type this to start Claude:" />
			<CodeBlock>claude</CodeBlock>
		</Card>
		<Card>
			<Instruction emoji="3." text="Claude will ask you to log in the first time — follow the prompts" />
			<Instruction emoji="4." text="Once logged in, you can ask Claude to help you with anything in the project!" />
		</Card>
		<div
			style={{
				marginTop: "auto",
				textAlign: "center",
				fontSize: 40,
				fontWeight: 800,
				color: ACCENT,
				fontFamily: "Arial, Helvetica, sans-serif",
			}}
		>
			You are all set!
		</div>
	</StepSlide>
);

const SLIDES = [
	TitleSlide,
	VSCodeSlide,
	NodeSlide,
	ClaudeCodeSlide,
	CloneSlide,
	LaunchSlide,
];

export const ClaudeCodeGuide: React.FC = () => {
	const frame = useCurrentFrame();
	const SlideComponent = SLIDES[frame] ?? TitleSlide;
	return <SlideComponent />;
};
