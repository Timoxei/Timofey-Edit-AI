import {
	Article,
	NewsArticle,
	TOTAL_FRAMES as NEWS_FRAMES,
} from "../NewsArticle";
import { gwHatchet } from "./outlets/gwHatchet";

export const TOTAL_FRAMES = NEWS_FRAMES;

const article: Article = {
	headline:
		"Students arrested in sit-in tried to ‘normalize civil disobedience’",
	byline: "Robin Eberhardt",
	bylineIsLink: true,
	date: "March 16, 2017",
	paragraphs: [
		"One of the three students arrested last week said he was trying to “normalize civil disobedience” following President Donald Trump’s second executive order on immigration.",
		"The students, Kei Pritsker, Henry Manning and graduate student Alison Hawkins, were arrested last Tuesday at the Ronald Reagan Building and International Trade Center on Pennsylvania Avenue, where the office for U.S. Customs and Border Protection is located. They were part of a “sit in” that encouraged employees at the office to not enforce Trump’s executive order banning new visas to be signed for people from six Muslim-majority countries for 90 days.",
	],
	highlights: [
		{ type: "redBox", text: "Kei Pritsker" },
		{ type: "yellow", text: "were arrested", linkInside: "arrested" },
		{
			type: "yellow",
			text: "where the office for U.S. Customs and Border Protection is located.",
		},
		{
			type: "green",
			text:
				"They were part of a “sit in” that encouraged employees at the office to not enforce Trump’s executive order banning new visas to be signed for people from six Muslim-majority countries for 90 days.",
		},
	],
	showWatermark: false,
};

export const GwHatchetStudents: React.FC = () => (
	<NewsArticle outlet={gwHatchet} article={article} />
);
