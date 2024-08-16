import express from "express";
import { verifyAdmin, verifyUser } from "../JWT_TOKEN.js";
import { deleteLetterUser, getAllLetterUsers, getLetterUser, getLetterUserInfo } from "../RoutesController/letterusers.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllLetterUsers)//取得全部用戶資料，需驗證
router.get("/:userID", verifyUser, getLetterUser)//取得用戶資料，需驗證
router.get("/find/:userID", getLetterUserInfo)//取得用戶資料，不需驗證
router.delete("/:userID", verifyUser, deleteLetterUser)//刪除用戶資料，需驗證

export default router