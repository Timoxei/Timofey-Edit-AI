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
    </>
  );
};
