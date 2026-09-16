import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoute.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173"
    })
);

app.get("/", (req, res) => {
    res.send("API working");
});

app.use("/api/auth", authRouter);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server started on PORT: ${port}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

startServer();