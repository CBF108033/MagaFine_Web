import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import articlesApiRouter from "./ApiRoutes/articles.js";
import usersApiRouter from "./ApiRoutes/users.js";
import labelsApiRouter from "./ApiRoutes/labels.js";

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

app.use("/api/v1/articles", articlesApiRouter);
app.use("/api/v1/users", usersApiRouter);
app.use("/api/v1/labels", labelsApiRouter);