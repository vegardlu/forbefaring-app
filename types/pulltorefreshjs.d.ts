declare module "pulltorefreshjs" {
  export interface PTRConfig {
    mainElement?: string;
    onRefresh?: () => void;
    shouldPullToRefresh?: () => boolean;
    instructionsPullToRefresh?: string;
    instructionsReleaseToRefresh?: string;
    instructionsRefreshing?: string;
  }
  const PullToRefresh: {
    init: (config: PTRConfig) => void;
    destroyAll: () => void;
  };
  export default PullToRefresh;
}
