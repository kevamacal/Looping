import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Usuario o correo ya existe." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultAvatarUrl = "https://ui-avatars.com/api/?name=" + username;
    const defaultBio = "¡Hola! Soy un nuevo usuario de RED SOCIAL.";

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        bio: defaultBio,
        avatar: defaultAvatarUrl,
      },
    });

    res.status(201).json({ message: "Usuario creado", user });
  } catch (error) {
    console.error("Error en /register:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login exitoso", user, token });
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
      },
    });

    const followers = await prisma.follow.findMany({
      where: { followingId: decoded.id },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    const following = await prisma.follow.findMany({
      where: { followerId: decoded.id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    const posts = await prisma.post.findMany({
      where: { authorId: decoded.id },
      select: {
        id: true,
        image: true,
        content: true,
      },
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({
      user,
      followers: followers.map((f) => f.follower),
      following: following.map((f) => f.following),
      posts: posts,
    });
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
});

router.put("/me", async (req, res) => {
  const { username, email, bio } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: { username, email, bio },
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
});

export default router;
