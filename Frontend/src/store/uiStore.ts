import { create } from "zustand";

interface UIState {
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentSessionId: null,
  setCurrentSessionId: (id) => set({ currentSessionId: id }),
}));
