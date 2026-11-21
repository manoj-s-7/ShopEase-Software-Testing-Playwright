import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
  message?: string;
}

/** Redirects guests to /login and returns them to the page they wanted afterwards. */
export default function ProtectedRoute({ children, message = 'Please sign in to continue.' }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search, notice: message }} />;
  }
  return <>{children}</>;
}
