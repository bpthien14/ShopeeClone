import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { ShoppingBag as ShoppingBagIcon } from '@phosphor-icons/react/dist/ssr/ShoppingBag';
import { ShoppingCart as ShoppingCartIcon } from '@phosphor-icons/react/dist/ssr/ShoppingCart';
import { Package as BoxIcon } from '@phosphor-icons/react/dist/ssr/Package';
export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
  'shopping-bag': ShoppingBagIcon,
  'shopping-cart': ShoppingCartIcon,
  'box': BoxIcon,
} as Record<string, Icon>;
