import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Product, 
  RepairBooking, 
  Order, 
  CartItem, 
  ServiceArea, 
  TimeSlot, 
  Coupon, 
  RepairStatus,
  CustomerUser
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_REPAIR_BOOKINGS, 
  INITIAL_ORDERS, 
  SERVICE_AREAS, 
  TIME_SLOTS, 
  INITIAL_COUPONS 
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AppContextType {
  products: Product[];
  repairBookings: RepairBooking[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  serviceAreas: ServiceArea[];
  timeSlots: TimeSlot[];
  coupons: Coupon[];
  selectedBrand: string;
  selectedModel: string;
  searchQuery: string;
  isSupabaseConnected: boolean;
  
  // Customer Auth State
  isCustomerAuthenticated: boolean;
  customerUser: CustomerUser | null;
  isAuthModalOpen: boolean;
  authModalContext: 'repair' | 'checkout' | 'account' | null;
  openCustomerAuthModal: (contextAction?: 'repair' | 'checkout' | 'account') => void;
  closeCustomerAuthModal: () => void;
  customerLogin: (emailOrPhone: string, pass: string, name?: string) => Promise<boolean> | boolean;
  customerSignup: (name: string, email: string, phone: string, pass: string) => Promise<boolean> | boolean;
  customerLogout: () => void;

  // Admin Auth State
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  adminLogin: (email: string, pass: string) => boolean;
  adminLogout: () => void;

  // Handlers
  setSelectedBrand: (brand: string) => void;
  setSelectedModel: (model: string) => void;
  setSearchQuery: (query: string) => void;
  
  // Cart & Wishlist
  addToCart: (product: Product, quantity?: number, selectedModel?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  
  // Repair Bookings
  createRepairBooking: (booking: Omit<RepairBooking, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'statusHistory'>) => RepairBooking;
  updateRepairBooking: (id: string, updates: Partial<RepairBooking>) => void;
  updateRepairStatus: (id: string, newStatus: RepairStatus, note?: string, finalPrice?: number) => void;
  approveOrRejectRepairPrice: (id: string, decision: 'approved' | 'rejected') => void;
  
  // Orders
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  
  // Admin Product Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Area & Coupon Management
  toggleServiceArea: (id: string) => void;
  addServiceArea: (area: Omit<ServiceArea, 'id'>) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // Site Banner Announcement UI Control
  announcementBanner: string;
  setAnnouncementBanner: (banner: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'hmc_products_v1',
  REPAIRS: 'hmc_repairs_v1',
  ORDERS: 'hmc_orders_v1',
  CART: 'hmc_cart_v1',
  WISHLIST: 'hmc_wishlist_v1',
  SERVICE_AREAS: 'hmc_areas_v1',
  COUPONS: 'hmc_coupons_v1',
  ADMIN_AUTH: 'hmc_admin_auth_v2',
  CUSTOMER_AUTH: 'hmc_customer_auth_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Repair Bookings State
  const [repairBookings, setRepairBookings] = useState<RepairBooking[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REPAIRS);
    return saved ? JSON.parse(saved) : INITIAL_REPAIR_BOOKINGS;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : [];
  });

  // Service Areas State
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SERVICE_AREAS);
    return saved ? JSON.parse(saved) : SERVICE_AREAS;
  });

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COUPONS);
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [timeSlots] = useState<TimeSlot[]>(TIME_SLOTS);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Customer Auth State
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOMER_AUTH);
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalContext, setAuthModalContext] = useState<'repair' | 'checkout' | 'account' | null>(null);

  const isCustomerAuthenticated = !!customerUser;

  const openCustomerAuthModal = (contextAction?: 'repair' | 'checkout' | 'account') => {
    if (contextAction) setAuthModalContext(contextAction);
    setIsAuthModalOpen(true);
  };

  const closeCustomerAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const customerLogin = (emailOrPhone: string, _pass: string, name?: string): boolean => {
    const user: CustomerUser = {
      id: `cust_${Date.now()}`,
      name: name || 'Kiran Kumar',
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@hyderabad.in`,
      phone: emailOrPhone.match(/^[0-9]+$/) ? emailOrPhone : '+91 98490 12345',
      address: {
        houseNumber: 'Flat 402',
        street: 'Road No 36, Jubilee Hills',
        area: 'Madhapur',
        city: 'Hyderabad',
        pincode: '500081'
      }
    };
    setCustomerUser(user);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOMER_AUTH, JSON.stringify(user));
    return true;
  };

  const customerSignup = (name: string, email: string, phone: string, _pass: string): boolean => {
    const user: CustomerUser = {
      id: `cust_${Date.now()}`,
      name: name || 'Customer',
      email: email || 'customer@hyderabad.in',
      phone: phone || '+91 98490 12345',
      address: {
        houseNumber: '',
        street: '',
        area: 'Madhapur',
        city: 'Hyderabad',
        pincode: '500081'
      }
    };
    setCustomerUser(user);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOMER_AUTH, JSON.stringify(user));
    return true;
  };

  const customerLogout = () => {
    setCustomerUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CUSTOMER_AUTH);
  };

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH);
    return saved ? JSON.parse(saved) : null;
  });

  const isAdminAuthenticated = !!adminUser;

  // Supabase Fetch Initial Data if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchSupabaseData = async () => {
      try {
        const { data: remoteProducts } = await supabase.from('products').select('*');
        if (remoteProducts && remoteProducts.length > 0) {
          const mapped: Product[] = remoteProducts.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category,
            categoryName: p.category_name,
            brand: p.brand,
            compatibleModels: p.compatible_models || [],
            originalPrice: Number(p.original_price),
            discountPrice: Number(p.discount_price),
            rating: Number(p.rating || 5.0),
            reviewCount: p.review_count || 0,
            images: p.images || [],
            inStock: p.in_stock,
            stockCount: p.stock_count || 0,
            sku: p.sku || '',
            description: p.description || '',
            features: p.features || [],
            warranty: p.warranty || '',
            isBestSeller: p.is_best_seller,
            isNewArrival: p.is_new_arrival,
          }));
          setProducts(mapped);
        }

        const { data: remoteRepairs } = await supabase.from('repair_bookings').select('*');
        if (remoteRepairs && remoteRepairs.length > 0) {
          const mappedRepairs: RepairBooking[] = remoteRepairs.map((r) => ({
            id: r.id,
            customerName: r.customer_name,
            customerPhone: r.customer_phone,
            customerEmail: r.customer_email,
            brand: r.brand,
            model: r.model,
            problemId: r.problem_id,
            problemTitle: r.problem_title,
            problemCategory: r.problem_category,
            serviceType: r.service_type,
            address: {
              houseNumber: r.house_number || '',
              street: r.street || '',
              area: r.area,
              city: r.city || 'Hyderabad',
              pincode: r.pincode,
              landmark: r.landmark || ''
            },
            preferredDate: r.preferred_date,
            preferredTimeSlot: r.preferred_time_slot,
            initialEstimatedPrice: Number(r.initial_estimated_price),
            finalPrice: r.final_price ? Number(r.final_price) : undefined,
            priceApprovalStatus: r.price_approval_status,
            status: r.status,
            statusHistory: r.status_history || [],
            technicianName: r.technician_name,
            technicianPhone: r.technician_phone,
            diagnosisNotes: r.diagnosis_notes,
            deviceImages: r.device_images || [],
            createdAt: r.created_at,
            updatedAt: r.updated_at
          }));
          setRepairBookings(mappedRepairs);
        }
      } catch (err) {
        console.warn('Supabase fetch notice:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  const adminLogin = (email: string, pass: string): boolean => {
    if ((email.toLowerCase() === 'admin@hmc.in' || email.toLowerCase() === 'admin') && pass === 'admin123') {
      const user: AdminUser = {
        email: 'admin@hmc.in',
        name: 'Hyderabad Operations Manager',
        role: 'Super Admin'
      };
      setAdminUser(user);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(user));
      return true;
    }
    if (email.trim() && pass.length >= 4) {
      const user: AdminUser = {
        email: email.trim(),
        name: 'Admin User',
        role: 'Operations Admin'
      };
      setAdminUser(user);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(user));
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REPAIRS, JSON.stringify(repairBookings));
  }, [repairBookings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SERVICE_AREAS, JSON.stringify(serviceAreas));
  }, [serviceAreas]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  // Cart Handlers
  const addToCart = (product: Product, quantity = 1, selectedModel?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id && item.selectedModel === selectedModel);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prevCart, { product, quantity, selectedModel }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Repair Booking Creation
  const createRepairBooking = (
    bookingData: Omit<RepairBooking, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'statusHistory'>
  ): RepairBooking => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newId = `HMC-RP-${randomNum}`;
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const isoNow = new Date().toISOString();

    const newBooking: RepairBooking = {
      ...bookingData,
      id: newId,
      status: 'Booking Confirmed',
      finalPrice: bookingData.initialEstimatedPrice,
      priceApprovalStatus: 'approved',
      statusHistory: [
        {
          status: 'Booking Confirmed',
          timestamp: nowStr,
          note: 'Booking successfully created online.'
        }
      ],
      createdAt: isoNow,
      updatedAt: isoNow
    };

    setRepairBookings((prev) => [newBooking, ...prev]);

    // Async sync to Supabase if configured
    if (isSupabaseConfigured) {
      supabase.from('repair_bookings').insert([{
        id: newId,
        customer_name: bookingData.customerName,
        customer_phone: bookingData.customerPhone,
        customer_email: bookingData.customerEmail,
        brand: bookingData.brand,
        model: bookingData.model,
        problem_id: bookingData.problemId,
        problem_title: bookingData.problemTitle,
        problem_category: bookingData.problemCategory,
        service_type: bookingData.serviceType,
        house_number: bookingData.address.houseNumber,
        street: bookingData.address.street,
        area: bookingData.address.area,
        city: bookingData.address.city,
        pincode: bookingData.address.pincode,
        landmark: bookingData.address.landmark,
        preferred_date: bookingData.preferredDate,
        preferred_time_slot: bookingData.preferredTimeSlot,
        initial_estimated_price: bookingData.initialEstimatedPrice,
        final_price: bookingData.initialEstimatedPrice,
        price_approval_status: 'approved',
        status: 'Booking Confirmed',
        status_history: newBooking.statusHistory
      }]).then(({ error }) => {
        if (error) console.warn('Supabase booking sync notice:', error.message);
      });
    }

    return newBooking;
  };

  const updateRepairBooking = (id: string, updates: Partial<RepairBooking>) => {
    const isoNow = new Date().toISOString();
    setRepairBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: isoNow } : b))
    );
  };

  const updateRepairStatus = (
    id: string, 
    newStatus: RepairStatus, 
    note?: string, 
    finalPrice?: number
  ) => {
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const isoNow = new Date().toISOString();

    setRepairBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;

        const updatedHistory = [
          ...b.statusHistory,
          { status: newStatus, timestamp: nowStr, note: note || `Status updated to ${newStatus}` }
        ];

        let priceApprovalStatus = b.priceApprovalStatus;
        if (finalPrice && finalPrice !== b.initialEstimatedPrice) {
          priceApprovalStatus = 'pending';
        }

        const updatedObj = {
          ...b,
          status: newStatus,
          statusHistory: updatedHistory,
          finalPrice: finalPrice !== undefined ? finalPrice : b.finalPrice,
          priceApprovalStatus,
          updatedAt: isoNow
        };

        // Async sync to Supabase if configured
        if (isSupabaseConfigured) {
          supabase.from('repair_bookings').update({
            status: newStatus,
            status_history: updatedHistory,
            final_price: updatedObj.finalPrice,
            price_approval_status: priceApprovalStatus,
            updated_at: isoNow
          }).eq('id', id).then(({ error }) => {
            if (error) console.warn('Supabase repair update notice:', error.message);
          });
        }

        return updatedObj;
      })
    );
  };

  const approveOrRejectRepairPrice = (id: string, decision: 'approved' | 'rejected') => {
    const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const isoNow = new Date().toISOString();

    setRepairBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const newStatus = decision === 'approved' ? 'Repair in Progress' : 'Cancelled';
        const note = decision === 'approved' 
          ? `Customer approved final repair quote of ₹${b.finalPrice}.`
          : 'Customer rejected updated repair quote. Device returned.';

        return {
          ...b,
          priceApprovalStatus: decision,
          status: newStatus,
          statusHistory: [
            ...b.statusHistory,
            { status: newStatus, timestamp: nowStr, note }
          ],
          updatedAt: isoNow
        };
      })
    );
  };

  // Order Placement
  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newId = `HMC-ORD-${randomNum}`;
    const isoNow = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: newId,
      createdAt: isoNow
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Async sync to Supabase if configured
    if (isSupabaseConfigured) {
      supabase.from('orders').insert([{
        id: newId,
        items: orderData.items,
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        delivery_charge: orderData.deliveryCharge,
        total: orderData.total,
        coupon_code: orderData.couponCode,
        customer_name: orderData.customerDetails.name,
        customer_phone: orderData.customerDetails.phone,
        customer_email: orderData.customerDetails.email,
        shipping_street: orderData.shippingAddress.street,
        shipping_area: orderData.shippingAddress.area,
        shipping_city: orderData.shippingAddress.city,
        shipping_pincode: orderData.shippingAddress.pincode,
        shipping_landmark: orderData.shippingAddress.landmark,
        payment_method: orderData.paymentMethod,
        payment_status: orderData.paymentStatus,
        payment_id: orderData.paymentId,
        order_status: orderData.orderStatus
      }]).then(({ error }) => {
        if (error) console.warn('Supabase order sync notice:', error.message);
      });
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
  };

  // Admin Product Actions
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = { ...productData, id: newId };
    setProducts((prev) => [newProduct, ...prev]);

    if (isSupabaseConfigured) {
      supabase.from('products').insert([{
        id: newId,
        name: productData.name,
        slug: productData.slug,
        category: productData.category,
        category_name: productData.categoryName,
        brand: productData.brand,
        compatible_models: productData.compatibleModels,
        original_price: productData.originalPrice,
        discount_price: productData.discountPrice,
        rating: productData.rating,
        review_count: productData.reviewCount,
        images: productData.images,
        in_stock: productData.inStock,
        stock_count: productData.stockCount,
        sku: productData.sku,
        description: productData.description,
        features: productData.features,
        warranty: productData.warranty
      }]).then(({ error }) => {
        if (error) console.warn('Supabase product add notice:', error.message);
      });
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const [announcementBanner, setAnnouncementBannerState] = useState<string>(() => {
    return localStorage.getItem('hmc_announcement_v1') || '⚡ Doorstep Mobile Repair in 60 Mins across Hyderabad & Cyberabad';
  });

  const setAnnouncementBanner = (text: string) => {
    setAnnouncementBannerState(text);
    localStorage.setItem('hmc_announcement_v1', text);
  };

  const addServiceArea = (area: Omit<ServiceArea, 'id'>) => {
    const newArea: ServiceArea = { ...area, id: `area-${Date.now()}` };
    setServiceAreas((prev) => [newArea, ...prev]);
  };

  const toggleServiceArea = (id: string) => {
    setServiceAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isSupported: !a.isSupported } : a))
    );
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code.toUpperCase() !== code.toUpperCase()));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        repairBookings,
        orders,
        cart,
        wishlist,
        serviceAreas,
        timeSlots,
        coupons,
        selectedBrand,
        selectedModel,
        searchQuery,
        isSupabaseConnected: isSupabaseConfigured,
        isCustomerAuthenticated,
        customerUser,
        isAuthModalOpen,
        authModalContext,
        openCustomerAuthModal,
        closeCustomerAuthModal,
        customerLogin,
        customerSignup,
        customerLogout,
        isAdminAuthenticated,
        adminUser,
        adminLogin,
        adminLogout,
        setSelectedBrand,
        setSelectedModel,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        createRepairBooking,
        updateRepairBooking,
        updateRepairStatus,
        approveOrRejectRepairPrice,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleServiceArea,
        addServiceArea,
        addCoupon,
        deleteCoupon,
        announcementBanner,
        setAnnouncementBanner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
