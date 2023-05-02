import express from "express";
import { createArticle, deleteAticle, getArticles, updatedArticle, getAllArticles, getUserArticles, getAllArticlesType } from "../RoutesController/articles.js";
import { verifyUser } from "../JWT_TOKEN.js";
const router = express.Router();

router.post("/:userID", verifyUser, createArticle)
router.get("/:id", getArticles)
router.get("/findUser/:userID", getUserArticles)
router.put("/:id", verifyUser, updatedArticle)
router.delete("/:userID/:id", verifyUser, deleteAticle)
router.get("/", getAllArticles)
router.get("/allArticlesType/:type", getAllArticlesType) //type可以隨便打，預設為all

export default router