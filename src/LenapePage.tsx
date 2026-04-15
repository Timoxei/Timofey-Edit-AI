export const TOTAL_FRAMES = 1;

export const LenapePage: React.FC = () => {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background: "#fff",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				padding: 24,
				fontFamily: "Georgia, 'Times New Roman', serif",
				lineHeight: 1.65,
				position: "relative",
			}}
		>
			<div style={{ maxWidth: 640 }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "baseline",
						margin: "0 0 12px",
					}}
				>
					<h2
						style={{
							fontSize: 20,
							fontWeight: 700,
							margin: 0,
							color: "#1a1a1a",
						}}
					>
						1624: Settler-Colonization and Establishment of Slavery
					</h2>
					<span
						style={{
							fontSize: 14,
							color: "#888",
							marginLeft: 16,
							whiteSpace: "nowrap",
						}}
					>
						p. 15
					</span>
				</div>
				<p
					style={{
						fontSize: 16,
						color: "#222",
						margin: 0,
					}}
				>
					New York's history has been one of colonization,
					exploitation, and racial oppression.
					<br />
					<span style={{ backgroundColor: "#FFFF00" }}>
						The land New York City stands on today once belonged to
						the Lenape people, who were forcibly displaced through
						settler colonialism.
					</span>{" "}
					From the era of Dutch colonization to modern times, systemic
					racism has shaped the experiences of Black, Indigenous,
					Latine,<sup>2</sup> Asian, Pacific Islander, Middle Eastern,
					and other communities of color.
				</p>
			</div>
		</div>
	);
};
