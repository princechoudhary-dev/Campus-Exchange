import express from "express";
import {
  getAllusers,
  getUser,
  signin,
  signup,
  isVerifiedUser,
} from "../controller/auth.controller.js";
import { isAdmin, protect } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/get-user", protect, getUser);

//admin
router.get("/admin/getAll-users", protect, isAdmin, getAllusers);
router.post("/adminverify-user/:id", protect, isAdmin, isVerifiedUser);

export default router;
