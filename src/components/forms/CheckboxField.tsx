import type { ReactNode } from 'react';
import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  registration: UseFormRegisterReturn;
  label: ReactNode;
  testId: string;
  error?: FieldError;
}

export default function CheckboxField({ registration, label, testId, error }: Props) {
  const { ref, ...field } = registration;
  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            {...field}
            id={testId}
            slotProps={{ input: { ref, 'data-testid': testId, 'aria-invalid': error ? true : undefined } as object }}
          />
        }
        label={label}
        sx={{ alignItems: 'flex-start', '& .MuiCheckbox-root': { pt: 0.75 } }}
      />
      {error && (
        <FormHelperText error role="alert" data-testid={`${testId}-error`} sx={{ mt: 0, ml: 0.5 }}>
          {error.message}
        </FormHelperText>
      )}
    </div>
  );
}
