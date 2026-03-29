import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSession, SocialProfileResponse } from "../types";

interface PendingGoogleLogin {
  profile: SocialProfileResponse;
  providerToken: string;
}

interface AuthState {
  session: AuthSession | null;
  pendingGoogleLogin: PendingGoogleLogin | null;
  isGoogleLoginLoading: boolean;
  error: string | null;
  setSession: (session: AuthSession | null) => void;
  setPendingGoogleLogin: (value: PendingGoogleLogin | null) => void;
  setGoogleLoginLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      pendingGoogleLogin: null,
      isGoogleLoginLoading: false,
      error: null,
      setSession: (session) => set({ session }),
      setPendingGoogleLogin: (value) => set({ pendingGoogleLogin: value }),
      setGoogleLoginLoading: (value) => set({ isGoogleLoginLoading: value }),
      setError: (value) => set({ error: value }),
      clearAuth: () =>
        set({
          session: null,
          pendingGoogleLogin: null,
          isGoogleLoginLoading: false,
          error: null,
        }),
    }),
    {
      name: "quizapp-auth",
      partialize: (state) => ({
        session: state.session,
        pendingGoogleLogin: state.pendingGoogleLogin,
      }),
    },
  ),
);

