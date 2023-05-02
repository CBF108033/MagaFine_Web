import express from "express";
import { createColumn, deleteColumn, getAllColumns, updatedColumns } from "../RoutesController/columns.js";
const router = express.Router();

router.get("/", getAllColumns)
router.post("/", createColumn)
router.put("/:id", updatedColumns)
router.delete("/:id", deleteColumn)

export default router