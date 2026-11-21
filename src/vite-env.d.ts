/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_DEV_TOOLS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Test helpers exposed only when dev tools are enabled (see utils/devTools.ts). */
interface Window {
  shopeaseDev?: {
    resetData: () => void;
    resetAndReload: () => void;
    demoUser: { email: string; password: string };
  };
}
