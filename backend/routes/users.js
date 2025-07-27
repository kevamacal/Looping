import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const myUserId = req.user.id;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: myUserId,
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        posts: {
          select: {
            id: true,
            content: true,
            image: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: Number(id),
        },
      },
    });
    res.json({ user, isFollowing: !!isFollowing });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
});

router.put("/myProfile", async (req, res) => {
  const { avatar } = req.body;
  const currentUserId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const updateUser = await prisma.user.update({
      where: { id: currentUserId },
      data: { avatar },
    });

    res.json({ user: updateUser });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
});

export default router;
