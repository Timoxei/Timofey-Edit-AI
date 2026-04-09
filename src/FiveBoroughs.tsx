export const TOTAL_FRAMES = 1;

export const FiveBoroughs: React.FC = () => {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background: "#fff",
				display: "flex",
				flexDirection: "column",
				padding: "80px 60px",
				fontFamily: "Georgia, 'Times New Roman', serif",
			}}
		>
			{/* Main heading */}
			<div
				style={{
					fontSize: 64,
					fontWeight: 900,
					color: "#000",
					lineHeight: 1.2,
					marginBottom: 30,
				}}
			>
				Adolescent Health (Health Outreach to Teens/HOTT)
			</div>

			{/* Horizontal rule */}
			<div
				style={{
					height: 2,
					background: "#000",
					marginBottom: 30,
				}}
			/>

			{/* Bold subheading */}
			<div
				style={{
					fontSize: 36,
					fontWeight: 700,
					color: "#000",
					lineHeight: 1.5,
					marginBottom: 36,
				}}
			>
				Callen-Lorde Chelsea, Brooklyn and the Bronx are currently
				accepting new adolescent health patients!
			</div>

			{/* Body text */}
			<div
				style={{
					fontSize: 38,
					lineHeight: 1.8,
					color: "#222",
				}}
			>
				Adolescent Health services are offered through our Health
				Outreach To Teens (HOTT) program, which is a welcoming,
				non-judgmental, confidential program designed specifically to
				meet the medical and mental health needs of LGBTQ+ adolescents
				and young adults ages 13-24, as well as other young people in
				need.{" "}
				<span style={{ backgroundColor: "#ffff00" }}>
					These services are offered at Callen-Lorde clinics as well
					as a{" "}
					<span style={{ color: "#1a0dab" }}>mobile medical unit</span>{" "}
					that travels to areas throughout the five boroughs to meet
					people where they feel comfortable.
				</span>
			</div>
		</div>
	);
};
