import React from "react";

export const TOTAL_FRAMES = 1;

const HL: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<span
		style={{
			backgroundColor: "#ffff00",
			color: "#0077cc",
			textDecoration: "underline",
			textDecorationColor: "#0077cc",
			textUnderlineOffset: 4,
		}}
	>
		{children}
	</span>
);

export const IDPGrants: React.FC = () => {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				backgroundColor: "#000",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				padding: "60px 50px",
			}}
		>
			{/* Content box */}
			<div
				style={{
					backgroundColor: "#f0f5f0",
					border: "2px solid #ccc",
					borderRadius: 4,
					padding: "70px 60px",
					width: "100%",
					maxWidth: 980,
				}}
			>
				<p
					style={{
						fontFamily: "Georgia, serif",
						fontSize: 48,
						lineHeight: 1.7,
						color: "#111",
						margin: 0,
					}}
				>
					IDP is supported by <HL>grants</HL> from the{" "}
					<HL>Ford Foundation</HL>, the Fund for New Citizens of the
					New York Community Trust, the New York Foundation, and{" "}
					<HL>George Soros</HL>&apos;s{" "}
					<HL>Open Society Institute</HL>.
				</p>
			</div>

			{/* Source */}
			<div
				style={{
					width: "100%",
					maxWidth: 980,
					display: "flex",
					justifyContent: "flex-end",
					marginTop: 30,
				}}
			>
				<span
					style={{
						fontFamily: "Arial, Helvetica, sans-serif",
						fontSize: 32,
						color: "#888",
						fontWeight: 700,
					}}
				>
					discoverthetnetworks.org
				</span>
			</div>
		</div>
	);
};
