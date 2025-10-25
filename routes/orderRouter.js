import express from 'express';
import { createOrder, getOrders, orderStatusUpdate } from '../Controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/",getOrders);
orderRouter.put("/status/:orderID",orderStatusUpdate);

export default orderRouter;