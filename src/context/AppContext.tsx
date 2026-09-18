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
  CustomerUser,
  RepairProblem,
  VistaShieldConfig,
  SelectedVistaShieldPlan
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_REPAIR_BOOKINGS, 
  INITIAL_ORDERS, 
  SERVICE_AREAS, 
  TIME_SLOTS, 
  INITIAL_COUPONS,
  REPAIR_PROBLEMS,
  INITIAL_VISTA_SHIELD_CONFIG
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { normalizePhoneNumber } from '../utils/phone';

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
  registeredUsers: CustomerUser[];
  isAuthModalOpen: boolean;
  authModalContext: 'repair' | 'checkout' | 'account' | null;
  openCustomerAuthModal: (contextAction?: 'repair' | 'checkout' | 'account') => void;
  closeCustomerAuthModal: () => void;
  customerLogin: (emailOrPhone: string, pass: string, name?: string) => { success: boolean; error?: string; message?: string };
  customerSignup: (name: string, email: string, phone: string, pass: string) => { success: boolean; error?: string; message?: string };
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
  removeFromCart: (productId: string, selectedModel?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedModel?: string) => void;
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

  // Mobile Repair Services & Pricing Management
  repairProblems: RepairProblem[];
  updateRepairProblemPrice: (id: string, newPrice: number) => void;
  updateRepairProblem: (id: string, updates: Partial<RepairProblem>) => void;
  addRepairProblem: (problem: Omit<RepairProblem, 'id'>) => void;

  // Site Banner Announcement UI Control
  announcementBanner: string;
  setAnnouncementBanner: (banner: string) => void;

  // Vista Shield Insurance / Plan State & Actions
  vistaShieldConfig: VistaShieldConfig;
  updateVistaShieldConfig: (updates: Partial<VistaShieldConfig>) => void;
  selectedVistaShieldPlan: SelectedVistaShieldPlan;
  selectVistaShieldPlan: (variantId: 'variant-1' | 'variant-2') => void;
  clearSelectedVistaShieldPlan: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'hmc_products_v1',
  REPAIRS: 'hmc_repairs_v1',
  ORDERS: 'hmc_orders_v1',
  GUEST_CART: 'hmc_guest_cart_v1',
  WISHLIST: 'hmc_wishlist_v1',
  SERVICE_AREAS: 'hmc_areas_v1',
  COUPONS: 'hmc_coupons_v1',
  ADMIN_AUTH: 'hmc_admin_auth_v2',
  CUSTOMER_AUTH: 'hmc_customer_auth_v1',
  REGISTERED_USERS: 'hmc_registered_users_v2',
  VISTA_SHIELD_CONFIG: 'hmc_vista_shield_config_v1',
  SELECTED_VISTA_SHIELD: 'hmc_selected_vista_shield_v1',
};

