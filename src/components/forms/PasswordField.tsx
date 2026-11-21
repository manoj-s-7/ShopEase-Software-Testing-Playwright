import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import FormField from './FormField';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof FormField>, 'type' | 'endAdornment'>;

export default function PasswordField(props: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <FormField
      {...props}
      type={visible ? 'text' : 'password'}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            type="button"
            edge="end"
            size="small"
            aria-label={visible ? 'Hide password' : 'Show password'}
            data-testid={`${props.testId}-toggle`}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
}
