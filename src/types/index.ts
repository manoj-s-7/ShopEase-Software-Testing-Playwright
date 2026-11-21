export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  images: string[];
  thumbnail: string;
}

/** The subset of product data we keep for cards, wishlist and cart snapshots. */
export type ProductSummary = Pick<
  Product,
  'id' | 'title' | 'thumbnail' | 'price' | 'discountPercentage' | 'rating' | 'category' | 'stock'
> & { brand?: string };

export interface ProductListResult {
  products: Product[];
  total: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating-desc';

export interface CartItem {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  quantity: number;
  stock: number;
  category: string;
  brand?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface StoredUser extends User {
  passwordHash: string;
}

export interface Session {
  userId: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered';
export type PaymentMethod = 'cod' | 'card';

export interface DeliveryInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Totals {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  delivery: DeliveryInfo;
  paymentMethod: PaymentMethod;
  totals: Totals;
}

export type AuthResult = { ok: true } | { ok: false; error: string; field?: 'email' | 'currentPassword' };
