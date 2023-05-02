import express from "express";
import { getTop10Labels } from "../RoutesController/labels.js";
const router = express.Router();

router.get("/top10Labels", getTop10Labels)

export default router