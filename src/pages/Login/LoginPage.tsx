import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import AuthShell from '../../components/layout/AuthShell';
import CheckboxField from '../../components/forms/CheckboxField';
import FormField from '../../components/forms/FormField';
import PasswordField from '../../components/forms/PasswordField';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DEMO_USER } from '../../services/db';
import { rules } from '../../utils/validation';

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

interface LocationState {
  from?: string;
  notice?: string;
  email?: string;
}

export default function LoginPage() {
  useDocumentTitle('Login');
  const { user, login } = useAuth();
  const { notify } = useToast();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    defaultValues: { email: state.email ?? '', password: '', remember: false },
  });

  if (user) return <Navigate to={state.from && state.from !== '/login' ? state.from : '/'} replace />;

  const onSubmit = (values: LoginValues) => {
    setFormError(null);
    const result = login(values.email, values.password, values.remember);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    notify('Welcome back. You are signed in.');
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to see your orders, wishlist and saved details."
      footer={
        <p>
          New to ShopEase?{' '}
          <Link to="/register" state={{ from: state.from }} data-testid="register-link" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4" data-testid="login-form" aria-label="Login">
        {state.notice && (
          <Alert severity={state.notice.startsWith('Account created') ? 'success' : 'info'} data-testid="login-notice">
            {state.notice}
          </Alert>
        )}
        {formError && (
          <Alert severity="error" data-testid="login-error" role="alert">
            {formError}
          </Alert>
        )}
        <FormField testId="login-email" label="Email" type="email" autoComplete="email" registration={register('email', rules.email)} error={errors.email} />
        <PasswordField testId="login-password" label="Password" autoComplete="current-password" registration={register('password', rules.loginPassword)} error={errors.password} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CheckboxField testId="login-remember" label="Remember me" registration={register('remember')} />
          <Link to="/forgot-password" data-testid="forgot-password-link" className="text-sm font-semibold text-brand-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting} data-testid="login-submit">
          Sign in
        </Button>
        <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700" data-testid="demo-credentials">
          Demo account: {DEMO_USER.email} / {DEMO_USER.password}
        </p>
      </form>
    </AuthShell>
  );
}
