import mongoose from "mongoose";
import express, { request } from "express";
import dotenv from "dotenv";
import articlesApiRouter from "./ApiRoutes/articles.js";
import usersApiRouter from "./ApiRoutes/users.js";
import authApiRouter from "./ApiRoutes/auth.js";
import labelsApiRouter from "./ApiRoutes/labels.js";
import columnsApiRouter from "./ApiRoutes/columns.js";
import seriesApiRouter from "./ApiRoutes/series.js";
import newsApiRouter from "./ApiRoutes/news.js";
import cookieParser from "cookie-parser"

dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB)
        console.log("connected to MongoDB");
    } catch (error) {
        console.log("disconnect to MongoDB");
    }
}

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
});
mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnect");
});

const app = express();
const port = 5000;
app.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
})

app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/articles", articlesApiRouter);
app.use("/api/v1/users", usersApiRouter);
app.use("/api/v1/auth", authApiRouter);
app.use("/api/v1/labels", labelsApiRouter);
app.use("/api/v1/columns", columnsApiRouter);
app.use("/api/v1/series", seriesApiRouter);
app.use("/api/v1/news", newsApiRouter);

app.use((error,req,res,next) => {
    const errorStatus = error.status || 500;
    const errorMessage = error.message || "Something went wrong";
    return res.status(errorStatus).json({
        status: errorStatus,
        message: errorMessage
    })
})

app.get('/api/v1/getip', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    res.json({ ip: ip });
});