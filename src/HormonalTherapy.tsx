export const TOTAL_FRAMES = 1;

const RedBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<span
		style={{
			border: "3px solid #e00000",
			padding: "2px 6px",
			display: "inline",
			boxDecorationBreak: "clone" as const,
			WebkitBoxDecorationBreak: "clone" as const,
		}}
	>
		{children}
	</span>
);

export const HormonalTherapy: React.FC = () => {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background: "#fff",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				padding: "80px 60px",
				fontFamily: "Georgia, 'Times New Roman', serif",
			}}
		>
			<div
				style={{
					fontSize: 42,
					lineHeight: 2.1,
					color: "#1a1a1a",
				}}
			>
				<span style={{ backgroundColor: "#ffff00" }}>
					provider that specializes in LGBTQ medical care and
					information.{" "}
					<RedBox>Callen-Lorde brings</RedBox> their{" "}
					<RedBox>medical van to the RTF monthly</RedBox> and answers
					our LGBTQ clients' questions, including questions regarding{" "}
					<RedBox>
						hormonal therapy so they can get some education on it
					</RedBox>
				</span>
				. I had one client who wanted to get hormonal therapy, and we
				didn't have the structure for that at the time. But{" "}
				<span style={{ backgroundColor: "#ffff00" }}>
					<RedBox>
						we are building the processes and structure
					</RedBox>{" "}
					<RedBox>
						so any youth in the future can get gender-affirming care
					</RedBox>
					, <RedBox>which</RedBox>{" "}
					<RedBox>includes affirming their gender identity</RedBox>,
					using their appropriate{" "}
					<RedBox>pronouns and preferred names</RedBox>, providing
					items that can be affirming such as{" "}
					<RedBox>chest binders</RedBox>
				</span>
				, and referring clients to support systems and groups upon
				discharge. The medical team is doing a great job spearheading
				those processes for the kids. It is inspiring that they saw the
				need and made a difference.
			</div>
		</div>
	);
};
