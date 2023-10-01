import express from "express";
import { createNews, deleteNews, getNews, updatedNews, getAllNews, getUserNews, getMyselfNews } from "../RoutesController/news.js";
import { verifyUser } from "../JWT_TOKEN.js";
const router = express.Router();

router.post("/:userID", verifyUser, createNews)//新增News，需驗證
router.get("/:id", getNews)//取得News，不需驗證
router.get("/findUser/:userID", getUserNews)//取得該作者的全部News，不需驗證
router.get("/myself/:userID", verifyUser, getMyselfNews)//取得該作者的全部News，需驗證
router.put("/:userID/:id", verifyUser, updatedNews)//更新News，需驗證
router.delete("/:userID/:id", verifyUser, deleteNews)//刪除News，需驗證
router.get("/", getAllNews)//取得全部News，不需驗證

export default router