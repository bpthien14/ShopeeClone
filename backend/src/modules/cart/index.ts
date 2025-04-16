// Export controller functions
export {
  addToCart,
  getCart, 
  updateCartItem,
  removeFromCart,
  clearCart,
  checkoutCart
} from './cart.controller';

// Export service functions with aliases to avoid naming conflicts
export {
  addToCart as addToCartService,
  getCart as getCartService,
  updateCartItem as updateCartItemService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService
} from './cart.service';

// Export Cart model and validation
export { default as Cart } from './cart.model';
export { cartValidation } from './cart.validation';