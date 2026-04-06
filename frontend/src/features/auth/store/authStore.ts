import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchCurrentUser } from "../services/authApi";
import type { AuthSession, PendingSocialLogin } from "../types";

interface AuthState {
  session: AuthSession | null;
  pendingSocialLogin: PendingSocialLogin | null;
  isGoogleLoginLoading: boolean;
  isFacebookLoginLoading: boolean;
  isAuthInitialized: boolean;
  error: string | null;
  setSession: (session: AuthSession | null) => void;
  setPendingSocialLogin: (value: PendingSocialLogin | null) => void;
  setGoogleLoginLoading: (value: boolean) => void;
  setFacebookLoginLoading: (value: boolean) => void;
  setAuthInitialized: (value: boolean) => void;
  setError: (value: string | null) => void;
  refreshSession: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      pendingSocialLogin: null,
      isGoogleLoginLoading: false,
      isFacebookLoginLoading: false,
      isAuthInitialized: false,
      error: null,
      setSession: (session) => set({ session }),
      setPendingSocialLogin: (value) => set({ pendingSocialLogin: value }),
      setGoogleLoginLoading: (value) => set({ isGoogleLoginLoading: value }),
      setFacebookLoginLoading: (value) =>
        set({ isFacebookLoginLoading: value }),
      setAuthInitialized: (value) => set({ isAuthInitialized: value }),
      setError: (value) => set({ error: value }),
      refreshSession: async () => {
        const profile = await fetchCurrentUser();
        set({ session: { profile } });
      },
      clearAuth: () =>
        set({
          session: null,
          pendingSocialLogin: null,
          isGoogleLoginLoading: false,
          isFacebookLoginLoading: false,
          error: null,
        }),
    }),
    {
      name: "quizapp-auth",
      partialize: (state) => ({
        session: state.session,
        pendingSocialLogin: state.pendingSocialLogin,
      }),
    },
  ),
);
