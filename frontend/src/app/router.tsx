import { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router";
import { AppNavigation } from "./AppNavigation";

const HomePage = lazy(() =>
  import("../features/home/pages/HomePage").then((module) => ({
    default: module.HomePage,
  })),
);

const MultiplayerPage = lazy(() =>
  import("../features/multiplayer/pages/MultiplayerPage").then((module) => ({
    default: module.MultiplayerPage,
  })),
);

const PartyPage = lazy(() =>
  import("../features/party/pages/PartyPage").then((module) => ({
    default: module.PartyPage,
  })),
);

const SingleplayerPage = lazy(() =>
  import("../features/singleplayer/pages/SingleplayerPage").then((module) => ({
    default: module.SingleplayerPage,
  })),
);

const CreateCharacterPage = lazy(() =>
  import("../features/auth/pages/CreateCharacterPage").then((module) => ({
    default: module.CreateCharacterPage,
  })),
);

const LoginPage = lazy(() =>
  import("../features/auth/pages/LoginPage").then((module) => ({
    default: module.LoginPage,
  })),
);

const EditProfilePage = lazy(() =>
  import("../features/auth/pages/EditProfilePage").then((module) => ({
    default: module.EditProfilePage,
  })),
);

const PlayerProfilePage = lazy(() =>
  import("../features/auth/pages/PlayerProfilePage").then((module) => ({
    default: module.PlayerProfilePage,
  })),
);

const AvatarCatalogPage = lazy(() =>
  import("../features/catalog/pages/AvatarCatalogPage").then((module) => ({
    default: module.AvatarCatalogPage,
  })),
);

const AchievementCatalogPage = lazy(() =>
  import("../features/catalog/pages/AchievementCatalogPage").then((module) => ({
    default: module.AchievementCatalogPage,
  })),
);

const AppLayout = () => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c21] text-[#e5e3ff]">
        <div className="glass-panel rounded-4xl px-8 py-6 text-center">
          <p className="font-headline text-lg font-bold">Ładowanie trybu...</p>
        </div>
      </div>
    }
  >
    <div className="min-h-screen  text-[#e5e3ff] md:pb-0">
      <AppNavigation />
      <Outlet />
    </div>
  </Suspense>
);

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "singleplayer",
        element: <SingleplayerPage />,
      },
      {
        path: "profile",
        element: <PlayerProfilePage />,
      },
      {
        path: "profile/edit",
        element: <EditProfilePage />,
      },
      {
        path: "avatars",
        element: <AvatarCatalogPage />,
      },
      {
        path: "achievements",
        element: <AchievementCatalogPage />,
      },
      {
        path: "auth/create-character",
        element: <CreateCharacterPage />,
      },
      {
        path: "auth/login",
        element: <LoginPage />,
      },
      {
        path: "multiplayer",
        element: <MultiplayerPage />,
      },
      {
        path: "party",
        element: <PartyPage />,
      },
    ],
  },
]);
