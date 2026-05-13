import express from "express";
import { createProduct ,getAllProducts,getMyListing} from "../controller/Product.controller.js";
import upload from "../middleware/multer.js";
import { isUser, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, isUser, upload.array("images",5), createProduct);   // uploaded name 

router.get("/get-all",getAllProducts)
router.get("/get-mylisting",protect,isUser,getMyListing)

export default router;




