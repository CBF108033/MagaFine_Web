import express from "express";
import { createArticle, deleteAticle, getArticles, updatedArticle, getAllArticles, getUserArticles } from "../RoutesController/articles.js";
import { verifyUser } from "../JWT_TOKEN.js";
const router = express.Router();

router.post("/:userID", verifyUser, createArticle)
router.get("/:id", getArticles)
router.get("/findUser/:userID", getUserArticles)
router.put("/:id", verifyUser, updatedArticle)
router.delete("/:userID/:id", verifyUser, deleteAticle)
router.get("/", getAllArticles)
export default router