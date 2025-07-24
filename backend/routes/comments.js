import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { postId, text } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        text,
        userId: req.user.id,
        postId: Number(postId),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creando comentario:", error);
    res.status(500).json({ error: "Error al crear el comentario" });
  }
});

export default router;
