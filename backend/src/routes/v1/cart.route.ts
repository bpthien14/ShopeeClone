import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { cartValidation } from '../../modules/cart';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../../modules/cart';

const router: Router = express.Router();

router
  .route('/')
  .get(auth(), validate(cartValidation.getCart), getCart)
  .post(auth(), validate(cartValidation.addToCart), addToCart);

router
  .route('/:productId')
  .patch(auth(), validate(cartValidation.updateCartItem), updateCartItem)
  .delete(auth(), validate(cartValidation.removeFromCart), removeFromCart);

router.post('/clear', auth(), validate(cartValidation.clearCart), clearCart);

router
  .route('/me')
  .get(auth(), validate(cartValidation.getCart), getCart);

export default router;