import express from "express";
import { ProductControllers } from "../../modules/product/product.controller";
import { auth } from "../../modules/auth";
import { validate } from "../../modules/validate";
import { productValidation } from "../../modules/product/product.validation";

const router = express.Router();

// Public routes (no auth required)
router.get("/", ProductControllers.getAllProducts); // Remove auth for public product listing
router.get("/:productId", ProductControllers.getSingleProduct);

// Protected routes (auth required)
router.post("/", auth(), ProductControllers.createProduct);
router.put("/:productId", auth(), ProductControllers.updateSingleProduct);
router.delete("/:productId", auth(), ProductControllers.deleteOneProduct);


// Merchant dashboard route
router.get("/merchant/dashboard/product", auth(), ProductControllers.getAllProducts);
router.put("/merchant/dashboard/product/edit/:productId", auth(), ProductControllers.updateSingleProduct);
router.delete("/merchant/dashboard/product/delete/:productId", auth(), ProductControllers.deleteOneProduct);
router
  .route('/:productId/reviews')
  .post(
    auth(), 
    validate(productValidation.addReview), 
    ProductControllers.addReview
  );

export const ProductRoutes = router;

