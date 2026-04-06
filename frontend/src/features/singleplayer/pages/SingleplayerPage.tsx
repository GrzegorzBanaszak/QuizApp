import { useEffect } from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../../auth/store/authStore";
import { GameplayView } from "../components/GameplayView";
import { LevelSelectView } from "../components/LevelSelectView";
import { ResultView } from "../components/ResultView";
import { SingleplayerBackground } from "../components/SingleplayerBackground";
import { SingleplayerBottomNav } from "../components/SingleplayerBottomNav";
import { SingleplayerHomeView } from "../components/SingleplayerHomeView";
import { fetchSingleplayerCategories } from "../services/singleplayerApi";
import { useSingleplayerStore } from "../store/singleplayerStore";
import { scrollToTop } from "../utils/scrollToTop";

export const SingleplayerPage = () => {
  const session = useAuthStore((state) => state.session);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const screen = useSingleplayerStore((state) => state.screen);
  const hydrateCategories = useSingleplayerStore(
    (state) => state.hydrateCategories,
  );
  const setCategoriesLoading = useSingleplayerStore(
    (state) => state.setCategoriesLoading,
  );
  const setCategoriesError = useSingleplayerStore(
    (state) => state.setCategoriesError,
  );

  useEffect(() => {
    if (screen === "levelSelect" || screen === "result") {
      scrollToTop();
    }
  }, [screen]);

  useEffect(() => {
    if (!session) {
      return;
    }

    let isCancelled = false;

    setCategoriesLoading(true);
    setCategoriesError(null);

    void fetchSingleplayerCategories()
      .then((categories) => {
        if (isCancelled) {
          return;
        }

        hydrateCategories(categories);
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        hydrateCategories([]);
        setCategoriesError(
          error instanceof Error
            ? error.message
            : "Nie udało się pobrać kategorii singleplayer.",
        );
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }

        setCategoriesLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [hydrateCategories, session, setCategoriesError, setCategoriesLoading]);

  if (!isAuthInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c21] text-[#e5e3ff]">
        <div className="glass-panel rounded-[2rem] px-8 py-6 text-center">
          <p className="font-headline text-lg font-bold">
            Ładowanie trybu singleplayer...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c21] text-[#e5e3ff] pb-12 xl:pb-0">
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
