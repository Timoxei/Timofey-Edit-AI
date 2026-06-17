import {
	Article,
	NewsArticle,
	TOTAL_FRAMES as NEWS_FRAMES,
} from "../NewsArticle";
import { telegraph } from "./outlets/telegraph";

export const TOTAL_FRAMES = NEWS_FRAMES;
export const HEIGHT = 880;

const article: Article = {
	headline: "The day in charts: Reform hammers Labour’s heartlands",
	byline: "Ben Butcher and Ollie Corfe",
	bylineIsLink: true,
	date: "08 May 2026 10:43am BST",
	paragraphs: [
		"In Birmingham, the country’s largest local authority, Labour were expected to lose control, this time driven by a surge to predominantly Muslim independents, angered by Labour’s position on Gaza. Bin strikes have also plagued the city, leaving many residents furious with the council.",
	],
	highlights: [
		{ type: "yellow", text: "Birmingham" },
		{ type: "yellow", text: "largest local authority" },
		{ type: "yellow", text: "Labour were expected to lose control" },
		{ type: "yellow", text: "surge to predominantly Muslim independents" },
	],
	showWatermark: false,
	fontScale: 1.5,
};

export const TelegraphReform: React.FC = () => (
	<NewsArticle outlet={telegraph} article={article} height={HEIGHT} />
);
