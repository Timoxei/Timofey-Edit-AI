import { Img, staticFile } from "remotion";

export const TOTAL_FRAMES = 1;

export const Undocumented: React.FC = () => {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background: "#ffffff",
				display: "flex",
				flexDirection: "column",
				fontFamily: "Arial, Helvetica, sans-serif",
			}}
		>
			{/* Google header */}
			<div
				style={{
					padding: "48px 60px 0",
					display: "flex",
					alignItems: "center",
					gap: 28,
				}}
			>
				<Img
					src={staticFile("google_logo.png")}
					style={{ height: 56 }}
				/>
				<div
					style={{
						flex: 1,
						border: "2px solid #dfe1e5",
						borderRadius: 28,
						padding: "18px 28px",
						fontSize: 32,
						color: "#202124",
						display: "flex",
						alignItems: "center",
					}}
				>
					child center of new york undocumented
				</div>
			</div>

			{/* Nav tabs */}
			<div
				style={{
					padding: "28px 60px 0",
					display: "flex",
					gap: 36,
					borderBottom: "1px solid #ebebeb",
					paddingBottom: 16,
				}}
			>
				{[
					{ label: "AI Mode", active: false },
					{ label: "All", active: true },
					{ label: "News", active: false },
					{ label: "Images", active: false },
					{ label: "Forums", active: false },
					{ label: "Shopping", active: false },
					{ label: "Videos", active: false },
					{ label: "More", active: false },
				].map((tab) => (
					<span
						key={tab.label}
						style={{
							fontSize: 28,
							color: tab.active ? "#1a73e8" : "#5f6368",
							fontWeight: tab.active ? 600 : 400,
							borderBottom: tab.active
								? "3px solid #1a73e8"
								: "none",
							paddingBottom: 12,
						}}
					>
						{tab.label}
					</span>
				))}
			</div>

			{/* AI Overview header */}
			<div
				style={{
					padding: "50px 60px 24px",
					display: "flex",
					alignItems: "center",
					gap: 16,
				}}
			>
				<span style={{ fontSize: 36 }}>&#10024;</span>
				<span
					style={{
						fontSize: 36,
						fontWeight: 600,
						color: "#202124",
					}}
				>
					AI Overview
				</span>
			</div>

			{/* AI Overview content with green highlight border */}
			<div style={{ padding: "0 60px" }}>
				<div
					style={{
						border: "3px solid #34a853",
						borderRadius: 16,
						padding: "44px 48px",
						lineHeight: 1.7,
					}}
				>
					<span
						style={{
							fontSize: 38,
							color: "#202124",
						}}
					>
						<span
							style={{
								backgroundColor: "#d4edda",
							}}
						>
							Undocumented families in NYC can access free or
							low-cost childcare, including 3-K and Pre-K,
							regardless of immigration status
						</span>
						. The{" "}
						<span style={{ color: "#1a0dab" }}>Promise NYC</span>{" "}
						program (launched 2023) specifically assists
						undocumented families with children under 13, and the
						city does not inquire about immigration status for these
						services.
					</span>
					<div
						style={{
							marginTop: 24,
							display: "flex",
							alignItems: "center",
							gap: 10,
						}}
					>
						<div
							style={{
								width: 28,
								height: 28,
								borderRadius: 14,
								background: "#34a853",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<span
								style={{
									color: "white",
									fontSize: 16,
									fontWeight: 700,
								}}
							>
								G
							</span>
						</div>
						<span
							style={{ fontSize: 26, color: "#70757a" }}
						>
							NYC.gov +2
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
