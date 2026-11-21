import { useState } from 'react';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { subscribeNewsletter } from '../../services/db';
import { rules } from '../../utils/validation';
import FormField from './FormField';

export default function NewsletterForm() {
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ email: string }>({ defaultValues: { email: '' } });

  const onSubmit = ({ email }: { email: string }) => {
    const result = subscribeNewsletter(email);
    setMessage(
      result === 'subscribed' ? 'Thanks for subscribing. Look out for our next edit.' : 'You are already subscribed with this email.',
    );
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-md" data-testid="newsletter-form">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <FormField
          testId="newsletter-email"
          label="Email address"
          type="email"
          autoComplete="email"
          registration={register('email', rules.email)}
          error={errors.email}
        />
        <Button type="submit" variant="contained" size="large" data-testid="newsletter-submit" sx={{ minHeight: 56, flexShrink: 0 }}>
          Subscribe
        </Button>
      </div>
      {message && (
        <p role="status" data-testid="newsletter-success" className="mt-3 text-sm text-brand-700">
          {message}
        </p>
      )}
    </form>
  );
}
