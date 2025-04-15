
export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  merchant:{
    dashboard: '/merchant/dashboard',
    // products: '/merchant/dashboard/products',
    // orders: '/merchant/dashboard/orders',
    account: '/merchant/dashboard/account',

  },
  customer:{
    dashboard: '/customer/dashboard',
    // orders: '/customer/dashboard/orders',
    account: '/customer/dashboard/account',
  },
  dashboard: {
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
