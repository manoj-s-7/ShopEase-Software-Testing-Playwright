/**
 * Central validation rules and messages. Every form uses these so the
 * messages stay identical across the app (handy for automated tests).
 */
export const MESSAGES = {
  required: (label: string) => `${label} is required.`,
  name: 'Name must be at least 2 characters.',
  email: 'Enter a valid email address.',
  phone: 'Enter a valid 10-digit phone number.',
  postalCode: 'Enter a valid 5 or 6 digit postal code.',
  address: 'Address must be at least 5 characters.',
  passwordMin: 'Password must be at least 8 characters.',
  passwordComplexity: 'Password must include an uppercase letter, a lowercase letter and a number.',
  passwordMatch: 'Passwords do not match.',
  passwordSame: 'New password must be different from the current password.',
  terms: 'You must accept the terms and conditions.',
  invalidCredentials: 'Invalid email or password.',
  duplicateEmail: 'An account with this email already exists.',
  wrongCurrentPassword: 'Current password is incorrect.',
  quantity: (max: number) => `Quantity must be between 1 and ${max}.`,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\d{10}$/;
const POSTAL_RE = /^\d{5,6}$/;

export const isValidEmail = (v: string) => EMAIL_RE.test(v.trim());
export const isValidPhone = (v: string) => PHONE_RE.test(v.replace(/[\s-]/g, ''));
export const isValidPostalCode = (v: string) => POSTAL_RE.test(v.trim());

export const validators = {
  required: (label: string) => (v: string) => v.trim() !== '' || MESSAGES.required(label),
  name: (v: string) => v.trim().length >= 2 || MESSAGES.name,
  email: (v: string) => isValidEmail(v) || MESSAGES.email,
  phone: (v: string) => isValidPhone(v) || MESSAGES.phone,
  postalCode: (v: string) => isValidPostalCode(v) || MESSAGES.postalCode,
  address: (v: string) => v.trim().length >= 5 || MESSAGES.address,
  passwordMin: (v: string) => v.length >= 8 || MESSAGES.passwordMin,
  passwordComplexity: (v: string) =>
    (/[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v)) || MESSAGES.passwordComplexity,
};

/** Reusable react-hook-form rule sets. */
export const rules = {
  name: { validate: { required: validators.required('Full name'), format: validators.name } },
  email: { validate: { required: validators.required('Email'), format: validators.email } },
  phone: { validate: { required: validators.required('Phone number'), format: validators.phone } },
  phoneOptional: { validate: (v: string) => v.trim() === '' || validators.phone(v) },
  address: { validate: { required: validators.required('Address'), format: validators.address } },
  addressOptional: { validate: (v: string) => v.trim() === '' || validators.address(v) },
  city: { validate: { required: validators.required('City') } },
  state: { validate: { required: validators.required('State') } },
  postalCode: { validate: { required: validators.required('Postal code'), format: validators.postalCode } },
  loginPassword: { validate: { required: (v: string) => v !== '' || MESSAGES.required('Password') } },
  newPassword: (label = 'Password') => ({
    validate: {
      required: (v: string) => v !== '' || MESSAGES.required(label),
      min: validators.passwordMin,
      complexity: validators.passwordComplexity,
    },
  }),
};
