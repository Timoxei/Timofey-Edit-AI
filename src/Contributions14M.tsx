export const TOTAL_FRAMES = 1;

const rows = [
	{
		num: "8",
		label: "Contributions and grants",
		labelExtra: " (Part VIII, line 1h)  .  .  .  .  .",
		prior: "17,598,995",
		current: "14,393,753",
		highlighted: true,
		redBox: true,
	},
	{
		num: "9",
		label: "Program service revenue",
		labelExtra: " (Part VIII, line 2g)  .  .  .",
		prior: "91,832,696",
		current: "116,668,258",
		highlighted: false,
		redBox: false,
	},
	{
		num: "10",
		label: "Investment income",
		labelExtra: " (Part VIII, column (A), lines 3, 4, and 7d)  .  .",
		prior: "315,176",
		current: "260,067",
		highlighted: false,
		redBox: false,
	},
	{
		num: "11",
		label: "Other revenue",
		labelExtra: " (Part VIII, column (A), lines 5, 6d, 8c, 9c, 10c, and 11e)",
		prior: "215,814",
		current: "147,165",
		highlighted: false,
		redBox: false,
	},
	{
		num: "12",
		label: "Total revenue",
		labelExtra:
			"—add lines 8 through 11 (must equal Part VIII, column (A), line 12)",
		prior: "109,962,681",
		current: "131,469,243",
		highlighted: false,
		redBox: false,
	},
];

export const Contributions14M: React.FC = () => {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background: "#fff",
				display: "flex",
				flexDirection: "column",
				fontFamily: "Arial, Helvetica, sans-serif",
			}}
		>
			{/* Dark header bar */}
			<div
				style={{
					background: "#1a1a2e",
					padding: "32px 40px",
					display: "flex",
					alignItems: "center",
					gap: 12,
					flexWrap: "nowrap",
				}}
			>
				<span
					style={{
						color: "white",
						fontSize: 30,
						fontWeight: 700,
						whiteSpace: "nowrap",
					}}
				>
					Nonprofit Explorer
				</span>
				<span style={{ color: "#888", fontSize: 26 }}>&gt;</span>
				<span
					style={{
						color: "#ccc",
						fontSize: 26,
						whiteSpace: "nowrap",
					}}
				>
					New York
				</span>
				<span style={{ color: "#888", fontSize: 26 }}>&gt;</span>
				<span
					style={{
						color: "#ccc",
						fontSize: 26,
						border: "2.5px solid #e03030",
						padding: "4px 12px",
						whiteSpace: "nowrap",
					}}
				>
					Community Health Project Inc
				</span>
			</div>

			{/* Select a schedule */}
			<div
				style={{
					padding: "40px 40px 30px",
					display: "flex",
					alignItems: "center",
					gap: 20,
				}}
			>
				<span style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>
					Select a schedule
				</span>
				<div
					style={{
						border: "2px solid #ccc",
						borderRadius: 6,
						padding: "12px 24px",
						fontSize: 28,
						color: "#333",
						display: "flex",
						alignItems: "center",
						gap: 12,
					}}
				>
					Form 990 <span style={{ fontSize: 20 }}>&#9660;</span>
				</div>
			</div>

			{/* Table */}
			<div style={{ padding: "0 20px", display: "flex" }}>
				{/* Revenue vertical label */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: 50,
						position: "relative",
					}}
				>
					<span
						style={{
							transform: "rotate(-90deg)",
							fontSize: 26,
							fontWeight: 700,
							color: "#333",
							whiteSpace: "nowrap",
							letterSpacing: 1,
						}}
					>
						Revenue
					</span>
				</div>

				{/* Table content */}
				<div style={{ flex: 1 }}>
					{/* Column headers */}
					<div
						style={{
							display: "flex",
							borderBottom: "2px solid #333",
							paddingBottom: 12,
							marginBottom: 0,
						}}
					>
						<div style={{ flex: 1 }} />
						<div
							style={{
								width: 180,
								textAlign: "right",
								fontSize: 24,
								fontWeight: 700,
								color: "#222",
								paddingRight: 16,
							}}
						>
							Prior Year
						</div>
						<div
							style={{
								width: 180,
								textAlign: "right",
								fontSize: 24,
								fontWeight: 700,
								color: "#222",
								paddingRight: 16,
							}}
						>
							Current Year
						</div>
					</div>

					{/* Data rows */}
					{rows.map((row) => (
						<div
							key={row.num}
							style={{
								display: "flex",
								alignItems: "center",
								padding: "16px 0",
								borderBottom: "1px solid #e0e0e0",
								...(row.redBox
									? {
											outline: "3px solid #e03030",
											outlineOffset: -1,
										}
									: {}),
							}}
						>
							<div
								style={{
									width: 44,
									fontSize: 24,
									fontWeight: 700,
									color: "#333",
									textAlign: "right",
									paddingRight: 12,
								}}
							>
								{row.num}
							</div>
							<div
								style={{
									flex: 1,
									fontSize: 24,
									color: "#222",
									lineHeight: 1.4,
								}}
							>
								{row.highlighted ? (
									<>
										<span
											style={{
												backgroundColor: "#ffff00",
											}}
										>
											{row.label}
										</span>
										<span style={{ color: "#555" }}>
											{row.labelExtra}
										</span>
									</>
								) : (
									<>
										{row.label}
										<span style={{ color: "#555" }}>
											{row.labelExtra}
										</span>
									</>
								)}
							</div>
							<div
								style={{
									width: 180,
									textAlign: "right",
									fontSize: 26,
									color: "#1a56cc",
									paddingRight: 16,
								}}
							>
								{row.prior}
							</div>
							<div
								style={{
									width: 180,
									textAlign: "right",
									fontSize: 26,
									paddingRight: 16,
									...(row.highlighted
										? {
												backgroundColor: "#ffff00",
												color: "#1a56cc",
												fontWeight: 700,
											}
										: { color: "#1a56cc" }),
								}}
							>
								{row.current}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
