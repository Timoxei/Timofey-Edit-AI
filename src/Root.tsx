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
import { FernArticleClip, FERN_ARTICLE_FRAMES } from "./fern/FernArticleClip";
import { NaitMosques, TOTAL_FRAMES as NAIT_FRAMES } from "./NaitMosques";
import { ElMezainProof, TOTAL_FRAMES as ELMEZAIN_FRAMES } from "./ElMezainProof";
import { HlfProsecution, TOTAL_FRAMES as HLF_PROS_FRAMES } from "./HlfProsecution";
import { HanootiDarAlHijrah, TOTAL_FRAMES as HANOOTI_FRAMES } from "./HanootiDarAlHijrah";
import { AljazeeraHaniyeh, TOTAL_FRAMES as ALJAZEERA_FRAMES } from "./AljazeeraHaniyeh";
import { ArrestsChart, TOTAL_FRAMES as ARRESTS_FRAMES } from "./ArrestsChart";
import { CbsThreeElected, TOTAL_FRAMES as CBS_THREE_FRAMES } from "./articles/CbsThreeElected";
import { HighlightNapkins, TOTAL_FRAMES as NAPKINS_FRAMES } from "./HighlightNapkins";
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
      <Composition
        id="NaitMosques"
        component={NaitMosques}
        durationInFrames={NAIT_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HlfProsecution"
        component={HlfProsecution}
        durationInFrames={HLF_PROS_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HanootiDarAlHijrah"
        component={HanootiDarAlHijrah}
        durationInFrames={HANOOTI_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AljazeeraHaniyeh"
        component={AljazeeraHaniyeh}
        durationInFrames={ALJAZEERA_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ArrestsChart"
        component={ArrestsChart}
        durationInFrames={ARRESTS_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ElMezainProof"
        component={ElMezainProof}
        durationInFrames={ELMEZAIN_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CbsThreeElected"
        component={CbsThreeElected}
        durationInFrames={CBS_THREE_FRAMES}
        fps={30}
        width={1920}
        height={480}
      />
      <Composition
        id="HighlightNapkins"
        component={HighlightNapkins}
        durationInFrames={NAPKINS_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* ——— Fern investigative templates (Singham doc) — duration driven by props ——— */}
      <Composition
        id="FernArticleClip"
        component={FernArticleClip}
        durationInFrames={FERN_ARTICLE_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: "singham_ch1/articles/federalist_singham.png",
          imgW: 1425,
          imgH: 3265,
          shots: [
            { t: 0.0, cx: 712, cy: 300, s: 1.05 },
            { t: 3.2, cx: 712, cy: 200, s: 1.85 },
            { t: 3.9, cx: 712, cy: 215, s: 1.85 },
            { t: 5.6, cx: 712, cy: 2975, s: 2.0 },
            { t: 9.0, cx: 712, cy: 2990, s: 2.06 },
          ],
          underline: { x: 342, y: 281, w: 740, start: 1.6 },
          highlights: [
            { x: 528.1, y: 2957.2, w: 483.1, h: 24 },
            { x: 390.6, y: 2989.2, w: 358.9, h: 24 },
          ],
          highlightStart: 5.9,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames ?? FERN_ARTICLE_FRAMES,
        })}
      />
      {/* Beats 2+3 — the father: Wikipedia clipping -> Castro photo -> NAM line.
          Timing locked to "AI Script transcript.json"; place on V2 at 16.296s. */}
      <Composition
        id="FernFatherStory"
        component={FernArticleClip}
        durationInFrames={660}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: "singham_ch1/articles/wiki_archibald.png",
          imgW: 1320,
          imgH: 1940,
          shots: [
            { t: 0, cx: 660, cy: 480, s: 0.85 },
            { t: 1.9, cx: 600, cy: 180, s: 1.72 },
            { t: 5.2, cx: 605, cy: 185, s: 1.74 },
            { t: 7.0, cx: 640, cy: 520, s: 1.78 },
            { t: 10.6, cx: 645, cy: 525, s: 1.8 },
            { t: 13.0, cx: 2020, cy: 740, s: 1.32 },
            { t: 18.4, cx: 2020, cy: 748, s: 1.45 },
            { t: 20.5, cx: 750, cy: 210, s: 1.85 },
            { t: 21.9, cx: 750, cy: 212, s: 1.88 },
          ],
          highlights: [
            { x: 204, y: 38, w: 245, h: 36, start: 1.2 },
            { x: 983.7, y: 161.4, w: 76.5, h: 18, start: 3.6 },
            { x: 204, y: 187.4, w: 211.7, h: 18, start: 4.13 },
            { x: 591.8, y: 527.2, w: 486.6, h: 18, start: 8.0 },
            { x: 204, y: 553.2, w: 506, h: 18, start: 8.53 },
            { x: 428.2, y: 213.4, w: 302.4, h: 18, start: 20.6 },
          ],
          photos: [
            {
              src: "singham_ch1/castro_archibald_1980.jpg",
              caption: "CASTRO & ARCHIBALD SINGHAM · 1980",
              x: 2020,
              y: 760,
              w: 760,
              rot: -2.5,
              start: 11.6,
              string: { x1: 2020, y1: 450, x2: 1120, y2: 210, sag: 70, start: 13.2 },
            },
          ],
          durationInFrames: 660,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames ?? 660,
        })}
      />

      {/* Beat 4 — the Non-Aligned Movement: Wikipedia article -> real member-states map.
          Narration 38.4-49.5s; place on V2 at 38.4s. */}
      <Composition
        id="FernNamStory"
        component={FernArticleClip}
        durationInFrames={335}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: "singham_ch1/articles/wiki_nam.png",
          imgW: 1320,
          imgH: 950,
          shots: [
            { t: 0, cx: 660, cy: 420, s: 0.95 },
            { t: 1.0, cx: 560, cy: 170, s: 1.8 },
            { t: 3.6, cx: 565, cy: 175, s: 1.82 },
            { t: 4.4, cx: 2425, cy: 582, s: 1.9 },
            { t: 5.1, cx: 2181, cy: 675, s: 1.85 },
            { t: 6.4, cx: 1722, cy: 582, s: 1.9 },
            { t: 8.2, cx: 2150, cy: 680, s: 1.12 },
            { t: 11.1, cx: 2150, cy: 685, s: 1.15 },
          ],
          highlights: [
            { x: 204, y: 38, w: 308, h: 36, start: 0.3 },
            { x: 317.8, y: 213.4, w: 424.3, h: 18, start: 1.2 },
            { x: 204, y: 239.4, w: 163, h: 18, start: 1.73 },
          ],
          photos: [
            {
              src: "singham_ch1/nam_members_map.png",
              caption: "NON-ALIGNED MOVEMENT · MEMBER STATES",
              x: 2150,
              y: 700,
              w: 1560,
              rot: 1.5,
              start: 3.4,
              string: { x1: 1310, y1: 230, x2: 2150, y2: 260, sag: 50, start: 3.6 },
            },
          ],
          durationInFrames: 335,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames ?? 335,
        })}
      />

      {/* Beat 4b — Archibald's NAM writing in The Black Scholar + "black scholars
          (despite his Asian heritage)". Narration 49.6-55.3s; place on V2 at 49.6s. */}
      <Composition
        id="FernBlackScholar"
        component={FernArticleClip}
        durationInFrames={171}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: "singham_ch1/articles/wiki_archibald.png",
          imgW: 1320,
          imgH: 1940,
          shots: [
            { t: 0, cx: 660, cy: 1060, s: 1.3 },
            { t: 0.9, cx: 670, cy: 1095, s: 1.72 },
            { t: 3.7, cx: 672, cy: 1098, s: 1.74 },
            { t: 4.5, cx: 660, cy: 495, s: 1.78 },
            { t: 5.6, cx: 662, cy: 497, s: 1.8 },
          ],
          highlights: [
            { x: 398.6, y: 1084.3, w: 445.4, h: 18, start: 0.5 },
            { x: 843.9, y: 1084.3, w: 129.8, h: 18, start: 2.6 },
            { x: 830.1, y: 475.2, w: 237.3, h: 18, start: 4.5 },
            { x: 204, y: 501.2, w: 63.1, h: 18, start: 4.85 },
          ],
          durationInFrames: 171,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames ?? 171,
        })}
      />
      {/* Beat 5 — the mother: NLPC "The Other Soros" clipping, slow searching scan,
          "a Cuban mother" highlight. Narration 55.4-67.2s; place on V2 at 55.4s. */}
      <Composition
        id="FernMotherStory"
        component={FernArticleClip}
        durationInFrames={354}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: "singham_ch1/articles/nlpc_othersoros.png",
          imgW: 1320,
          imgH: 2200,
          shots: [
            { t: 0, cx: 660, cy: 560, s: 0.9 },
            { t: 2.5, cx: 640, cy: 400, s: 1.35 },
            { t: 5.5, cx: 650, cy: 800, s: 1.45 },
            { t: 7.8, cx: 650, cy: 1300, s: 1.55 },
            { t: 9.6, cx: 620, cy: 1500, s: 1.8 },
            { t: 11.7, cx: 622, cy: 1502, s: 1.82 },
          ],
          highlights: [{ x: 337.2, y: 1439.2, w: 437.1, h: 22, start: 10.2 }],
          durationInFrames: 354,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames ?? 354,
        })}
      />

      {/* Beat 6 — the youth: ThoughtWorks company-history profile (England, Jamaica,
          UWI night school at 15, Michigan at 16) + pinned Archibald UWI-Mona strip.
          Narration 77.0-106.5s; place on V2 at 77.0s. */}
      <Composition
        id="FernYouthStory"
        component={FernArticleClip}
        durationInFrames={885}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          src: "singham_ch1/articles/ency_thoughtworks.png",
          imgW: 940,
          imgH: 1880,
          shots: [
            { t: 0, cx: 470, cy: 380, s: 1.15 },
            { t: 2.9, cx: 470, cy: 400, s: 1.18 },
            { t: 4.0, cx: 470, cy: 1340, s: 1.75 },
            { t: 16.5, cx: 478, cy: 1350, s: 1.79 },
            { t: 17.9, cx: 1500, cy: 1332, s: 1.75 },
            { t: 23.8, cx: 1502, cy: 1334, s: 1.78 },
            { t: 26.8, cx: 1050, cy: 1300, s: 0.85 },
            { t: 29.4, cx: 1050, cy: 1302, s: 0.86 },
          ],
          highlights: [
            { x: 77.2, y: 75.2, w: 218, h: 30, start: 0.5 },
            { x: 437.2, y: 1214.9, w: 408.5, h: 25, start: 3.2 },
            { x: 77.2, y: 1250.1, w: 107.6, h: 25, start: 3.73 },
            { x: 197, y: 1250.1, w: 419.5, h: 25, start: 6.5 },
            { x: 568.9, y: 1377.7, w: 281.3, h: 25, start: 9.3 },
            { x: 77.2, y: 1412.9, w: 437.4, h: 25, start: 9.83 },
            { x: 561, y: 1412.9, w: 238.5, h: 25, start: 12.9 },
            { x: 77.2, y: 1448.1, w: 270.4, h: 25, start: 13.43 },
          ],
          clippings: [
            {
              src: "singham_ch1/articles/wiki_archibald_uwi_strip.png",
              imgW: 960,
              imgH: 130,
              x: 1020,
              y: 1270,
              rot: -1.5,
              start: 17.0,
              highlights: [
                { x: 153, y: 31.2, w: 499.9, h: 18, start: 18.2 },
                { x: 652.8, y: 31.2, w: 202.5, h: 18, start: 18.73 },
                { x: 55.1, y: 57.2, w: 219.7, h: 18, start: 21.8 },
              ],
              string: { x1: 920, y1: 1340, x2: 1290, y2: 1285, sag: 45, start: 17.3 },
            },
          ],
          durationInFrames: 885,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames ?? 885,
        })}
      />

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
