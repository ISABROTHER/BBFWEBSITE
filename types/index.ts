export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  featured: boolean;
  parentId?: string;
}

export interface ProductVariant {
  id: string;
  storage?: string;
  color?: string;
  colorHex?: string;
  condition?: 'new' | 'refurbished';
  price: number;
  salePrice?: number;
  stock: number;
  sku: string;
}

export interface ProductSpec {
  label: string;
  value: string;
  group: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandId: string;
  categoryId: string;
  categorySlug: string;
  description: string;
  shortDescription: string;
  images: string[];
  thumbnail: string;
  variants: ProductVariant[];
  basePrice: number;
  baseSalePrice?: number;
  rating: number;
  reviewCount: number;
  specs: ProductSpec[];
  inBox: string[];
  features: string[];
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  isVisible: boolean;
  stock: number;
  warranty: string;
  returnPolicy: string;
  shipping: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  mobileImage?: string;
  cta: string;
  ctaLink: string;
  bgColor: string;
  textColor: string;
  isActive: boolean;
  order: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  description: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  brand: string;
  storage?: string;
  color?: string;
  colorHex?: string;
  condition?: string;
  price: number;
  salePrice?: number;
  quantity: number;
  stock: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'cod' | 'card' | 'bank_transfer' | 'mobile_payment';
  label: string;
  details?: Record<string, string>;
}

export interface TrackingEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  message: string;
  location?: string;
  timestamp: string;
  isCompleted: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'payment_confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  brand: string;
  storage?: string;
  color?: string;
  condition?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingCode: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  couponCode?: string;
  total: number;
  notes?: string;
  courierName?: string;
  courierTrackingNumber?: string;
  estimatedDelivery?: string;
  trackingEvents: TrackingEvent[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'manager';
  avatar?: string;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface Testimonial {
  id: string;
  author: string;
  avatar?: string;
  location: string;
  rating: number;
  text: string;
  product?: string;
  date: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  shippingFee: number;
  freeShippingThreshold: number;
  taxRate: number;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
  };
}
