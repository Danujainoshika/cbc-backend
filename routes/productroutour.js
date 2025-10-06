import express from "express";
import { craeteProduct, deleteProduct, getProduct, getProductID, updateProduct } from "../Controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/",getProduct);
productRouter.post("/",craeteProduct);
productRouter.delete("/:productID",deleteProduct)
productRouter.put("/:productID",updateProduct)
productRouter.get("/:productID",getProductID)

export default productRouter;