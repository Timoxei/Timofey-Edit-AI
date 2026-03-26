import "./index.css";
import { Composition } from "remotion";
import { MyComposition, TOTAL_FRAMES } from "./Composition";
import { RedCircle, TOTAL_FRAMES as RED_CIRCLE_FRAMES } from "./RedCircle";
import { TypingText, TOTAL_FRAMES as TYPING_FRAMES } from "./TypingText";
import { SalaryArrow, TOTAL_FRAMES as SALARY_FRAMES } from "./SalaryArrow";
import { Thumbnail, TOTAL_FRAMES as THUMBNAIL_FRAMES } from "./Thumbnail";
import { Thumbnail2, TOTAL_FRAMES as THUMBNAIL2_FRAMES } from "./Thumbnail2";
import { Thumbnail3, TOTAL_FRAMES as THUMBNAIL3_FRAMES } from "./Thumbnail3";

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
    </>
  );
};
