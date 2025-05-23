
export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  merchant:{
    dashboard: '/merchant/dashboard',
    product: '/merchant/dashboard/product',
    orders: '/merchant/dashboard/orders',
    account: '/merchant/dashboard/account',

  },
  customer:{
    dashboard: '/customer/dashboard',
    products: '/customer/dashboard/products',
    cart: '/customer/dashboard/cart',
    orders: '/customer/dashboard/orders',
    account: '/customer/dashboard/account',
  },
  dashboard: {
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    orders: '/dashboard/orders'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
