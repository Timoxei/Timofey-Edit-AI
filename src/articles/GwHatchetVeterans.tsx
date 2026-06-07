import {
	Article,
	NewsArticle,
	TOTAL_FRAMES as NEWS_FRAMES,
} from "../NewsArticle";
import { gwHatchet } from "./outlets/gwHatchet";

export const TOTAL_FRAMES = NEWS_FRAMES;

const article: Article = {
	headline:
		"Officials reimburse students, commit to reforms following House veterans program investigation",
	byline: "Ryan Saenz",
	bylineIsLink: true,
	date: "June 5, 2026",
	paragraphs: [
		"University officials said they will reimburse affected students and adopt new oversight measures after a congressional inquiry raised questions about how the GW veterans education program handled federal benefits.",
		"The reforms follow a months-long House investigation that flagged record-keeping and disbursement issues, prompting administrators to commit to additional audits, staff training and clearer guidance for student veterans.",
	],
	highlights: [
		{
			type: "yellow",
			text: "reimburse affected students and adopt new oversight measures",
		},
		{
			type: "green",
			text:
				"a months-long House investigation that flagged record-keeping and disbursement issues",
		},
	],
	showWatermark: false,
};

export const GwHatchetVeterans: React.FC = () => (
	<NewsArticle outlet={gwHatchet} article={article} />
);
