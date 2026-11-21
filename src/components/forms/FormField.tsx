import type { ReactNode } from 'react';
import { TextField, type TextFieldProps } from '@mui/material';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = Omit<TextFieldProps, 'error' | 'name' | 'onChange' | 'onBlur' | 'ref' | 'slotProps' | 'id'> & {
  registration: UseFormRegisterReturn;
  error?: FieldError;
  /** Used as the input id and data-testid; the error text gets `${testId}-error`. */
  testId: string;
  endAdornment?: ReactNode;
};

export default function FormField({ registration, error, testId, helperText, endAdornment, ...rest }: Props) {
  const { ref, ...field } = registration;
  const errorProps = { 'data-testid': `${testId}-error`, role: 'alert' };
  return (
    <TextField
      {...rest}
      {...field}
      id={testId}
      inputRef={ref}
      error={Boolean(error)}
      helperText={error?.message ?? helperText}
      slotProps={{
        htmlInput: { 'data-testid': testId },
        formHelperText: error ? errorProps : {},
        input: endAdornment ? { endAdornment } : undefined,
      }}
    />
  );
}
