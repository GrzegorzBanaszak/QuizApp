import { GameplayView } from "../components/GameplayView";
import { LevelSelectView } from "../components/LevelSelectView";
import { ResultView } from "../components/ResultView";
import { SingleplayerBackground } from "../components/SingleplayerBackground";
import { SingleplayerBottomNav } from "../components/SingleplayerBottomNav";
import { SingleplayerHomeView } from "../components/SingleplayerHomeView";
import { useSingleplayerStore } from "../store/singleplayerStore";

export const SingleplayerPage = () => {
  const screen = useSingleplayerStore((state) => state.screen);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c21] text-[#e5e3ff]">
      <SingleplayerBackground />

      {screen === "home" ? (
        <>
          <SingleplayerHomeView />
          <SingleplayerBottomNav />
        </>
      ) : null}

      {screen === "levelSelect" ? <LevelSelectView /> : null}

      {screen === "gameplay" ? <GameplayView /> : null}

      {screen === "result" ? <ResultView /> : null}
    </div>
  );
};
