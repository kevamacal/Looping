import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "./middlewares/verifyToken.js";
import authRoutes from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import followsRouter from "./routes/follows.js";
import likesRouter from "./routes/likes.js";
import commentsRouter from "./routes/comments.js";
import uploadImageRouter from "./routes/uploadImage.js";
import messagesRouter from "./routes/messages.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", verifyToken, usersRouter);
app.use("/api/posts", verifyToken, postsRouter);
app.use("/api/follows", verifyToken, followsRouter);
app.use("/api/likes", verifyToken, likesRouter);
app.use("/api/upload-image", verifyToken, uploadImageRouter);
app.use("/api/comments", verifyToken, commentsRouter);
app.use("/api/messages", verifyToken, messagesRouter);
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
