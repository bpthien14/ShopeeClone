import { Request, Response } from "express";
import mongoose from "mongoose";

import Product from "./product.model";
import { ProductServices } from "./product.service";
import ProductValidationSchema from "./product.validation.zod";
import { IProduct } from "./product.interface";
import httpStatus from "http-status";
import { ApiError } from "../errors";
import { catchAsync } from "../utils";
import  Order  from "../order/order.model";
import { IUserDoc } from '../user/user.interfaces';
// import { CreateProductInput } from './product.validation';

// import Order from './order.model';

interface CustomRequest extends Request {
  user?: IUserDoc;
}

const createProduct = catchAsync(async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const productData = req.body;
  const zodParsedProductData = ProductValidationSchema.parse(productData);

  const completeProductData: IProduct = {
    merchant: req.user._id,
    name: zodParsedProductData.name,
    description: zodParsedProductData.description,
    unitPrice: zodParsedProductData.price,
    comparePrice: zodParsedProductData.price * 1.1,
    stockAmount: zodParsedProductData.quantity,
    status: "active",
    photoUrls: [
      "https://example.com/placeholder.jpg"
    ], // Default placeholder image
    ratings: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await ProductServices.createProductIntoDB(completeProductData);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Product created successfully!",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: CustomRequest, res: Response) => {
  const searchTerm = req.query['searchTerm'] as string | undefined;
  const userId = req.user?._id;
  const userRole = req.user?.role;
  
  // Base query to show only active products for public/customer view
  let query: Record<string, any> = {
    status: 'active'
  };

  // Special case: if it's a merchant viewing their dashboard, show all their products
  if (userId && userRole === 'merchant' && req.path.includes('merchant/dashboard')) {
    query = { merchant: userId };
    delete query['status']; // Show all products (active and draft) for merchant
  }

  // Add search filter if searchTerm exists
  if (searchTerm?.trim()) {
    query = { 
      ...query,
      name: { $regex: searchTerm.trim(), $options: 'i' }
    };
  }

  const products = await Product.find(query)
    .populate('merchant', 'name')  // Populate merchant details
    .sort({ createdAt: -1 });     // Sort by newest first
  
  res.status(200).json(products);
});

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
      return;
    }
    const result = await ProductServices.getSingleProductFromDB(productId);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product is not fatched successfully",
      error: error,
    });
  }
};


//update document
const updateSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;
    const zodParsedUpdateData = ProductValidationSchema.parse(updateData);

    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      zodParsedUpdateData,
      { new: true }
    );

    if (!updateProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updateData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error,
    });
  }
};

//delete document
const deleteOneProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }
    const result = await ProductServices.deleteProduct(productId);
    console.log(result);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Product delete is not successfully",
      error: error,
    });
  }
};


// const searchProduct = async (req: Request, res: Response) => {
//   try {
//     const { searchItem } = req.query;
//     if (searchItem || typeof searchItem !== "string") {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or missing search term",
//       });
//     }

//     const result = await productService.deleteProduct(productId);

//     res.status(200).json({
//       success: true,
//       message: "Product deleted successfully!",
//       data: null,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Product delete is notsuccessfully",
//       error: error,
//     });
//   }
// };
export const addReview = catchAsync(async (req: CustomRequest, res: Response) => {
  const { user } = req;
  if (!user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const productId = new mongoose.Types.ObjectId(req.params["productId"]);
  const customerId = user._id;

  // Check if product exists and is active
  const product = await Product.findOne({ 
    _id: productId,
    status: 'active'
  });

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found or not available');
  }

  // Check if user has completed order containing this product
  const completedOrder = await Order.findOne({
    customerId,
    'items.product': productId,
    status: 'completed'
  });

  if (!completedOrder) {
    throw new ApiError(
      httpStatus.FORBIDDEN, 
      'You must purchase and receive this product before reviewing'
    );
  }

  // Check if user has already reviewed this product
  const hasReviewed = product.ratings.some(
    rating => rating.customerId.toString() === customerId.toString()
  );

  if (hasReviewed) {
    throw new ApiError(
      httpStatus.CONFLICT, 
      'You have already reviewed this product'
    );
  }

  // Add the review following IProductRating interface
  product.ratings.push({
    customerId,
    orderId: completedOrder._id,
    description: req.body.description,
    rate: req.body.rate
  });

  await product.save();

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Review added successfully',
    data: {
      productId: product._id,
      review: product.ratings[product.ratings.length - 1]
    }
  });
});

export const createProductHandler = async (req: CustomRequest, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const product = await ProductServices.createProductIntoDB({
    ...req.body,
    merchant: req.user._id,
    ratings: [],
    createdAt: undefined,
    updatedAt: undefined
  });
  res.status(201).json(product);
}

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateSingleProduct,
  deleteOneProduct,
  // searchProduct,
  addReview,
  createProductHandler,
};