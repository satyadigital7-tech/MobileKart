import type { Brand, MobileModel, Product, RepairProblem, ServiceArea, TimeSlot, Coupon, RepairBooking, Order, UserReview } from '../types';

export const BRANDS: Brand[] = [
  {
    id: 'apple',
    name: 'Apple',
    logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&auto=format&fit=crop&q=80',
    popularModels: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12']
  },
  {
    id: 'samsung',
    name: 'Samsung',
    logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&auto=format&fit=crop&q=80',
    popularModels: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 FE', 'Galaxy A55 5G', 'Galaxy M34']
  },
  {
    id: 'oneplus',
    name: 'OnePlus',
    logo: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=100&auto=format&fit=crop&q=80',
    popularModels: ['OnePlus 12', 'OnePlus 12R', 'OnePlus Nord 4', 'OnePlus Nord CE 4', 'OnePlus 11 5G']
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi / Redmi',
    logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80',
    popularModels: ['Xiaomi 14 Ultra', 'Redmi Note 13 Pro+', 'Redmi Note 13', 'Xiaomi 13 Pro']
  },
  {
    id: 'realme',
    name: 'Realme',
    logo: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&auto=format&fit=crop&q=80',
    popularModels: ['Realme 12 Pro+', 'Realme GT 6', 'Realme P1 5G', 'Realme Narzo 70']
  },
  {
    id: 'vivo',
    name: 'Vivo',
    logo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=100&auto=format&fit=crop&q=80',
    popularModels: ['Vivo X100 Pro', 'Vivo V30 Pro', 'Vivo T3 5G', 'Vivo Y200']
  },
  {
    id: 'oppo',
    name: 'Oppo',
    logo: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=100&auto=format&fit=crop&q=80',
    popularModels: ['Oppo Reno 12 Pro', 'Oppo F27 Pro+', 'Oppo A3 Pro']
  },
  {
    id: 'google',
    name: 'Google Pixel',
    logo: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&auto=format&fit=crop&q=80',
    popularModels: ['Pixel 8 Pro', 'Pixel 8a', 'Pixel 8', 'Pixel 7a', 'Pixel 7 Pro']
  },
  {
    id: 'nothing',
    name: 'Nothing',
    logo: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=100&auto=format&fit=crop&q=80',
    popularModels: ['Nothing Phone (2)', 'Nothing Phone (2a)', 'Nothing Phone (1)']
  },
  {
    id: 'motorola',
    name: 'Motorola',
    logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80',
    popularModels: ['Edge 50 Pro', 'Edge 50 Fusion', 'G84 5G', 'Razr 50 Ultra']
  }
];

