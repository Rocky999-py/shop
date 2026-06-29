export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  specs: Record<string, string>;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSubtotal?: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  address: ShippingAddress;
  status: 'Processing' | 'Shipped' | 'In Transit' | 'Delivered';
  estimatedDelivery: string;
  promoApplied?: string;
}

export type ViewType = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'orders' | 'comparison';
