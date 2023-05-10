import express from "express";
import { deleteUser, getAllUsers, getUser, updateUser, getUserInfo, updateAuthorLike } from "../RoutesController/users.js";
import { verifyAdmin, verifyUser } from "../JWT_TOKEN.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllUsers)//取得全部用戶資料，需驗證
router.get("/:userID", verifyUser, getUser)//取得用戶資料，需驗證
router.get("/find/:userID", getUserInfo)//取得用戶資料，不需驗證
router.put("/:userID", verifyUser, updateUser)//更新用戶資料
router.put("/like/:userID/:articleID", verifyUser, updateAuthorLike)//更新作者的like，需驗證
router.delete("/:userID", verifyUser, deleteUser)//刪除用戶資料，需驗證

export default router