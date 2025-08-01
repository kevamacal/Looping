import express from "express";
import { PrismaClient } from "@prisma/client";
import { validatePostInput } from "../middlewares/validatePostInput.js";
import formatPostDate from "../utils/formatPostDate.js";

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

    res.json({ posts: postsWithLikes });
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los posts",
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        authorId: true,
        content: true,
        image: true,
        createdAt: true,
        comments: {
          select: {
            id: true,
            text: true,
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    post.createdAt = formatPostDate(post.createdAt);

    if (!post) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    const author = await prisma.user.findUnique({
      where: { id: post.authorId },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    author.isCurrentUser = author.id === currentUserId;

    const isLikedByUser = await prisma.like.findFirst({
      where: {
        userId: currentUserId,
        postId: post.id,
      },
    });

    const responsePost = {
      ...post,
      author,
      isLiked: !!isLikedByUser,
      comments: post.comments.map((comment) => ({
        ...comment,
        isCurrentUser: comment.user.id === currentUserId,
      })),
    };

    res.json({ post: responsePost });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el post" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content, image } = req.body;

  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        content,
        image,
      },
      include: { author: { select: { username: true } } },
    });

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Error al actualizar la publicación" });
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
