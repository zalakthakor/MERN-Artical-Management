import express from "express";

import auth, { validateArtical } from "../authservice/auth.js";
import {
  createArtical,
  getArticals,
  updateArtical,
  deleteArtical,
  getarticalById,
  updateStatus,
  updateComment,
  
  
} from "../controllers/articals.js";
const router = express.Router();


router.get("/",getArticals);
router.post("/",auth,validateArtical,createArtical);
router.patch("/:id",updateArtical);
router.patch("/status/:id",auth,updateStatus);
router.patch("/comment/:id",auth,updateComment);
router.post("/delete/:id",auth,deleteArtical);
router.get("/:id",getarticalById)

export default router;