const getUserCartKey = (userId: string) => `hmc_user_cart_${userId}`;

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

  // Cart State (User Isolated)
  const [cart, setCart] = useState<CartItem[]>([]);

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

  // Repair Services & Pricing State
  const [repairProblems, setRepairProblems] = useState<RepairProblem[]>(() => {
    const saved = localStorage.getItem('hmc_repair_problems_v1');
    return saved ? JSON.parse(saved) : REPAIR_PROBLEMS;
  });

  // Vista Shield Config State
  const [vistaShieldConfig, setVistaShieldConfig] = useState<VistaShieldConfig>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.VISTA_SHIELD_CONFIG);
    return saved ? JSON.parse(saved) : INITIAL_VISTA_SHIELD_CONFIG;
  });

  // Selected Vista Shield Plan State
  const [selectedVistaShieldPlan, setSelectedVistaShieldPlan] = useState<SelectedVistaShieldPlan>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_VISTA_SHIELD);
    return saved ? JSON.parse(saved) : null;
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

  // Registered Users Registry State (Prevents account linking by phone)
  const [registeredUsers, setRegisteredUsers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'usr_kiran_kumar_default',
        name: 'Kiran Kumar',
        email: 'kiran@hyderabad.in',
        phone: '+919849012345',
        normalizedPhone: '+919849012345',
        role: 'Customer',
        createdAt: '2026-01-15T10:00:00.000Z',
        address: {
          houseNumber: 'Flat 402',
          street: 'Road No 36, Jubilee Hills',
          area: 'Madhapur',
          city: 'Hyderabad',
          pincode: '500081'
        }
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalContext, setAuthModalContext] = useState<'repair' | 'checkout' | 'account' | null>(null);

  const isCustomerAuthenticated = !!customerUser;

  // Helper: Load cart for specific user ID or guest
  const loadUserCart = async (userId: string | null) => {
    if (!userId) {
      // Guest Cart
      const savedGuest = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_CART);
      const parsedGuest = savedGuest ? JSON.parse(savedGuest) : [];
      setCart(parsedGuest);
      return;
    }

    // Authenticated User Cart: ALWAYS clear current state first to prevent bleed-through
    setCart([]);

    const userCartKey = getUserCartKey(userId);
    const savedUserCart = localStorage.getItem(userCartKey);
    let userCart: CartItem[] = savedUserCart ? JSON.parse(savedUserCart) : [];

    // Query Supabase cart_items for current user_id
    if (isSupabaseConfigured) {
      try {
        const { data: remoteCartItems, error } = await supabase
          .from('cart_items')
          .select('*, products(*)')
          .eq('user_id', userId);

        if (!error && remoteCartItems && remoteCartItems.length > 0) {
          const mappedRemoteCart: CartItem[] = remoteCartItems
            .map((item) => {
              const prod = products.find((p) => p.id === item.product_id) || item.products;
              if (!prod) return null;
              return {
                id: item.id,
                userId: item.user_id,
                product: prod,
                quantity: item.quantity,
                selectedModel: item.selected_model || ''
              };
            })
            .filter(Boolean) as CartItem[];

          userCart = mappedRemoteCart;
          localStorage.setItem(userCartKey, JSON.stringify(mappedRemoteCart));
        }
      } catch (err) {
        console.warn('Supabase user cart load notice:', err);
      }
    }

    // Handle Guest Cart Migration if guest items exist
    const savedGuest = localStorage.getItem(LOCAL_STORAGE_KEYS.GUEST_CART);
    if (savedGuest) {
      try {
        const guestItems: CartItem[] = JSON.parse(savedGuest);
        if (guestItems && guestItems.length > 0) {
          const merged = [...userCart];
          guestItems.forEach((gItem) => {
            const existingIdx = merged.findIndex(
              (m) => m.product.id === gItem.product.id && m.selectedModel === gItem.selectedModel
            );
            if (existingIdx > -1) {
              merged[existingIdx].quantity += gItem.quantity;
            } else {
              merged.push({ ...gItem, userId });
            }
          });
          userCart = merged;
          localStorage.setItem(userCartKey, JSON.stringify(merged));
          localStorage.removeItem(LOCAL_STORAGE_KEYS.GUEST_CART);

          if (isSupabaseConfigured) {
            const upsertItems = userCart.map((ci) => ({
              user_id: userId,
              product_id: ci.product.id,
              quantity: ci.quantity,
              selected_model: ci.selectedModel || '',
              updated_at: new Date().toISOString()
            }));
            supabase.from('cart_items').upsert(upsertItems).then(({ error }) => {
              if (error) console.warn('Supabase guest cart migration notice:', error.message);
            });
          }
        }
      } catch (err) {
        console.warn('Guest cart migration notice:', err);
      }
    }

    setCart(userCart);
  };

  // Sync cart whenever active customerUser.id changes
  useEffect(() => {
    localStorage.removeItem('hmc_cart_v1');
    if (customerUser?.id) {
      loadUserCart(customerUser.id);
    } else {
      loadUserCart(null);
    }
  }, [customerUser?.id]);

  const openCustomerAuthModal = (contextAction?: 'repair' | 'checkout' | 'account') => {
    if (contextAction) setAuthModalContext(contextAction);
    setIsAuthModalOpen(true);
  };

  const closeCustomerAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const customerLogin = (emailOrPhone: string, _pass: string, name?: string): { success: boolean; error?: string; message?: string } => {
    setCart([]);
    const inputClean = emailOrPhone.trim();
    const isEmail = inputClean.includes('@');
    const normPhone = !isEmail ? normalizePhoneNumber(inputClean) : '';
    const normEmail = isEmail ? inputClean.toLowerCase() : '';

    // Search existing registered account by phone or email
    let existingUser = registeredUsers.find((u) => {
      if (isEmail) return u.email.toLowerCase() === normEmail;
      return (normPhone && u.normalizedPhone === normPhone) || u.phone === inputClean;
    });

    if (!existingUser) {
      // If logging in for the first time without prior signup, register this new identity
      const uniqueUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      existingUser = {
        id: uniqueUserId,
        name: name || (isEmail ? inputClean.split('@')[0] : 'Customer User'),
        email: isEmail ? normEmail : `${inputClean}@hyderabad.in`,
        phone: isEmail ? '+919849012345' : (normPhone || inputClean),
        normalizedPhone: normPhone || (!isEmail ? normalizePhoneNumber(inputClean) : ''),
        role: 'Customer',
        createdAt: new Date().toISOString(),
        address: {
          houseNumber: 'Flat 402',
          street: 'Road No 36',
          area: 'Madhapur',
          city: 'Hyderabad',
          pincode: '500081'
        }
      };
      setRegisteredUsers((prev) => [...prev, existingUser!]);
    }

    setCustomerUser(existingUser);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOMER_AUTH, JSON.stringify(existingUser));
    loadUserCart(existingUser.id);
    return { success: true };
  };

  const customerSignup = (name: string, email: string, phone: string, _pass: string): { success: boolean; error?: string; message?: string } => {
    setCart([]);
    const normPhone = normalizePhoneNumber(phone);
    const normEmail = (email || `${phone}@hyderabad.in`).trim().toLowerCase();

    // STRICT CHECK: Prevent duplicate mobile registration or automatic account linking
    const existingByPhone = normPhone ? registeredUsers.find((u) => u.normalizedPhone === normPhone || u.phone === normPhone) : null;
    const existingByEmail = normEmail ? registeredUsers.find((u) => u.email.toLowerCase() === normEmail) : null;

    if (existingByPhone) {
      return {
        success: false,
        error: 'PHONE_ALREADY_REGISTERED',
        message: 'This mobile number is already registered. Please log in to your existing account instead.'
      };
    }

    if (existingByEmail) {
      return {
        success: false,
        error: 'EMAIL_ALREADY_REGISTERED',
        message: 'An account with this email address already exists. Please log in instead.'
      };
    }

    // Create a NEW unique user_id (Never inherit or link existing user_id)
    const uniqueUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newUser: CustomerUser = {
      id: uniqueUserId,
      name: name || 'Customer',
      email: normEmail,
      phone: normPhone || phone || '+919849012345',
      normalizedPhone: normPhone,
      role: 'Customer',
      createdAt: new Date().toISOString(),
      address: {
        houseNumber: '',
        street: '',
        area: 'Madhapur',
        city: 'Hyderabad',
        pincode: '500081'
      }
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCustomerUser(newUser);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOMER_AUTH, JSON.stringify(newUser));
    loadUserCart(newUser.id);
    return { success: true };
  };

  const customerLogout = () => {
    setCart([]);
    setCustomerUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CUSTOMER_AUTH);
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch(() => {});
    }
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

        const { data: remoteVs, error: vsErr } = await supabase.from('vista_shield_config').select('*').single();
        if (!vsErr && remoteVs) {
          setVistaShieldConfig({
            isEnabled: remoteVs.is_enabled ?? true,
            sectionTitle: remoteVs.section_title || 'MobileKart Vista Shield – Powered by OneAssist',
            poweredBy: 'POWERED BY ONEASSIST',
            subtitle: remoteVs.subtitle || 'Know Your Plan Better',
            tenure: remoteVs.tenure || '1 Year from date of purchase',
            productName: remoteVs.product_name || 'Existing Phone Screen Protection Plan',
            serviceBenefit: remoteVs.service_benefit || 'Screen Protection',
            serviceRequestsCount: remoteVs.service_requests_count || '1',
            freeDoorstepPickupDrop: true,
            authorizedServiceCenter: remoteVs.authorized_service_center || 'OneAssist Authorized Service Center / MobileKart',
            excessFees: remoteVs.excess_fees || '₹199/-',
            coolingPeriod: remoteVs.cooling_period || '15 Days',
            v1Price: Number(remoteVs.v1_price || 1798),
            v1MaxBenefit: Number(remoteVs.v1_max_benefit || 10000),
            v1Badge: remoteVs.v1_badge || 'MOST POPULAR',
            v2Price: Number(remoteVs.v2_price || 1598),
            v2MaxBenefit: Number(remoteVs.v2_max_benefit || 7500),
            trustLineTitle: remoteVs.trust_line_title || 'Trust Line',
            trustLineText: remoteVs.trust_line_text || 'After booking your plan, always verify the policy document directly through the official OneAssist App.',
            trustLineHighlight: remoteVs.trust_line_highlight || '100% Official & Secure.'
          });
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

  // Cart Handlers (User Isolated)
  const saveCartForCurrentContext = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    if (customerUser?.id) {
      const userKey = getUserCartKey(customerUser.id);
      localStorage.setItem(userKey, JSON.stringify(updatedCart));

      if (isSupabaseConfigured) {
        const upsertData = updatedCart.map((ci) => ({
          user_id: customerUser.id,
          product_id: ci.product.id,
          quantity: ci.quantity,
          selected_model: ci.selectedModel || '',
          updated_at: new Date().toISOString()
        }));

        if (upsertData.length > 0) {
          supabase.from('cart_items').upsert(upsertData).then(({ error }) => {
            if (error) console.warn('Supabase cart_items upsert notice:', error.message);
          });
        }
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEYS.GUEST_CART, JSON.stringify(updatedCart));
    }
  };

  const addToCart = (product: Product, quantity = 1, selectedModel?: string) => {
    const modelToUse = selectedModel || product.compatibleModels?.[0] || '';
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedModel === modelToUse
    );

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cart, { product, quantity, selectedModel: modelToUse, userId: customerUser?.id }];
    }

    saveCartForCurrentContext(updatedCart);
  };

  const removeFromCart = (productId: string, selectedModel?: string) => {
    const updatedCart = cart.filter(
      (item) => !(item.product.id === productId && (selectedModel ? item.selectedModel === selectedModel : true))
    );

    saveCartForCurrentContext(updatedCart);

    if (customerUser?.id && isSupabaseConfigured) {
      let query = supabase.from('cart_items').delete().eq('user_id', customerUser.id).eq('product_id', productId);
      if (selectedModel) {
        query = query.eq('selected_model', selectedModel);
      }
      query.then(({ error }) => {
        if (error) console.warn('Supabase delete cart item notice:', error.message);
      });
    }
  };

  const updateCartQuantity = (productId: string, quantity: number, selectedModel?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedModel);
      return;
    }

    const updatedCart = cart.map((item) => {
      if (item.product.id === productId && (selectedModel ? item.selectedModel === selectedModel : true)) {
        return { ...item, quantity };
      }
      return item;
    });

    saveCartForCurrentContext(updatedCart);

    if (customerUser?.id && isSupabaseConfigured) {
      let query = supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('user_id', customerUser.id)
        .eq('product_id', productId);

      if (selectedModel) {
        query = query.eq('selected_model', selectedModel);
      }
      query.then(({ error }) => {
        if (error) console.warn('Supabase update cart item notice:', error.message);
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    if (customerUser?.id) {
      const userKey = getUserCartKey(customerUser.id);
      localStorage.setItem(userKey, JSON.stringify([]));

      if (isSupabaseConfigured) {
        supabase.from('cart_items').delete().eq('user_id', customerUser.id).then(({ error }) => {
          if (error) console.warn('Supabase clear cart notice:', error.message);
        });
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.GUEST_CART);
    }
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SERVICE_AREAS, JSON.stringify(serviceAreas));
  }, [serviceAreas]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('hmc_repair_problems_v1', JSON.stringify(repairProblems));
  }, [repairProblems]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VISTA_SHIELD_CONFIG, JSON.stringify(vistaShieldConfig));
  }, [vistaShieldConfig]);

  useEffect(() => {
    if (selectedVistaShieldPlan) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTED_VISTA_SHIELD, JSON.stringify(selectedVistaShieldPlan));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.SELECTED_VISTA_SHIELD);
    }
  }, [selectedVistaShieldPlan]);

  const updateVistaShieldConfig = (updates: Partial<VistaShieldConfig>) => {
    setVistaShieldConfig((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(LOCAL_STORAGE_KEYS.VISTA_SHIELD_CONFIG, JSON.stringify(updated));

      if (isSupabaseConfigured) {
        supabase.from('vista_shield_config').upsert({
          id: 'default',
          is_enabled: updated.isEnabled,
          section_title: updated.sectionTitle,
          subtitle: updated.subtitle,
          v1_price: updated.v1Price,
          v1_max_benefit: updated.v1MaxBenefit,
          v1_badge: updated.v1Badge,
          v2_price: updated.v2Price,
          v2_max_benefit: updated.v2MaxBenefit,
          tenure: updated.tenure,
          excess_fees: updated.excessFees,
          cooling_period: updated.coolingPeriod,
          service_requests_count: updated.serviceRequestsCount,
          authorized_service_center: updated.authorizedServiceCenter,
          product_name: updated.productName,
          service_benefit: updated.serviceBenefit,
          trust_line_title: updated.trustLineTitle,
          trust_line_text: updated.trustLineText,
          trust_line_highlight: updated.trustLineHighlight,
          updated_at: new Date().toISOString()
        }).then(({ error }) => {
          if (error) console.warn('Supabase vista_shield_config upsert notice:', error.message);
        });
      }

      return updated;
    });
  };

  const selectVistaShieldPlan = (variantId: 'variant-1' | 'variant-2') => {
    const isV1 = variantId === 'variant-1';
    const plan: SelectedVistaShieldPlan = {
      variantId,
      variantName: isV1 ? 'Variant 1' : 'Variant 2',
      maxBenefit: isV1 ? vistaShieldConfig.v1MaxBenefit : vistaShieldConfig.v2MaxBenefit,
      mrp: isV1 ? vistaShieldConfig.v1Price : vistaShieldConfig.v2Price,
      gstIncluded: true,
      selectedAt: new Date().toISOString()
    };
    setSelectedVistaShieldPlan(plan);
  };

  const clearSelectedVistaShieldPlan = () => {
    setSelectedVistaShieldPlan(null);
  };


  const updateRepairProblemPrice = (id: string, newPrice: number) => {
    setRepairProblems((prev) =>
      prev.map((prob) => (prob.id === id ? { ...prob, estimatedPrice: newPrice } : prob))
    );
  };

  const updateRepairProblem = (id: string, updates: Partial<RepairProblem>) => {
    setRepairProblems((prev) =>
      prev.map((prob) => (prob.id === id ? { ...prob, ...updates } : prob))
    );
  };

  const addRepairProblem = (problemData: Omit<RepairProblem, 'id'>) => {
    const newProblem: RepairProblem = {
      ...problemData,
      id: `prob_${Date.now()}`
    };
    setRepairProblems((prev) => [...prev, newProblem]);
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
        registeredUsers,
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
        repairProblems,
        updateRepairProblemPrice,
        updateRepairProblem,
        addRepairProblem,
        announcementBanner,
        setAnnouncementBanner,
        vistaShieldConfig,
        updateVistaShieldConfig,
        selectedVistaShieldPlan,
        selectVistaShieldPlan,
        clearSelectedVistaShieldPlan,
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
