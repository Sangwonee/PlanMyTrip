import { create } from "zustand";
import type { SplitViewStoreType } from "../types/splitview";

export const useSplitViewStore = create<SplitViewStoreType>()((set) => ({
  showSplitView: false,

  setSplitViewOpen: (open: boolean) => {
    set({ showSplitView: open });
  },

  toggleSplitView: () => {
    set((state) => ({ showSplitView: !state.showSplitView }));
  },
}));
