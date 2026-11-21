import { DEMO_USER, resetDemoData } from '../services/db';

/**
 * Test helpers are available in `npm run dev` and in builds made with
 * VITE_ENABLE_DEV_TOOLS=true (see `npm run preview:test`). A regular production
 * build exposes nothing.
 */
export const DEV_TOOLS_ENABLED: boolean =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true';

export function registerDevHooks(): void {
  if (!DEV_TOOLS_ENABLED) return;
  window.shopeaseDev = {
    resetData: resetDemoData,
    resetAndReload: () => {
      resetDemoData();
      window.location.assign('/');
    },
    demoUser: { email: DEMO_USER.email, password: DEMO_USER.password },
  };
}
