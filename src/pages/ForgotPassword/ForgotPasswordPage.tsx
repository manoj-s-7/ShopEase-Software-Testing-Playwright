import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import AuthShell from '../../components/layout/AuthShell';
import FormField from '../../components/forms/FormField';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { rules } from '../../utils/validation';

export default function ForgotPasswordPage() {
  useDocumentTitle('Reset password');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({ defaultValues: { email: '' } });

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we will send you a reset link."
      footer={
        <Link to="/login" data-testid="back-to-login" className="font-semibold text-brand-600 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit(({ email }) => setSentTo(email.trim()))} noValidate className="flex flex-col gap-4" data-testid="forgot-form" aria-label="Reset password">
        {sentTo && (
          <Alert severity="success" data-testid="forgot-success">
            If an account exists for {sentTo}, a reset link is on its way. This is a demo, so no email is actually sent.
          </Alert>
        )}
        <FormField testId="forgot-email" label="Email" type="email" autoComplete="email" registration={register('email', rules.email)} error={errors.email} />
        <Button type="submit" variant="contained" size="large" data-testid="forgot-submit">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
