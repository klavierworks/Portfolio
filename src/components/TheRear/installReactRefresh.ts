type RefreshWindow = Window & {
  $RefreshReg$?: () => void;
  $RefreshSig$?: () => (type: unknown) => unknown;
  __vite_plugin_react_preamble_installed__?: boolean;
};

const REFRESH_RUNTIME_URL = '/@react-refresh';

// Astro only adds React's hot-reload preamble to pages with React islands. TheRear is mounted from a
// plain script instead, and in dev every .tsx module throws if the preamble is missing.
export const installReactRefresh = async () => {
  if (!import.meta.env.DEV) {
    return;
  }
  const refreshWindow = window as RefreshWindow;
  if (refreshWindow.__vite_plugin_react_preamble_installed__) {
    return;
  }
  const { default: refreshRuntime } = await import(/* @vite-ignore */ REFRESH_RUNTIME_URL);
  refreshRuntime.injectIntoGlobalHook(window);
  refreshWindow.$RefreshReg$ = () => {};
  refreshWindow.$RefreshSig$ = () => (type) => type;
  refreshWindow.__vite_plugin_react_preamble_installed__ = true;
};
