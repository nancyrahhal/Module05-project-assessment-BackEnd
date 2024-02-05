import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productControllers.js";
import upload from "../middlewares/multerMiddleware.js";
import protect from "../middlewares/authMiddleware.js";
import protectAdmin from "../middlewares/adminProtectMiddleware.js";

const productRoute = express.Router();


// Get all
productRoute.get("/", getAllProducts);
// Get single
productRoute.get("/:id", getProductById);

// Create
productRoute.post("/", upload.single("image"),protectAdmin, createProduct);



// Update
productRoute.put("/:id", upload.single("image"),protectAdmin, updateProduct);

// Delete
productRoute.delete("/:id",protectAdmin, deleteProduct);


export default productRoute;