import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.send("articles");
});
router.get("/123", (req, res) => {
    res.send("articles 123");
});

export default router