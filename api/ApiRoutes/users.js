import express from "express";
import { deleteUser, getAllUsers, getUser, updateUser } from "../RoutesController/users.js";
import { verifyAdmin, verifyUser } from "../JWT_TOKEN.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllUsers)
router.get("/:id", verifyUser, getUser)
router.put("/:id", verifyUser, updateUser)
router.delete("/:id", verifyUser, deleteUser)

export default router