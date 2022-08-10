import express from "express";
import auth, { validateUser, validateUserAdd } from "../authservice/auth.js";

const router = express.Router();

import { createUser, deleteUser, getUserById, getUsers, signin, updateUser } from "../controllers/user.js";


router.post("/signin",validateUser,signin);

router.post("/",auth,validateUserAdd,createUser);
router.get("/",getUsers);
router.get("/:id",getUserById);
router.patch("/:id",auth,updateUser);
router.post("/delete/:id",auth,deleteUser);

export default router;