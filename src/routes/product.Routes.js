import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  seedProducts,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes for fetching products
router.route("/").get(verifyJWT, getAllProducts);

// Create product (supports single file 'image' upload via Multer OR direct JSON image URL)
router.route("/").post(upload.single("image"), createProduct);

// Seed database with mock products for rapid testing & demo
router.route("/seed").post(seedProducts);

// Single product routes
router
  .route("/:id")
  .get(getProductById)
  .patch(upload.single("image"), updateProduct)
  .put(upload.single("image"), updateProduct)
  .delete(deleteProduct);

export default router;
