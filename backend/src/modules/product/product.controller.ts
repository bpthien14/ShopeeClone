import { Request, Response } from "express";
import mongoose from "mongoose";

import Product from "./product.model";
import { ProductServices } from "./product.service";
import ProductValidationSchema from "./product.validation.zod";
import { IProduct } from "./product.interface";

const createProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;

    const zodParsedProductData = ProductValidationSchema.parse(product);

    const completeProductData: IProduct = {
      merchant: new mongoose.Types.ObjectId(), // Replace with actual merchant ObjectId
      unitPrice: zodParsedProductData.price, // Map price to unitPrice
      comparePrice: zodParsedProductData.price * 1.1, // Example logic for comparePrice
      stockAmount: zodParsedProductData.quantity, // Map quantity to stockAmount
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "",
      description: "",
      status: "active",
      photoUrls: [],
      ratings: []
    };

    const result = await ProductServices.createProductIntoDB(
      completeProductData
    );

    res.status(200).json({
      success: true,
      message: "Product created successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product is not created successfully",
      error: error,
    });
  }
};

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query["searchTerm"] as string;

    if (searchTerm) {
      const queryProducts = await ProductServices.queryProductByName(
        searchTerm
      );
      if (queryProducts.length === 0) {
        res.status(404).json({
          success: false,
          message: `No products found matching search term ${searchTerm} `,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `Products matching search term '${searchTerm}' fetched successfully!`,
          data: queryProducts,
        });
      }
    } else {
      const result = await ProductServices.getAllProductFromDB();
      res.status(200).json({
        success: true,
        message: `porducts fetched successfully!`,
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product is not fatched successfully",
      error: error,
    });
  }
};

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

export const ProductControllers = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateSingleProduct,
  deleteOneProduct,
};