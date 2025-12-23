// ----------------------------------------------------------------------
// Payment Gateway Routes
// ----------------------------------------------------------------------

const ROOTS = {
  // Auth
  ADMIN_LOGIN: '/admin/login',
  MERCHANT_LOGIN: '/login',
  MERCHANT_REGISTER: '/register',

  // Admin Dashboard
  ADMIN: '/admin',

  // Merchant Dashboard
  MERCHANT: '/merchant',

  // Public
  PAY: '/pay',
};

// ----------------------------------------------------------------------

export const paths = {
  // Root
  root: '/',

  // Auth
  auth: {
    adminLogin: ROOTS.ADMIN_LOGIN,
    merchantLogin: ROOTS.MERCHANT_LOGIN,
    merchantRegister: ROOTS.MERCHANT_REGISTER,
  },

  // Admin Dashboard
  admin: {
    root: ROOTS.ADMIN,
    dashboard: `${ROOTS.ADMIN}/dashboard`,
    // merchants: `${ROOTS.ADMIN}/merchants`,
    merchants: {
      root: `${ROOTS.ADMIN}/merchants`,
      edit: (id: string) => `${ROOTS.ADMIN}/merchants/${id}`,
    },
    payments: `${ROOTS.ADMIN}/payments`,
    admins: {
      root: `${ROOTS.ADMIN}/admins`,
      new: `${ROOTS.ADMIN}/admins/new`,
      edit: (id: string) => `${ROOTS.ADMIN}/admins/${id}`,
    },
    settings: `${ROOTS.ADMIN}/settings`,
  },

  // Merchant Dashboard
  merchant: {
    root: ROOTS.MERCHANT,
    dashboard: `${ROOTS.MERCHANT}/dashboard`,
    payments: `${ROOTS.MERCHANT}/payments`,
    paymentDetail: (id: string) => `${ROOTS.MERCHANT}/payments/${id}`,
    apiKeys: `${ROOTS.MERCHANT}/api-keys`,
    networks: `${ROOTS.MERCHANT}/networks`,
    settings: `${ROOTS.MERCHANT}/settings`,
    webhooks: `${ROOTS.MERCHANT}/webhooks`,
  },

  // Public Payment Page
  pay: {
    root: ROOTS.PAY,
    payment: (id: string) => `${ROOTS.PAY}/${id}`,
  },

  // Errors
  notFound: '/404',
  serverError: '/500',
};
