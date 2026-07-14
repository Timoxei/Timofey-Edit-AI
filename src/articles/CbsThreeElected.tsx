import { Article, NewsArticle, TOTAL_FRAMES as NEWS_FRAMES } from "../NewsArticle";
import { cbsNews } from "./outlets/cbsNews";

export const TOTAL_FRAMES = NEWS_FRAMES;

const article: Article = {
	headline: "All 3 Mamdani-backed candidates projected to win NY primaries",
	byline: "Katie Houlis, Mark Prussin, Jeff Capellini",
	bylineIsLink: true,
	date: "Updated on: June 24, 2026 / 12:52 AM EDT / CBS New York",
	paragraphs: [],
	highlights: [],
};

export const CbsThreeElected: React.FC = () => (
	<NewsArticle outlet={cbsNews} article={article} width={1920} height={480} />
);
