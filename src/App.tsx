import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, GlobalStyles, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import AppRoutes from './routes/AppRoutes';
import { theme } from './theme/theme';

export default function App() {
  return (
    // enableCssLayer + the layer order below lets Tailwind utilities override MUI styles without !important.
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <AppRoutes />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
