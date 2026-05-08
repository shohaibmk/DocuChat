import { create } from "zustand";

/**
 * Auth store — single source of truth for the user's signed-in state.
 *
 * Kept intentionally tiny: route guards and the axios interceptor read
 * `isAuthenticated` to decide redirects and Authorization headers. Token
 * persistence (httpOnly cookie / refresh flow) lives outside this store.
 */
interface AuthState {
  /** True once the session has been verified against the backend. */
  isAuthenticated: boolean;
  /** Flip on successful login / verify, off on logout or 401. */
  setIsAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
}));
