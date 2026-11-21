import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import AuthShell from '../../components/layout/AuthShell';
import CheckboxField from '../../components/forms/CheckboxField';
import FormField from '../../components/forms/FormField';
import PasswordField from '../../components/forms/PasswordField';
import { useAuth } from '../../context/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { MESSAGES, rules } from '../../utils/validation';

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export default function RegisterPage() {
  useDocumentTitle('Register');
  const { user, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const { register, handleSubmit, getValues, setError, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false },
  });

  if (user) return <Navigate to="/" replace />;

  const onSubmit = (values: RegisterValues) => {
    const result = registerUser({ name: values.name, email: values.email, password: values.password });
    if (!result.ok) {
      setError('email', { type: 'server', message: result.error });
      return;
    }
    navigate('/login', {
      replace: true,
      state: { from, email: values.email.trim().toLowerCase(), notice: 'Account created successfully. Please sign in.' },
    });
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Save your cart, track orders and check out faster."
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/login" data-testid="login-link" className="font-semibold text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4" data-testid="register-form" aria-label="Register">
        <FormField testId="register-name" label="Full name" autoComplete="name" registration={register('name', rules.name)} error={errors.name} />
        <FormField testId="register-email" label="Email" type="email" autoComplete="email" registration={register('email', rules.email)} error={errors.email} />
        <PasswordField
          testId="register-password"
          label="Password"
          autoComplete="new-password"
          helperText="At least 8 characters with upper case, lower case and a number."
          registration={register('password', rules.newPassword())}
          error={errors.password}
        />
        <PasswordField
          testId="register-confirm-password"
          label="Confirm password"
          autoComplete="new-password"
          registration={register('confirmPassword', {
            validate: {
              required: (v: string) => v !== '' || MESSAGES.required('Confirm password'),
              match: (v: string) => v === getValues('password') || MESSAGES.passwordMatch,
            },
          })}
          error={errors.confirmPassword}
        />
        <CheckboxField
          testId="register-terms"
          label={<span className="text-sm text-ink">I agree to the terms and conditions</span>}
          registration={register('terms', { validate: (v: boolean) => v || MESSAGES.terms })}
          error={errors.terms}
        />
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting} data-testid="register-submit">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
