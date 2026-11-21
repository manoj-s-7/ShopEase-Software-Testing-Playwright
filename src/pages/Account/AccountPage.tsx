import { useState } from 'react';
import { Alert, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/common/PageHeader';
import FormField from '../../components/forms/FormField';
import PasswordField from '../../components/forms/PasswordField';
import { useAuth } from '../../context/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { getOrders } from '../../services/db';
import { formatShortDate, initials } from '../../utils/format';
import { MESSAGES, rules } from '../../utils/validation';

interface ProfileValues {
  name: string;
  phone: string;
  address: string;
}
interface PasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountPage() {
  useDocumentTitle('My account');
  const { user, updateProfile, changePassword } = useAuth();
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const profile = useForm<ProfileValues>({ defaultValues: { name: user?.name ?? '', phone: user?.phone ?? '', address: user?.address ?? '' } });
  const password = useForm<PasswordValues>({ defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' } });

  if (!user) return null;
  const orderCount = getOrders(user.id).length;

  const saveProfile = (v: ProfileValues) => {
    setProfileSaved(false);
    const res = updateProfile(v);
    if (res.ok) setProfileSaved(true);
  };

  const savePassword = (v: PasswordValues) => {
    setPasswordSaved(false);
    const res = changePassword(v.currentPassword, v.newPassword);
    if (!res.ok) {
      password.setError('currentPassword', { type: 'server', message: res.error });
      return;
    }
    password.reset();
    setPasswordSaved(true);
  };

  return (
    <PageContainer className="pb-6">
      <PageHeader title="My account" description="Manage your details and password." testId="account-title" />
      <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-line bg-surface p-6" data-testid="account-summary" aria-label="Account information">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-lg font-semibold text-white">{initials(user.name)}</span>
          <p data-testid="account-name" className="mt-4 text-lg font-semibold text-ink">{user.name}</p>
          <p data-testid="account-email" className="text-sm text-muted">{user.email}</p>
          <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Member since</dt>
              <dd data-testid="account-since" className="text-ink">{formatShortDate(user.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Orders placed</dt>
              <dd data-testid="account-orders" className="text-ink">{orderCount}</dd>
            </div>
          </dl>
        </aside>

        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-surface p-6" aria-labelledby="profile-heading">
            <h2 id="profile-heading" className="text-lg font-semibold text-ink">Profile</h2>
            <form onSubmit={profile.handleSubmit(saveProfile)} noValidate className="mt-5 grid gap-4 sm:grid-cols-2" data-testid="profile-form" aria-label="Profile">
              {profileSaved && (
                <div className="sm:col-span-2">
                  <Alert severity="success" data-testid="profile-success">Profile updated successfully.</Alert>
                </div>
              )}
              <FormField testId="profile-name" label="Full name" registration={profile.register('name', rules.name)} error={profile.formState.errors.name} />
              <FormField testId="profile-email" label="Email" value={user.email} disabled helperText="Email cannot be changed." registration={{ name: 'email', onChange: async () => {}, onBlur: async () => {}, ref: () => {} }} />
              <FormField testId="profile-phone" label="Phone number" type="tel" registration={profile.register('phone', rules.phoneOptional)} error={profile.formState.errors.phone} />
              <FormField testId="profile-address" label="Address" registration={profile.register('address', rules.addressOptional)} error={profile.formState.errors.address} />
              <div className="sm:col-span-2">
                <Button type="submit" variant="contained" data-testid="profile-submit">Save changes</Button>
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-6" aria-labelledby="password-heading">
            <h2 id="password-heading" className="text-lg font-semibold text-ink">Change password</h2>
            <form onSubmit={password.handleSubmit(savePassword)} noValidate className="mt-5 grid max-w-md gap-4" data-testid="password-form" aria-label="Change password">
              {passwordSaved && <Alert severity="success" data-testid="password-success">Password changed successfully.</Alert>}
              <PasswordField testId="current-password" label="Current password" autoComplete="current-password" registration={password.register('currentPassword', rules.loginPassword)} error={password.formState.errors.currentPassword} />
              <PasswordField
                testId="new-password"
                label="New password"
                autoComplete="new-password"
                registration={password.register('newPassword', {
                  validate: {
                    ...rules.newPassword('New password').validate,
                    different: (v: string) => v !== password.getValues('currentPassword') || MESSAGES.passwordSame,
                  },
                })}
                error={password.formState.errors.newPassword}
              />
              <PasswordField
                testId="confirm-new-password"
                label="Confirm new password"
                autoComplete="new-password"
                registration={password.register('confirmPassword', {
                  validate: {
                    required: (v: string) => v !== '' || MESSAGES.required('Confirm password'),
                    match: (v: string) => v === password.getValues('newPassword') || MESSAGES.passwordMatch,
                  },
                })}
                error={password.formState.errors.confirmPassword}
              />
              <div>
                <Button type="submit" variant="contained" data-testid="password-submit">Update password</Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
