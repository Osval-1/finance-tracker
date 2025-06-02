import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";
import { setJwtToken, removeJwtToken } from "@/lib/axios";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateToken: (token: string, refreshToken?: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      updateToken: (token: string, refreshToken?: string) => {
        setJwtToken(token);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }
        set(() => ({
          token,
          refreshToken: refreshToken || null,
          isAuthenticated: !!token,
        }));
      },

      setUser: (user: User) => {
        set(() => ({
          user,
          isAuthenticated: true,
        }));
      },

      logout: () => {
        removeJwtToken();
        set(() => ({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }));
      },

      setLoading: (loading: boolean) => {
        set(() => ({ isLoading: loading }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