export const MOBILE_MODELS: MobileModel[] = [
  { id: 'm-ip15pm', brandId: 'apple', brandName: 'Apple', name: 'iPhone 15 Pro Max' },
  { id: 'm-ip15p', brandId: 'apple', brandName: 'Apple', name: 'iPhone 15 Pro' },
  { id: 'm-ip15', brandId: 'apple', brandName: 'Apple', name: 'iPhone 15' },
  { id: 'm-ip14p', brandId: 'apple', brandName: 'Apple', name: 'iPhone 14 Pro' },
  { id: 'm-ip14', brandId: 'apple', brandName: 'Apple', name: 'iPhone 14' },
  { id: 'm-ip13', brandId: 'apple', brandName: 'Apple', name: 'iPhone 13' },
  
  { id: 'm-s24u', brandId: 'samsung', brandName: 'Samsung', name: 'Galaxy S24 Ultra' },
  { id: 'm-s24p', brandId: 'samsung', brandName: 'Samsung', name: 'Galaxy S24+' },
  { id: 'm-s24', brandId: 'samsung', brandName: 'Samsung', name: 'Galaxy S24' },
  { id: 'm-s23fe', brandId: 'samsung', brandName: 'Samsung', name: 'Galaxy S23 FE' },
  
  { id: 'm-op12', brandId: 'oneplus', brandName: 'OnePlus', name: 'OnePlus 12' },
  { id: 'm-op12r', brandId: 'oneplus', brandName: 'OnePlus', name: 'OnePlus 12R' },
  { id: 'm-opn4', brandId: 'oneplus', brandName: 'OnePlus', name: 'OnePlus Nord 4' },
  
  { id: 'm-px8p', brandId: 'google', brandName: 'Google Pixel', name: 'Pixel 8 Pro' },
  { id: 'm-px8a', brandId: 'google', brandName: 'Google Pixel', name: 'Pixel 8a' },
  
  { id: 'm-np2a', brandId: 'nothing', brandName: 'Nothing', name: 'Nothing Phone (2a)' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aramid Fiber MagSafe Shield Case',
    slug: 'aramid-fiber-magsafe-case',
    category: 'mobile-covers',
    categoryName: 'Mobile Covers',
    brand: 'Apple',
    compatibleModels: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15'],
    originalPrice: 1999,
    discountPrice: 1299,
    rating: 4.8,
    reviewCount: 142,
    images: [
      'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541877944-ac82a091518a?w=600&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 45,
    sku: 'HMC-COV-AP-01',
    description: 'Ultra-slim military grade aramid fiber case with embedded strong MagSafe magnets. Anti-scratch matte coat with heat dissipation technology.',
    features: [
      'Built-in MagSafe magnetic ring',
      '0.6mm ultra-slim aerodynamic body',
      '3D precision laser cut texture',
      'Drop protection up to 10 feet'
    ],
    warranty: '6 Months Brand Warranty',
    isBestSeller: true
  },
  {
    id: 'prod-2',
    name: '9H Hardness Edge-to-Edge Privacy Tempered Glass',
    slug: 'privacy-tempered-glass',
    category: 'tempered-glass',
    categoryName: 'Tempered Glass',
    brand: 'Apple',
    compatibleModels: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 14 Pro Max', 'iPhone 13'],
    originalPrice: 899,
    discountPrice: 499,
    rating: 4.7,
    reviewCount: 210,
    images: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 88,
    sku: 'HMC-GLS-AP-02',
    description: 'Protect your phone screen from side peeping eyes while maintaining 99.9% touch sensitivity and crystal clear frontal clarity.',
    features: [
      '28-degree side privacy filter',
      'Japanese Asahi 9H toughened glass',
      'Oleophobic anti-fingerprint coating',
      'Dust-free alignment tray included'
    ],
    warranty: '1 Month Replacement Warranty',
    isBestSeller: true
  },
  {
    id: 'prod-3',
    name: '65W GaN Dual USB-C Fast Wall Charger',
    slug: '65w-gan-fast-charger',
    category: 'chargers',
    categoryName: 'Chargers',
    brand: 'Universal',
    compatibleModels: ['iPhone 15 Pro Max', 'Galaxy S24 Ultra', 'OnePlus 12', 'Pixel 8 Pro'],
    originalPrice: 2999,
    discountPrice: 1799,
    rating: 4.9,
    reviewCount: 95,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 22,
    sku: 'HMC-CHG-65W',
    description: 'Next-generation GaN fast charger. Powers up iPhone 15 to 60% in just 25 minutes. Dual ports allow simultaneous phone and laptop charging.',
    features: [
      'GaN III semiconductor technology',
      'Dual Type-C Power Delivery ports',
      'Smart temperature control chip',
      'Foldable Indian socket plug'
    ],
    warranty: '1 Year Full Replacement Warranty',
    isNewArrival: true
  },
  {
    id: 'prod-4',
    name: '100W Braided Nylon Type-C to Type-C Fast Cable (2M)',
    slug: '100w-braided-type-c-cable',
    category: 'cables',
    categoryName: 'Cables',
    brand: 'Universal',
    compatibleModels: ['iPhone 15 Pro Max', 'Galaxy S24 Ultra', 'OnePlus 12', 'Pixel 8 Pro'],
    originalPrice: 699,
    discountPrice: 349,
    rating: 4.6,
    reviewCount: 312,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 150,
    sku: 'HMC-CBL-100W',
    description: 'Heavy duty military-grade braided nylon cable supporting 100W Power Delivery and 480Mbps high-speed data transfer.',
    features: [
      '20,000+ bend lifespan test',
      'E-Marker smart safety chip',
      'Tangle-free double braided exterior',
      '2 meters extended reach'
    ],
    warranty: '6 Months Warranty'
  },
  {
    id: 'prod-5',
    name: '20,000mAh 22.5W Magnetic Power Bank with Stand',
    slug: '20000mah-magnetic-power-bank',
    category: 'power-banks',
    categoryName: 'Power Banks',
    brand: 'Universal',
    compatibleModels: ['iPhone 15 Pro Max', 'iPhone 15', 'Galaxy S24 Ultra', 'OnePlus 12'],
    originalPrice: 3499,
    discountPrice: 2299,
    rating: 4.8,
    reviewCount: 78,
    images: [
      'https://images.unsplash.com/photo-1609592424089-980753d3d63b?w=600&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 18,
    sku: 'HMC-PB-20K',
    description: 'Compact high-capacity power bank with wireless magnetic snap-on charging, built-in kickstand, and digital LED percentage display.',
    features: [
      'Wireless MagSafe 15W + Wired 22.5W',
      'Foldable aluminum kickstand',
      'Flight approved safe battery',
      'Charges up to 3 devices at once'
    ],
    warranty: '1 Year Warranty',
    isBestSeller: true
  },
  {
    id: 'prod-6',
    name: 'Active Noise Cancelling TWS Earbuds (45dB ANC)',
    slug: 'anc-tws-earbuds',
    category: 'earbuds',
    categoryName: 'Earbuds',
    brand: 'Universal',
    compatibleModels: ['iPhone 15 Pro Max', 'Galaxy S24 Ultra', 'OnePlus 12', 'Pixel 8 Pro'],
    originalPrice: 4999,
    discountPrice: 2799,
    rating: 4.7,
    reviewCount: 164,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 30,
    sku: 'HMC-AUD-TWS01',
    description: 'Immersive sound powered by 12.4mm titanium drivers. Quad-mic ENC for ultra-clear calls on Hyderabad streets.',
    features: [
      '45dB Active Noise Cancellation',
      '40 Hours total playback with case',
      'IP55 sweat and splash resistance',
      'Dual-device seamless switching'
    ],
    warranty: '1 Year Warranty'
  },
  {
    id: 'prod-7',
    name: 'Matte Frosted Anti-Fingerprint Case (Samsung Galaxy S24 Ultra)',
    slug: 'samsung-s24-ultra-frosted-case',
    category: 'mobile-covers',
    categoryName: 'Mobile Covers',
    brand: 'Samsung',
    compatibleModels: ['Galaxy S24 Ultra'],
    originalPrice: 1299,
    discountPrice: 799,
    rating: 4.9,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 35,
    sku: 'HMC-COV-SAM-24U',
    description: 'Sleek translucent back cover with metallic camera ring guard. Precise cutout for S-Pen extraction.',
    features: [
      'Metallic independent buttons',
      'Raised bezel around 200MP camera lens',
      'Tactile anti-slip side grips',
      'Wireless charging compatible'
    ],
    warranty: '6 Months Warranty'
  },
  {
    id: 'prod-8',
    name: '360° Rotating Aluminum Desk Phone Holder Stand',
    slug: 'aluminum-desk-phone-holder',
    category: 'holders',
    categoryName: 'Mobile Holders',
    brand: 'Universal',
    compatibleModels: ['iPhone 15 Pro Max', 'Galaxy S24 Ultra', 'OnePlus 12', 'Pixel 8 Pro'],
    originalPrice: 999,
    discountPrice: 499,
    rating: 4.8,
    reviewCount: 129,
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 60,
    sku: 'HMC-HLD-DESK',
    description: 'Heavy duty aerospace aluminum mobile holder with smooth 360-degree rotation click mechanism and anti-skid silicone pads.',
    features: [
      'Full metal alloy body',
      'Foldable portable design',
      'Supports smartphones & tablets up to 11 inches',
      'Cable routing cutout'
    ],
    warranty: '1 Year Warranty'
  }
];

export const REPAIR_PROBLEMS: RepairProblem[] = [
  // Screen
  {
    id: 'p-scr-1',
    categoryId: 'screen',
    title: 'Broken / Cracked Glass Outer Replacement',
    description: 'Original outer glass replacement while retaining your original display matrix.',
    estimatedPrice: 1899,
    estimatedTime: '45 Mins',
    warranty: '90 Days Warranty'
  },
  {
    id: 'p-scr-2',
    categoryId: 'screen',
    title: 'Complete Display Assembly Replacement (OLED / AMOLED)',
    description: 'Full original display module replacement for black screen, lines, or touch malfunction.',
    estimatedPrice: 3499,
    estimatedTime: '60 Mins',
    warranty: '180 Days Warranty'
  },
  // Battery
  {
    id: 'p-bat-1',
    categoryId: 'battery',
    title: 'Original High-Capacity Battery Replacement',
    description: 'Brand new high-density battery module to restore 100% health & full day battery life.',
    estimatedPrice: 1499,
    estimatedTime: '30 Mins',
    warranty: '180 Days Warranty'
  },
  {
    id: 'p-bat-2',
    categoryId: 'battery',
    title: 'Phone Not Turning On / Power IC Repair',
    description: 'In-depth motherboard power chip diagnostic and component level micro-soldering repair.',
    estimatedPrice: 2200,
    estimatedTime: '2 Hours',
    warranty: '90 Days Warranty'
  },
  // Charging
  {
    id: 'p-chg-1',
    categoryId: 'charging',
    title: 'Charging Port / Sub-board Replacement',
    description: 'Fix loose cable connection, slow charging, or non-charging USB-C / Lightning port.',
    estimatedPrice: 999,
    estimatedTime: '30 Mins',
    warranty: '90 Days Warranty'
  },
  // Camera
  {
    id: 'p-cam-1',
    categoryId: 'camera',
    title: 'Rear / Front Camera Lens & Sensor Repair',
    description: 'Fix blurry photos, focus motor clicking noise, or cracked camera glass cover.',
    estimatedPrice: 1799,
    estimatedTime: '45 Mins',
    warranty: '90 Days Warranty'
  },
  // Audio
  {
    id: 'p-aud-1',
    categoryId: 'audio',
    title: 'Loudspeaker / Earpiece / Mic Replacement',
    description: 'Fix low sound output, crackling speaker noise, or caller unable to hear voice.',
    estimatedPrice: 899,
    estimatedTime: '30 Mins',
    warranty: '90 Days Warranty'
  },
  // Software
  {
    id: 'p-soft-1',
    categoryId: 'software',
    title: 'Software Flashing / Bootloop Fix / Factory Restore',
    description: 'Resolve stuck on logo, recurring app crashes, storage OS corruption, or firmware updates.',
    estimatedPrice: 699,
    estimatedTime: '45 Mins',
    warranty: '30 Days Support'
  },
  // Other
  {
    id: 'p-oth-1',
    categoryId: 'other',
    title: 'Water Damage De-Oxidation & Diagnostics',
    description: 'Ultrasonic chemical bath treatment for moisture removal, short circuit clearing & diagnosis.',
    estimatedPrice: 1200,
    estimatedTime: '3 Hours',
    warranty: 'Diagnosed Report'
  }
];

export const SERVICE_AREAS: ServiceArea[] = [
  { id: 'sa-1', areaName: 'Madhapur / Hitech City', pincode: '500081', isSupported: true, doorstepAvailable: true, doorstepFee: 0 },
  { id: 'sa-2', areaName: 'Gachibowli / Financial District', pincode: '500032', isSupported: true, doorstepAvailable: true, doorstepFee: 0 },
  { id: 'sa-3', areaName: 'Kondapur / Hafeezpet', pincode: '500084', isSupported: true, doorstepAvailable: true, doorstepFee: 0 },
  { id: 'sa-4', areaName: 'Kukatpally / KPHB Colony', pincode: '500072', isSupported: true, doorstepAvailable: true, doorstepFee: 99 },
  { id: 'sa-5', areaName: 'Jubilee Hills / Film Nagar', pincode: '500033', isSupported: true, doorstepAvailable: true, doorstepFee: 0 },
  { id: 'sa-6', areaName: 'Banjara Hills / Punjagutta', pincode: '500034', isSupported: true, doorstepAvailable: true, doorstepFee: 0 },
  { id: 'sa-7', areaName: 'Secunderabad / Begumpet', pincode: '500003', isSupported: true, doorstepAvailable: true, doorstepFee: 99 },
  { id: 'sa-8', areaName: 'Miyapur / Chandanagar', pincode: '500049', isSupported: true, doorstepAvailable: true, doorstepFee: 99 },
  { id: 'sa-9', areaName: 'Mehdipatnam / Tolichowki', pincode: '500028', isSupported: true, doorstepAvailable: true, doorstepFee: 99 },
  { id: 'sa-10', areaName: 'Dilsukhnagar / LB Nagar', pincode: '500060', isSupported: true, doorstepAvailable: true, doorstepFee: 149 }
];

export const TIME_SLOTS: TimeSlot[] = [
  { id: 'ts-1', label: '10:00 AM – 12:00 PM', isEnabled: true },
  { id: 'ts-2', label: '12:00 PM – 02:00 PM', isEnabled: true },
  { id: 'ts-3', label: '02:00 PM – 04:00 PM', isEnabled: true },
  { id: 'ts-4', label: '04:00 PM – 06:00 PM', isEnabled: true },
  { id: 'ts-5', label: '06:00 PM – 08:00 PM', isEnabled: true }
];

export const INITIAL_REPAIR_BOOKINGS: RepairBooking[] = [
  {
    id: 'HMC-RP-100245',
    customerName: 'Kiran Kumar',
    customerPhone: '+91 98490 12345',
    customerEmail: 'kiran.k@gmail.com',
    brand: 'Apple',
    model: 'iPhone 13',
    problemId: 'p-bat-1',
    problemTitle: 'Original High-Capacity Battery Replacement',
    problemCategory: 'battery',
    serviceType: 'doorstep',
    address: {
      houseNumber: 'Flat 402, Sai Residency',
      street: 'Road No 36, Near Metro Pillar 12',
      area: 'Jubilee Hills',
      city: 'Hyderabad',
      pincode: '500033',
      landmark: 'Opposite Peddamma Temple'
    },
    preferredDate: '2026-09-18',
    preferredTimeSlot: '02:00 PM – 04:00 PM',
    initialEstimatedPrice: 2499,
    finalPrice: 2499,
    priceApprovalStatus: 'approved',
    status: 'Diagnosis',
    statusHistory: [
      { status: 'Booking Confirmed', timestamp: '2026-09-17 09:30 AM', note: 'Booking created online.' },
      { status: 'Pickup Scheduled', timestamp: '2026-09-17 10:15 AM', note: 'Technician Srikanth assigned.' },
      { status: 'Device Received', timestamp: '2026-09-17 11:00 AM', note: 'Device checked in at Madhapur Lab.' },
      { status: 'Diagnosis', timestamp: '2026-09-17 11:30 AM', note: 'Battery health measured at 71%. Original replacement verified.' }
    ],
    technicianName: 'Srikanth Rao',
    technicianPhone: '+91 91212 99887',
    diagnosisNotes: 'Original battery health degraded below 72%. No moisture detected inside motherboard. Clean replacement recommended.',
    createdAt: '2026-09-17T09:30:00Z',
    updatedAt: '2026-09-17T11:30:00Z'
  },
  {
    id: 'HMC-RP-100246',
    customerName: 'Priya Sharma',
    customerPhone: '+91 97001 54321',
    customerEmail: 'priya.s@techhyd.com',
    brand: 'Samsung',
    model: 'Galaxy S23 FE',
    problemId: 'p-scr-2',
    problemTitle: 'Complete Display Assembly Replacement (OLED / AMOLED)',
    problemCategory: 'screen',
    serviceType: 'pickup',
    address: {
      houseNumber: 'Plot 88, Mindspace View',
      street: 'Hitech City Main Rd',
      area: 'Madhapur',
      city: 'Hyderabad',
      pincode: '500081',
      landmark: 'Near Inorbit Mall'
    },
    preferredDate: '2026-09-17',
    preferredTimeSlot: '12:00 PM – 02:00 PM',
    initialEstimatedPrice: 3500,
    finalPrice: 4200,
    priceApprovalStatus: 'pending',
    status: 'Awaiting Customer Approval',
    statusHistory: [
      { status: 'Booking Confirmed', timestamp: '2026-09-17 08:00 AM', note: 'Booking received.' },
      { status: 'Device Received', timestamp: '2026-09-17 10:00 AM', note: 'Picked up from customer.' },
      { status: 'Diagnosis', timestamp: '2026-09-17 10:45 AM', note: 'Frame alignment required due to corner drop impact.' },
      { status: 'Awaiting Customer Approval', timestamp: '2026-09-17 11:15 AM', note: 'New estimate created including middle frame housing alignment.' }
    ],
    technicianName: 'Ramesh Varma',
    technicianPhone: '+91 99480 77665',
    diagnosisNotes: 'Display glass shattered and inner AMOLED bleeding blue ink. Frame denting requires micro-housing straightening for flush screen seating.',
    createdAt: '2026-09-17T08:00:00Z',
    updatedAt: '2026-09-17T11:15:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'HMC-ORD-100245',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedModel: 'iPhone 15 Pro Max'
      },
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedModel: 'iPhone 15 Pro Max'
      }
    ],
    subtotal: 1798,
    discount: 100,
    deliveryCharge: 0,
    total: 1698,
    couponCode: 'WELCOME100',
    customerDetails: {
      name: 'Venkatesh Reddy',
      phone: '+91 98850 44332',
      email: 'venky.reddy@hyderabad.in'
    },
    shippingAddress: {
      street: 'Flat 101, Cyber Towers Rd',
      area: 'Madhapur',
      city: 'Hyderabad',
      pincode: '500081',
      landmark: 'Behind Westin Hotel'
    },
    paymentMethod: 'UPI',
    paymentStatus: 'Success',
    paymentId: 'pay_HYD10092384',
    orderStatus: 'Out for Delivery',
    createdAt: '2026-09-16T14:20:00Z'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'WELCOME100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 499,
    description: '₹100 Off on your first accessories order above ₹499',
    expiryDate: '2026-12-31',
    isActive: true
  },
  {
    code: 'HYDREPAIR',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 999,
    description: '15% Off on doorstep repair bookings above ₹999',
    expiryDate: '2026-12-31',
    isActive: true
  },
  {
    code: 'FESTIVE200',
    discountType: 'fixed',
    discountValue: 200,
    minOrderAmount: 1499,
    description: '₹200 Instant discount on cart total above ₹1,499',
    expiryDate: '2026-11-30',
    isActive: true
  }
];

export const SAMPLE_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    authorName: 'Srinivas R.',
    rating: 5,
    comment: 'Booked doorstep screen repair for my iPhone 14 in Gachibowli. Technician arrived in 40 mins with clean kit and completed repair right in front of me! Amazing service.',
    date: '2 days ago',
    itemType: 'repair',
    itemName: 'iPhone 14 Screen Repair (Doorstep)',
    verified: true
  },
  {
    id: 'rev-2',
    authorName: 'Ananya Rao',
    rating: 5,
    comment: 'The MagSafe case quality is top tier. Fits my iPhone 15 Pro Max like a glove and fast delivery in Madhapur within 4 hours!',
    date: '3 days ago',
    itemType: 'product',
    itemName: 'Aramid Fiber MagSafe Shield Case',
    verified: true
  },
  {
    id: 'rev-3',
    authorName: 'Mohammed Asif',
    rating: 5,
    comment: 'Got my OnePlus 12 battery replaced. Original part and phone feels brand new again. Highly recommend MobileKart™!',
    date: '1 week ago',
    itemType: 'repair',
    itemName: 'OnePlus 12 Battery Replacement',
    verified: true
  }
];
