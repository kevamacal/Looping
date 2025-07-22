import express from "express";
import { PrismaClient } from "@prisma/client";
import { validatePostInput } from "../middlewares/validatePostInput.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await prisma.post.findMany({
      where: {
        NOT: {
          authorId: userId,
        },
      },
      include: {
        author: true,
        likes: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    const postsWithLikes = posts.map((post) => ({
      ...post,
      isLiked: post.likes.length > 0,
    }));

    console.log(posts);

    res.json({ posts: postsWithLikes });
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los posts",
    });
  }
});

router.post("/", validatePostInput, async (req, res) => {
  const { content, image } = req.body;

  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const newPost = await prisma.post.create({
      data: {
        content,
        image,
        authorId: req.user.id,
      },
      include: { author: { select: { username: true } } },
    });

    res.status(201).json({ post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Error al crear la publicación" });
  }
});

export default router;
