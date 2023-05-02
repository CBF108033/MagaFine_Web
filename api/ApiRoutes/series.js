import express from "express";
import { createSeries, deleteSeries, getAllSeries, updatedSeries } from "../RoutesController/series.js";
const router = express.Router();

router.get("/", getAllSeries)
router.post("/", createSeries)
router.put("/:id", updatedSeries)
router.delete("/:id", deleteSeries)

export default router