export type Brand = {
  id: string;
  name: string;
  logo: string;
  popularModels: string[];
};

export type MobileModel = {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  releaseYear?: number;
  image?: string;
};

export type CustomerUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: {
    houseNumber?: string;
    street?: string;
    area?: string;
    city?: string;
    pincode?: string;
  };
};

export type ProductCategory = 
  | 'mobile-covers'
  | 'tempered-glass'
  | 'chargers'
  | 'cables'
  | 'power-banks'
  | 'earbuds'
  | 'smartwatches'
  | 'holders';

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryName: string;
  brand: string;
  compatibleModels: string[]; // Model names or IDs
  originalPrice: number;
  discountPrice: number;
  rating: number;
  reviewCount: number;
  images: string[];
  inStock: boolean;
  stockCount: number;
  sku: string;
  description: string;
  features: string[];
  warranty: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
};

export type RepairCategoryType = 
  | 'screen'
  | 'battery'
  | 'charging'
  | 'camera'
  | 'audio'
  | 'software'
  | 'other';

export type RepairProblem = {
  id: string;
  categoryId: RepairCategoryType;
  title: string;
  description: string;
  estimatedPrice: number;
  estimatedTime: string;
  warranty: string;
};

export type ServiceType = 'doorstep' | 'pickup' | 'store_visit';

export type RepairStatus = 
  | 'Booking Confirmed'
  | 'Pickup Scheduled'
  | 'Device Received'
  | 'Diagnosis'
  | 'Awaiting Customer Approval'
  | 'Repair in Progress'
  | 'Quality Check'
  | 'Ready'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export type RepairStatusHistoryItem = {
  status: RepairStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
};

export type RepairBooking = {
  id: string; // e.g. HMC-RP-100245
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  brand: string;
  model: string;
  problemId: string;
  problemTitle: string;
  problemCategory: RepairCategoryType;
  serviceType: ServiceType;
  address: {
    houseNumber: string;
    street: string;
    area: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  preferredDate: string;
  preferredTimeSlot: string;
  initialEstimatedPrice: number;
  finalPrice?: number;
  priceApprovalStatus?: 'pending' | 'approved' | 'rejected';
  status: RepairStatus;
  statusHistory: RepairStatusHistoryItem[];
  technicianName?: string;
  technicianPhone?: string;
  diagnosisNotes?: string;
  deviceImages?: string[];
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedModel?: string;
};

export type OrderStatus = 
  | 'Pending'
  | 'Paid'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type Order = {
  id: string; // e.g. HMC-ORD-100245
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  couponCode?: string;
  customerDetails: {
    name: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    street: string;
    area: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  paymentMethod: 'Razorpay' | 'UPI' | 'Card' | 'COD';
  paymentStatus: 'Pending' | 'Success' | 'Failed';
  paymentId?: string;
  orderStatus: OrderStatus;
  createdAt: string;
};

export type ServiceArea = {
  id: string;
  areaName: string;
  pincode: string;
  isSupported: boolean;
  doorstepAvailable: boolean;
  doorstepFee: number;
};

export type TimeSlot = {
  id: string;
  label: string; // e.g. 10:00 AM - 12:00 PM
  isEnabled: boolean;
};

export type Coupon = {
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minOrderAmount: number;
  description: string;
  expiryDate: string;
  isActive: boolean;
};

export type UserReview = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  itemType: 'product' | 'repair';
  itemName: string;
  verified: boolean;
};
