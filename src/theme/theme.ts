import { createTheme } from '@mui/material/styles';

const sans = '"Inter Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const display = '"Manrope Variable", "Inter Variable", ui-sans-serif, system-ui, sans-serif';
const heading = { fontFamily: display, fontWeight: 700, letterSpacing: '-0.02em' } as const;

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3d3b8e', dark: '#2e2c6e', light: '#6c6ab5', contrastText: '#ffffff' },
    secondary: { main: '#6b6a75' },
    background: { default: '#faf9f7', paper: '#ffffff' },
    text: { primary: '#1c1b22', secondary: '#6b6a75' },
    divider: '#e8e6e1',
    error: { main: '#b42318' },
    success: { main: '#1a7f4b' },
    warning: { main: '#b54708' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: sans,
    h1: heading,
    h2: heading,
    h3: heading,
    h4: heading,
    h5: heading,
    h6: heading,
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: 20, minHeight: 40 },
        sizeLarge: { minHeight: 48, paddingInline: 28, fontSize: '0.95rem' },
      },
    },
    MuiTextField: { defaultProps: { fullWidth: true, variant: 'outlined' } },
    MuiOutlinedInput: { styleOverrides: { root: { backgroundColor: '#ffffff' } } },
    MuiAlert: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
    MuiMenu: { styleOverrides: { paper: { border: '1px solid #e8e6e1', boxShadow: '0 12px 32px rgba(28,27,34,0.08)' } } },
  },
});
