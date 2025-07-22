import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { postId } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "No autorizado" });

  try {
    const like = await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    res.status(201).json({ like, message: "Like agregado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo dar like" });
  }
});

router.delete("/", async (req, res) => {
  const { postId } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "No autorizado" });

  try {
    const deletedLike = await prisma.like.deleteMany({
      where: {
        postId,
        userId,
      },
    });

    res.status(200).json({ deletedLike, message: "Like eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo eliminar el like" });
  }
});

export default router;
