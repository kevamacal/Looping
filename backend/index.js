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
import uploadImageRouter from "./routes/uploadImage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", verifyToken, usersRouter);
app.use("/api/posts", verifyToken, postsRouter);
app.use("/api/follows", verifyToken, followsRouter);
app.use("/api/likes", verifyToken, likesRouter);
app.use("/api/upload-image", verifyToken, uploadImageRouter);
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
