export const ROUTES = {
  // Home (split-screen)
  HOME: '/',

  // Events space
  EVENTS: '/evenements',
  EVENTS_GALLERY: '/evenements/galerie',
  EVENTS_QUOTE: '/evenements/devis',

  // Shop space
  SHOP: '/boutique',
  SHOP_CART: '/boutique/panier',
  CHECKOUT: '/boutique/checkout',
  CHECKOUT_SUCCESS: '/boutique/checkout/success',
  CHECKOUT_CANCEL: '/boutique/checkout/cancel',

  // Shared pages
  ABOUT: '/about',
  FAQ: '/faq',
  CONTACT: '/contact',

  // Legacy routes (redirects)
  RECEPTIONS: '/receptions',
  SHABBAT: '/shabbat',
  GALLERY: '/gallery',

  // Admin
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_QUOTES: '/admin/quotes',
  ADMIN_MEDIA: '/admin/media',
  ADMIN_FAQ: '/admin/faq',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_MESSAGES: '/admin/messages',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_DELIVERY_ZONES: '/admin/delivery-zones',
  ADMIN_FORMULAS: '/admin/formulas',
  ADMIN_LOGIN: '/admin/login',
} as const;
