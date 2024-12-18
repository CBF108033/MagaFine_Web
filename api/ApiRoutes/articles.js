import express from "express";
import { createArticle, deleteAticle, getArticles, updatedArticle, getAllArticles, getUserArticles, getMyselfArticles, getAllArticlesType, getPrevNextArticles } from "../RoutesController/articles.js";
import { verifyUser } from "../JWT_TOKEN.js";
const router = express.Router();

router.post("/:userID", verifyUser, createArticle)//新增文章，需驗證
router.get("/:id", getArticles)//取得文章，不需驗證
router.get("/findUser/:userID", getUserArticles)//取得該作者的全部文章，不需驗證
router.get("/myself/:userID", verifyUser, getMyselfArticles)//取得該作者的全部文章，需驗證
router.get("/:id/prev-next", getPrevNextArticles)//取得前後篇文章，不需驗證
router.put("/:userID/:id", verifyUser, updatedArticle)//更新文章，需驗證
router.delete("/:userID/:id", verifyUser, deleteAticle)//刪除文章，需驗證
router.get("/", getAllArticles)//取得全部文章，不需驗證
router.get("/allArticlesType/:type", getAllArticlesType) //type可以隨便打，預設為all//取得全部文章種類，不需驗證

export default router