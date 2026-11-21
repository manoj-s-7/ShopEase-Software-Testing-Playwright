import { useEffect } from 'react';
import { resetDemoData } from '../../services/db';

/** Dev/test only (see routes/AppRoutes.tsx): clears all ShopEase data, re-seeds the demo user and reloads at "/". */
export default function DevResetPage() {
  useEffect(() => {
    resetDemoData();
    window.location.replace('/');
  }, []);
  return (
    <p data-testid="dev-reset-status" className="p-10 text-center text-sm text-muted" role="status">
      Resetting demo data...
    </p>
  );
}
