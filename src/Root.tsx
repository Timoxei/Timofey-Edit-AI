import "./index.css";
import { Composition } from "remotion";
import { MyComposition, TOTAL_FRAMES } from "./Composition";
import { RedCircle, TOTAL_FRAMES as RED_CIRCLE_FRAMES } from "./RedCircle";
import { TypingText, TOTAL_FRAMES as TYPING_FRAMES } from "./TypingText";
import { SalaryArrow, TOTAL_FRAMES as SALARY_FRAMES } from "./SalaryArrow";
import { Thumbnail, TOTAL_FRAMES as THUMBNAIL_FRAMES } from "./Thumbnail";
import { Thumbnail2, TOTAL_FRAMES as THUMBNAIL2_FRAMES } from "./Thumbnail2";
import { Thumbnail3, TOTAL_FRAMES as THUMBNAIL3_FRAMES } from "./Thumbnail3";
import { NoKingsThumbnailA, TOTAL_FRAMES as NK_A_FRAMES } from "./NoKingsThumbnailA";
import { NoKingsThumbnailB, TOTAL_FRAMES as NK_B_FRAMES } from "./NoKingsThumbnailB";
import { NoKingsThumbnailC, TOTAL_FRAMES as NK_C_FRAMES } from "./NoKingsThumbnailC";
import { ChildcareCalc, TOTAL_FRAMES as CHILDCARE_FRAMES } from "./ChildcareCalc";
import { BudgetDoubled, TOTAL_FRAMES as BUDGET_FRAMES } from "./BudgetDoubled";
import { ChildcenterNY1953, TOTAL_FRAMES as CCN1953_FRAMES } from "./ChildcenterNY1953";
import { PropublicaRevenue, TOTAL_FRAMES as PROPUBLICA_FRAMES } from "./PropublicaRevenue";
import { SalaryExpenses, TOTAL_FRAMES as SALARY_EXP_FRAMES } from "./SalaryExpenses";
import { NumEmployees, TOTAL_FRAMES as NUM_EMP_FRAMES } from "./NumEmployees";
import { SalaryCalc, TOTAL_FRAMES as SALARY_CALC_FRAMES } from "./SalaryCalc";
import { TraciPay, TOTAL_FRAMES as TRACI_FRAMES } from "./TraciPay";
import { BrooklynIncome, TOTAL_FRAMES as BROOKLYN_FRAMES } from "./BrooklynIncome";
import { IDPGrants, TOTAL_FRAMES as IDP_FRAMES } from "./IDPGrants";
import { ClaudeCodeGuide, TOTAL_FRAMES as GUIDE_FRAMES } from "./ClaudeCodeGuide";
import { Undocumented, TOTAL_FRAMES as UNDOC_FRAMES } from "./Undocumented";
import { HormonalTherapy, TOTAL_FRAMES as HORMONAL_FRAMES } from "./HormonalTherapy";
import { FiveBoroughs, TOTAL_FRAMES as FIVE_BOR_FRAMES } from "./FiveBoroughs";
import { Contributions14M, TOTAL_FRAMES as CONTRIB_FRAMES } from "./Contributions14M";
import { ProgramServices116M, TOTAL_FRAMES as PROG116_FRAMES } from "./ProgramServices116M";
import { CauseIqMedicaid, TOTAL_FRAMES as CAUSEIQ_FRAMES } from "./CauseIqMedicaid";
import { HormoneCare, TOTAL_FRAMES as HCARE_FRAMES } from "./HormoneCare";
import { LenapePage, TOTAL_FRAMES as LENAPE_FRAMES } from "./LenapePage";
import { MonicaWiki, TOTAL_FRAMES as MONICA_FRAMES } from "./MonicaWiki";
import { WWPWiki, TOTAL_FRAMES as WWP_FRAMES } from "./WWPWiki";
import { MonicaBio, TOTAL_FRAMES as MBIO_FRAMES } from "./MonicaBio";
import { MonicaKinder, TOTAL_FRAMES as MKINDER_FRAMES } from "./MonicaKinder";
import { WWPTerror, TOTAL_FRAMES as WWPT_FRAMES } from "./WWPTerror";
import { MonicaPanel, TOTAL_FRAMES as MPANEL_FRAMES } from "./MonicaPanel";
import { PanelList, TOTAL_FRAMES as PLIST_FRAMES } from "./PanelList";
import { TreasurySamidoun, TOTAL_FRAMES as TREAS_FRAMES } from "./TreasurySamidoun";
import { HolocaustConf, TOTAL_FRAMES as HCONF_FRAMES } from "./HolocaustConf";
import { JPostIran, TOTAL_FRAMES as JPOST_FRAMES } from "./JPostIran";
import { RoadSocialism, TOTAL_FRAMES as ROAD_FRAMES } from "./RoadSocialism";
import { MooreheadPoster, TOTAL_FRAMES as POSTER_FRAMES } from "./MooreheadPoster";
import { Top10Terror, TOTAL_FRAMES as TOP10_FRAMES } from "./Top10Terror";
import { HighlightTest, TOTAL_FRAMES as HIGHLIGHT_TEST_FRAMES } from "./HighlightTest";
import { HighlightJavier, TOTAL_FRAMES as HIGHLIGHT_JAVIER_FRAMES } from "./HighlightJavier";
import { HighlightJavierDesc, TOTAL_FRAMES as HIGHLIGHT_JDESC_FRAMES } from "./HighlightJavierDesc";
import { CafExplainer, TOTAL_FRAMES as CAF_FRAMES } from "./CafExplainer";
import { Highlight500k, TOTAL_FRAMES as H500K_FRAMES } from "./Highlight500k";
import { Highlight500kRounded, TOTAL_FRAMES as H500K_R_FRAMES } from "./Highlight500kRounded";
import { SearchTyping, TOTAL_FRAMES as SEARCH_TYPING_FRAMES } from "./SearchTyping";
import { YoutubeClick, TOTAL_FRAMES as YT_CLICK_FRAMES } from "./YoutubeClick";
import { GwHatchetStudents, TOTAL_FRAMES as GW_HATCHET_FRAMES } from "./articles/GwHatchetStudents";
import { GwHatchetVeterans, TOTAL_FRAMES as GW_VET_FRAMES } from "./articles/GwHatchetVeterans";
import { TelegraphReform, TOTAL_FRAMES as TG_REFORM_FRAMES, HEIGHT as TG_REFORM_HEIGHT } from "./articles/TelegraphReform";
import { BirminghamBoard, TOTAL_FRAMES as BIRM_FRAMES } from "./BirminghamBoard";
import { ThreeImams, TOTAL_FRAMES as THREE_IMAMS_FRAMES } from "./ThreeImams";
import { ThreeImamsHamas, TOTAL_FRAMES as THREE_IMAMS_HAMAS_FRAMES } from "./ThreeImamsHamas";
import { ThreeImamsHLF, TOTAL_FRAMES as THREE_IMAMS_HLF_FRAMES } from "./ThreeImamsHLF";
import { Since1969, TOTAL_FRAMES as SINCE1969_FRAMES } from "./Since1969";
import { FernTitleCard, TOTAL_FRAMES as FERN_TITLE_FRAMES } from "./fern/FernTitleCard";
import { FernQuoteCard, TOTAL_FRAMES as FERN_QUOTE_FRAMES } from "./fern/FernQuoteCard";
import { FernEvidenceBoard, TOTAL_FRAMES as FERN_BOARD_FRAMES } from "./fern/FernEvidenceBoard";
import { FernTimeline, TOTAL_FRAMES as FERN_TIMELINE_FRAMES } from "./fern/FernTimeline";
import { FernStatCounter, TOTAL_FRAMES as FERN_STAT_FRAMES } from "./fern/FernStatCounter";
import { FernMapRoute, FernMapRouteProps, TOTAL_FRAMES as FERN_MAP_FRAMES } from "./fern/FernMapRoute";
import { FernDocumentReveal, TOTAL_FRAMES as FERN_DOC_FRAMES } from "./fern/FernDocumentReveal";
// Registered below

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TicTacToe"
        component={MyComposition}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="RedCircle"
        component={RedCircle}
        durationInFrames={RED_CIRCLE_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="SalaryArrow"
        component={SalaryArrow}
        durationInFrames={SALARY_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />

      <Composition
        id="TypingText"
        component={TypingText}
        durationInFrames={TYPING_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="Thumbnail"
        component={Thumbnail}
        durationInFrames={THUMBNAIL_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="Thumbnail2"
        component={Thumbnail2}
        durationInFrames={THUMBNAIL2_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="Thumbnail3"
        component={Thumbnail3}
        durationInFrames={THUMBNAIL3_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="NoKingsThumbnailA"
        component={NoKingsThumbnailA}
        durationInFrames={NK_A_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="NoKingsThumbnailB"
        component={NoKingsThumbnailB}
        durationInFrames={NK_B_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="NoKingsThumbnailC"
        component={NoKingsThumbnailC}
        durationInFrames={NK_C_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="BudgetDoubled"
        component={BudgetDoubled}
        durationInFrames={BUDGET_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="TraciPay"
        component={TraciPay}
        durationInFrames={TRACI_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SalaryCalc"
        component={SalaryCalc}
        durationInFrames={SALARY_CALC_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="NumEmployees"
        component={NumEmployees}
        durationInFrames={NUM_EMP_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SalaryExpenses"
        component={SalaryExpenses}
        durationInFrames={SALARY_EXP_FRAMES}
        fps={30}
        width={1080}
        height={1150}
      />
      <Composition
        id="PropublicaRevenue"
        component={PropublicaRevenue}
        durationInFrames={PROPUBLICA_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ChildcenterNY1953"
        component={ChildcenterNY1953}
        durationInFrames={CCN1953_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ChildcareCalc"
        component={ChildcareCalc}
        durationInFrames={CHILDCARE_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="BrooklynIncome"
        component={BrooklynIncome}
        durationInFrames={BROOKLYN_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ClaudeCodeGuide"
        component={ClaudeCodeGuide}
        durationInFrames={GUIDE_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="IDPGrants"
        component={IDPGrants}
        durationInFrames={IDP_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Undocumented"
        component={Undocumented}
        durationInFrames={UNDOC_FRAMES}
        fps={30}
        width={1080}
        height={1100}
      />
      <Composition
        id="HormonalTherapy"
        component={HormonalTherapy}
        durationInFrames={HORMONAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FiveBoroughs"
        component={FiveBoroughs}
        durationInFrames={FIVE_BOR_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Contributions14M"
        component={Contributions14M}
        durationInFrames={CONTRIB_FRAMES}
        fps={30}
        width={1080}
        height={850}
      />
      <Composition
        id="ProgramServices116M"
        component={ProgramServices116M}
        durationInFrames={PROG116_FRAMES}
        fps={30}
        width={1080}
        height={750}
      />
      <Composition
        id="CauseIqMedicaid"
        component={CauseIqMedicaid}
        durationInFrames={CAUSEIQ_FRAMES}
        fps={30}
        width={1080}
        height={700}
      />
      <Composition
        id="HormoneCare"
        component={HormoneCare}
        durationInFrames={HCARE_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LenapePage"
        component={LenapePage}
        durationInFrames={LENAPE_FRAMES}
        fps={30}
        width={700}
        height={230}
      />
      <Composition
        id="MonicaWiki"
        component={MonicaWiki}
        durationInFrames={MONICA_FRAMES}
        fps={30}
        width={1080}
        height={900}
      />
      <Composition
        id="WWPWiki"
        component={WWPWiki}
        durationInFrames={WWP_FRAMES}
        fps={30}
        width={1080}
        height={1100}
      />
      <Composition
        id="MonicaBio"
        component={MonicaBio}
        durationInFrames={MBIO_FRAMES}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="MonicaKinder"
        component={MonicaKinder}
        durationInFrames={MKINDER_FRAMES}
        fps={30}
        width={1080}
        height={500}
      />
      <Composition
        id="WWPTerror"
        component={WWPTerror}
        durationInFrames={WWPT_FRAMES}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="MonicaPanel"
        component={MonicaPanel}
        durationInFrames={MPANEL_FRAMES}
        fps={30}
        width={1080}
        height={580}
      />
      <Composition
        id="PanelList"
        component={PanelList}
        durationInFrames={PLIST_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TreasurySamidoun"
        component={TreasurySamidoun}
        durationInFrames={TREAS_FRAMES}
        fps={30}
        width={1080}
        height={880}
      />
      <Composition
        id="HolocaustConf"
        component={HolocaustConf}
        durationInFrames={HCONF_FRAMES}
        fps={30}
        width={1080}
        height={1600}
      />
      <Composition
        id="JPostIran"
        component={JPostIran}
        durationInFrames={JPOST_FRAMES}
        fps={30}
        width={1080}
        height={1100}
      />
      <Composition
        id="Top10Terror"
        component={Top10Terror}
        durationInFrames={TOP10_FRAMES}
        fps={30}
        width={1920}
        height={360}
      />
      <Composition
        id="MooreheadPoster"
        component={MooreheadPoster}
        durationInFrames={POSTER_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RoadSocialism"
        component={RoadSocialism}
        durationInFrames={ROAD_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HighlightTest"
        component={HighlightTest}
        durationInFrames={HIGHLIGHT_TEST_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HighlightJavier"
        component={HighlightJavier}
        durationInFrames={HIGHLIGHT_JAVIER_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="HighlightJavierDesc"
        component={HighlightJavierDesc}
        durationInFrames={HIGHLIGHT_JDESC_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CafExplainer"
        component={CafExplainer}
        durationInFrames={CAF_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Highlight500k"
        component={Highlight500k}
        durationInFrames={H500K_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Highlight500kRounded"
        component={Highlight500kRounded}
        durationInFrames={H500K_R_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SearchTyping"
        component={SearchTyping}
        durationInFrames={SEARCH_TYPING_FRAMES}
        fps={30}
        width={894}
        height={110}
      />
      <Composition
        id="YoutubeClick"
        component={YoutubeClick}
        durationInFrames={YT_CLICK_FRAMES}
        fps={30}
        width={334}
        height={112}
      />
      <Composition
        id="GwHatchetStudents"
        component={GwHatchetStudents}
        durationInFrames={GW_HATCHET_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GwHatchetVeterans"
        component={GwHatchetVeterans}
        durationInFrames={GW_VET_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TelegraphReform"
        component={TelegraphReform}
        durationInFrames={TG_REFORM_FRAMES}
        fps={30}
        width={1920}
        height={TG_REFORM_HEIGHT}
      />
      <Composition
        id="BirminghamBoard"
        component={BirminghamBoard}
        durationInFrames={BIRM_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ThreeImams"
        component={ThreeImams}
        durationInFrames={THREE_IMAMS_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ThreeImamsHamas"
        component={ThreeImamsHamas}
        durationInFrames={THREE_IMAMS_HAMAS_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ThreeImamsHLF"
        component={ThreeImamsHLF}
        durationInFrames={THREE_IMAMS_HLF_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Since1969"
        component={Since1969}
        durationInFrames={SINCE1969_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* ——— Fern investigative templates (Singham doc) — duration driven by props ——— */}
      <Composition
        id="FernTitleCard"
        component={FernTitleCard}
        durationInFrames={FERN_TITLE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: "CASE FILE · SUBJECT 001",
          lines: ["NEVILLE ROY", "SINGHAM"],
          sub: "b. May 13, 1954 — Connecticut",
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames ?? FERN_TITLE_FRAMES,
        })}
      />
      <Composition
        id="FernQuoteCard"
        component={FernQuoteCard}
        durationInFrames={FERN_QUOTE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: "FBI RECORD · 1974",
          quote: "I don't want to talk to you.",
          attribution: "Roy Singham, age 20",
          sub: "Eldon Avenue plant floor, Detroit",
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames ?? FERN_QUOTE_FRAMES,
        })}
      />
      <Composition
        id="FernEvidenceBoard"
        component={FernEvidenceBoard}
        durationInFrames={FERN_BOARD_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: "EXHIBIT A",
          title: "THE FATHER",
          cards: [
            { body: "Archibald Singham — political science professor", caption: "THE PROFESSOR", x: 640, y: 560, w: 460, rot: -3 },
            { body: "Fidel Castro — communist leader of Cuba", caption: "HAVANA", x: 1290, y: 620, w: 460, rot: 2.5 },
          ],
          strings: [{ x1: 640, y1: 420, x2: 1290, y2: 480 }],
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames ?? FERN_BOARD_FRAMES,
        })}
      />
      <Composition
        id="FernTimeline"
        component={FernTimeline}
        durationInFrames={FERN_TIMELINE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: "THOUGHTWORKS",
          title: "FROM IDEA TO EMPIRE",
          events: [
            { year: "1989", label: "THE IDEA" },
            { year: "1990", label: "THE NAME" },
            { year: "1993", label: "INCORPORATED", sub: "CHICAGO" },
          ],
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames ?? FERN_TIMELINE_FRAMES,
        })}
      />
      <Composition
        id="FernStatCounter"
        component={FernStatCounter}
        durationInFrames={FERN_STAT_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: "AUGUST 2017",
          stats: [{ value: 785000000, prefix: "$", label: "THE SALE — APAX PARTNERS" }],
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames ?? FERN_STAT_FRAMES,
        })}
      />
      <Composition
        id="FernMapRoute"
        component={FernMapRoute}
        durationInFrames={FERN_MAP_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: "THE MAKING OF A RADICAL",
          title: "A CHILDHOOD IN MOTION",
          stops: [
            { label: "Connecticut", sub: "BORN 1954" },
            { label: "England", sub: "" },
            { label: "Jamaica", sub: "UWI NIGHT SCHOOL · AGE 15" },
            { label: "Michigan", sub: "UNIVERSITY · AGE 16" },
          ],
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: (props as FernMapRouteProps).durationInFrames ?? FERN_MAP_FRAMES,
        })}
      />
      <Composition
        id="FernDocumentReveal"
        component={FernDocumentReveal}
        durationInFrames={FERN_DOC_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          kicker: "BUREAU FILE · 1974",
          docTitle: "FEDERAL BUREAU OF INVESTIGATION",
          docSub: "SUBJECT: SINGHAM, NEVILLE ROY",
          lines: [
            { text: "Investigation opened ████████ 1974." },
            { text: "Subject flagged as potentially dangerous", highlight: "potentially dangerous" },
            { text: "due to activity in groups engaged in" },
            { text: "activities hostile to the United States." },
          ],
          stamp: "POTENTIALLY DANGEROUS",
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames ?? FERN_DOC_FRAMES,
        })}
      />
    </>
  );
};
