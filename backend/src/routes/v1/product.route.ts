import express from "express";
import { ProductControllers } from "../../modules/product/product.controller";
import { auth } from "src/modules/auth";
import { validate } from "src/modules/validate";
import { productValidation } from "src/modules/product/product.validation";

const router = express.Router();

router.post("/", ProductControllers.createProduct);
router.get("/", ProductControllers.getAllProducts);
router.get("/:productId", ProductControllers.getSingleProduct);
router.put("/:productId", ProductControllers.updateSingleProduct);
router.delete("/:productId", ProductControllers.deleteOneProduct);

router
  .route('/:productId/reviews')
  .post(
    auth('customer'), 
    validate(productValidation.addReview), 
    ProductControllers.addReview
  );

export const ProductRoutes = router;