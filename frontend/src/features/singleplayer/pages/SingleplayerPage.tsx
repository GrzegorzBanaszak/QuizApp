import { GameplayView } from "../components/GameplayView";
import { LevelSelectView } from "../components/LevelSelectView";
import { ResultView } from "../components/ResultView";
import { SingleplayerBackground } from "../components/SingleplayerBackground";
import { SingleplayerBottomNav } from "../components/SingleplayerBottomNav";
import { SingleplayerHomeView } from "../components/SingleplayerHomeView";
import { useSingleplayerStore } from "../store/singleplayerStore";

export const SingleplayerPage = () => {
  const screen = useSingleplayerStore((state) => state.screen);
  const profile = useSingleplayerStore((state) => state.profile);
  const shouldRenderHome = screen === "home" || !profile;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c21] text-[#e5e3ff]">
      <SingleplayerBackground />

      {shouldRenderHome ? (
        <>
          <SingleplayerHomeView />
          <SingleplayerBottomNav />
        </>
      ) : null}

      {screen === "levelSelect" && profile ? <LevelSelectView /> : null}

      {screen === "gameplay" ? <GameplayView /> : null}

      {screen === "result" ? <ResultView /> : null}
    </div>
  );
};
