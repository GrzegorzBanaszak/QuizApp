import { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router";

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

const EditProfilePage = lazy(() =>
  import("../features/auth/pages/CreateCharacterPage").then((module) => ({
    default: module.EditProfilePage,
  })),
);

const AppLayout = () => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c21] text-[#e5e3ff]">
        <div className="glass-panel rounded-[2rem] px-8 py-6 text-center">
          <p className="font-headline text-lg font-bold">Ładowanie trybu...</p>
        </div>
      </div>
    }
  >
    <div className="min-h-screen text-[#e5e3ff]">
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
        path: "profile/edit",
        element: <EditProfilePage />,
      },
      {
        path: "auth/create-character",
        element: <EditProfilePage />,
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
