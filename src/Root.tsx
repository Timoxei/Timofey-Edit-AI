import "./index.css";
import { Composition } from "remotion";
import { MyComposition, TOTAL_FRAMES } from "./Composition";

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
    </>
  );
};
