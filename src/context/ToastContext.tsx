import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Alert, Snackbar, type AlertColor } from '@mui/material';

interface ToastContextValue {
  notify: (message: string, severity?: AlertColor) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as AlertColor, key: 0 });

  const notify = useCallback((message: string, severity: AlertColor = 'success') => {
    setToast((t) => ({ open: true, message, severity, key: t.key + 1 }));
  }, []);

  const close = () => setToast((t) => ({ ...t, open: false }));
  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        key={toast.key}
        open={toast.open}
        autoHideDuration={3500}
        onClose={(_, reason) => {
          if (reason !== 'clickaway') close();
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert data-testid="toast" severity={toast.severity} variant="filled" onClose={close} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
