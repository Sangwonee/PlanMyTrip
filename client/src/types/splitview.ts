export interface SplitViewStoreType {
  showSplitView: boolean;

  setSplitViewOpen: (open: boolean) => void;
  toggleSplitView: () => void;
}
