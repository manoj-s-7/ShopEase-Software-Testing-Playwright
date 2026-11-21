import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AboutPage from '../pages/About/AboutPage';
import AccountPage from '../pages/Account/AccountPage';
import CartPage from '../pages/Cart/CartPage';
import CategoriesPage from '../pages/Categories/CategoriesPage';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import DevResetPage from '../pages/DevReset/DevResetPage';
import ForgotPasswordPage from '../pages/ForgotPassword/ForgotPasswordPage';
import HomePage from '../pages/Home/HomePage';
import LoginPage from '../pages/Login/LoginPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';
import OrderSuccessPage from '../pages/OrderSuccess/OrderSuccessPage';
import OrderDetailsPage from '../pages/Orders/OrderDetailsPage';
import OrdersPage from '../pages/Orders/OrdersPage';
import ProductDetailsPage from '../pages/ProductDetails/ProductDetailsPage';
import RegisterPage from '../pages/Register/RegisterPage';
import ShopPage from '../pages/Shop/ShopPage';
import WishlistPage from '../pages/Wishlist/WishlistPage';
import { DEV_TOOLS_ENABLED } from '../utils/devTools';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {DEV_TOOLS_ENABLED && <Route path="/dev/reset" element={<DevResetPage />} />}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<ProtectedRoute message="Please sign in to view your wishlist."><WishlistPage /></ProtectedRoute>} />
        <Route path="checkout" element={<ProtectedRoute message="Please sign in to continue to checkout."><CheckoutPage /></ProtectedRoute>} />
        <Route path="order-success/:orderId" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute message="Please sign in to view your orders."><OrdersPage /></ProtectedRoute>} />
        <Route path="orders/:orderId" element={<ProtectedRoute message="Please sign in to view your orders."><OrderDetailsPage /></ProtectedRoute>} />
        <Route path="account" element={<ProtectedRoute message="Please sign in to manage your account."><AccountPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
