import { Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import ApiError from '../../errors/ApiError';
import * as customerOrderService from './customer.order.service';
import pick from '../../utils/pick';
import { IUserDoc } from '../../user/user.interfaces';
import Order from '../order.model';
import { OrderStatus } from '../order.interfaces';
import Product from '../../product/product.model';
import { IProductDoc } from '../../product/product.interface';

interface CustomRequest extends Request {
  user?: IUserDoc;
}

export const getOrders = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Bạn cần đăng nhập');
  }

  const filter = {
    ...pick(req.query, ['status']),
    customerId: req.user._id.toString(),
  };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  try {
    const result = await customerOrderService.queryOrders(filter, options);
    res.send(result);
  } catch (error) {
    console.log("Got Error: ", error)
  }
  
 
});

export const getOrder = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Bạn cần đăng nhập');
  }

  if (typeof req.params['orderId'] !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order ID không hợp lệ');
  }

  const order = await customerOrderService.getOrderById(new mongoose.Types.ObjectId(req.params['orderId']));
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đơn hàng');
  }

  // Kiểm tra đơn hàng có thuộc về customer không
  if (order.customerId.toString() !== req.user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền xem đơn hàng này');
  }

  res.send(order);
});

export const cancelOrder = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Bạn cần đăng nhập');
  }

  if (typeof req.params['orderId'] !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order ID không hợp lệ');
  }

  const order = await customerOrderService.cancelOrder(
    new mongoose.Types.ObjectId(req.params['orderId']),
    req.user._id
  );
  res.send(order);
});

export const completeOrder = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Bạn cần đăng nhập');
  }

  if (typeof req.params['orderId'] !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order ID không hợp lệ');
  }

  const order = await customerOrderService.completeOrder(
    new mongoose.Types.ObjectId(req.params['orderId']),
    req.user._id
  );
  res.send(order);
});

export const getCustomerOrders = async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Bạn cần đăng nhập');
  }

  const filter = {
    ...pick(req.query, ['status']),
    customerId: req.user._id,
  };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const orders = await Order.paginate(filter, {
    ...options,
    sortBy: 'createdAt:desc',
  });

  res.send(orders);
};

export const getCustomerOrder = async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Bạn cần đăng nhập');
  }

  const order = await Order.findOne({
    _id: req.params['orderId'],
    customerId: req.user._id,
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đơn hàng');
  }

  res.send(order);
};

export const createCustomerOrder = async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Bạn cần đăng nhập');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, shippingAddress } = req.body;
    const customerId = req.user._id;

    // Validate and get product details
    const productIds = items.map((item: { product: string }) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Một số sản phẩm không tồn tại');
    }

    // Create order items with product details
    const orderItems = items.map((item: { product: string; quantity: number }) => {
      const product = products.find((p: IProductDoc) => p._id.toString() === item.product);
      if (!product) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Sản phẩm không tồn tại');
      }
      return {
        product: product._id,
        name: product.name,
        photoUrls: product.photoUrls,
        quantity: item.quantity,
        unitPrice: product.unitPrice,
      };
    });

    // Get merchant from first product
    const firstProduct = products[0];
    if (!firstProduct?.merchant) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Không tìm thấy thông tin người bán');
    }

    const order = await Order.create([{
      merchant: firstProduct.merchant,
      customerId,
      items: orderItems,
      shippingAddress,
      status: OrderStatus.PENDING,
      discountAmount: 0,
      shippingAmount: 0,
    }], { session });

    await session.commitTransaction();
    res.status(httpStatus.CREATED).send(order[0]);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const cancelCustomerOrder = async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Bạn cần đăng nhập');
  }

  const order = await Order.findOne({
    _id: req.params['orderId'],
    customerId: req.user._id,
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đơn hàng');
  }

  if (![OrderStatus.PENDING, OrderStatus.APPROVED].includes(order.status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Không thể hủy đơn hàng ở trạng thái hiện tại');
  }

  order.status = OrderStatus.CANCELLED;
  await order.save();

  res.send(order);
};