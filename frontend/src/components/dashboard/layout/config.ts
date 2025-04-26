import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'm-overview', title: 'Overview', href: paths.merchant.dashboard, icon: 'chart-pie', role: 'merchant' },
  { key: 'm-orders', title: 'Orders', href: paths.merchant.orders, icon: 'shopping-bag', role: 'merchant' },
  { key: 'm-account', title: 'Account', href: paths.merchant.account, icon: 'user', role: 'merchant' },
  { key: 'm-product', title: 'Products', href: paths.merchant.product, icon: 'box', role: 'merchant' },
  // { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
  { key: 'c-overview', title: 'Overview', href: paths.customer.dashboard, icon: 'chart-pie', role: 'customer' },
  { key: 'c-products', title: 'Products', href: paths.customer.products, icon: 'box', role: 'customer' },
  { key: 'c-orders', title: 'Orders', href: paths.customer.orders, icon: 'shopping-bag', role: 'customer' },
  { key: 'c-cart', title: 'Cart', href: paths.customer.cart, icon: 'shopping-cart', role: 'customer' },
  { key: 'c-account', title: 'Account', href: paths.customer.account, icon: 'user', role: 'customer' },
] satisfies NavItemConfig[];
