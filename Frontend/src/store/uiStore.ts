import { create } from "zustand";
import type { UploadEntry } from "../types/upload";

/**
 * UI store — cross-component view state that doesn't belong in URL or server cache.
 *
 * Owns two concerns today:
 *  1. The active chat session id, shared between UploadZone (which lazily creates
 *     a session on first file drop) and the dashboard pages that key requests off it.
 *  2. The list of in-flight / completed upload entries. Lifted out of UploadZone so
 *     NewChat can gate its submit button on `every entry === "uploaded"` without
 *     prop-drilling or duplicating status tracking.
 */
interface UIState {
  /** Current chat session id; null on a fresh /new before any upload. */
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;

  /** Canonical upload list. Order matches insertion order so the UI renders stably. */
  uploadEntries: UploadEntry[];
  /** Append entries; existing keys are skipped to keep AbortControllers unique. */
  addUploadEntries: (entries: UploadEntry[]) => void;
  /** Mutate one entry by key — used to advance status (requesting → ready → uploaded). */
  patchUploadEntry: (key: string, patch: Partial<UploadEntry>) => void;
  /** Drop a single entry; caller is responsible for aborting its controller first. */
  removeUploadEntry: (key: string) => void;
  /** Wipe the list — called on NewChat mount so a stale session doesn't carry over. */
  clearUploadEntries: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentSessionId: null,
  setCurrentSessionId: (id) => set({ currentSessionId: id }),

  uploadEntries: [],

  addUploadEntries: (entries) =>
    set((state) => {
      // Dedupe against the live list — protects against React Strict Mode's
      // double-invocation, which would otherwise spawn duplicate uploads.
      const existing = new Set(state.uploadEntries.map((e) => e.key));
      const toAdd = entries.filter((e) => !existing.has(e.key));
      if (toAdd.length === 0) return state;
      return { uploadEntries: [...state.uploadEntries, ...toAdd] };
    }),

  patchUploadEntry: (key, patch) =>
    set((state) => ({
      uploadEntries: state.uploadEntries.map((e) => (e.key === key ? { ...e, ...patch } : e)),
    })),

  removeUploadEntry: (key) =>
    set((state) => ({ uploadEntries: state.uploadEntries.filter((e) => e.key !== key) })),

  clearUploadEntries: () => set({ uploadEntries: [] }),
}));
