import { RouterProvider } from "react-router";
import { useEffect } from "react";
import { appRouter } from "./app/router";
import { fetchCurrentUser } from "./features/auth/services/authApi";
import { useAuthStore } from "./features/auth/store/authStore";

function SessionBootstrap() {
  const setSession = useAuthStore((state) => state.setSession);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setAuthInitialized = useAuthStore((state) => state.setAuthInitialized);

  useEffect(() => {
    void fetchCurrentUser()
      .then((profile) => {
        setSession({ profile });
      })
      .catch(() => {
        clearAuth();
      })
      .finally(() => {
        setAuthInitialized(true);
      });
  }, [clearAuth, setAuthInitialized, setSession]);

  return null;
}

function App() {
  return (
    <>
      <SessionBootstrap />
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
