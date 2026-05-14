import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createOrder, getMyOrders,getMyPurchases , getMySales} from "../controller/order.controller.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

router.get("/my-purchases", protect, getMyPurchases);

router.get("/my-sales", protect, getMySales);

export default router;