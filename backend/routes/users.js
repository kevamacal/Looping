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

router.post("/:id/follow", async (req, res) => {
  const { id } = req.params;
  const { email } = req.user;

  try {
    const follower = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!follower) {
      return res
        .status(404)
        .json({ error: "Usuario autenticado no encontrado" });
    }

    const followingId = Number(id);

    if (follower.id === followingId) {
      return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
    }

    const alreadyFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: follower.id,
          followingId,
        },
      },
    });

    if (alreadyFollowing) {
      return res
        .status(400)
        .json({ error: "Ya estás siguiendo a este usuario" });
    }

    await prisma.follow.create({
      data: {
        follower: { connect: { id: follower.id } },
        following: { connect: { id: followingId } },
      },
    });

    res.json({ message: "Ahora sigues al usuario" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al seguir al usuario" });
  }
});

router.delete("/:id/follow", async (req, res) => {
  const { id } = req.params;
  const { email } = req.user;

  try {
    const follower = await prisma.user.findUnique({ where: { email } });
    const followingId = Number(id);

    const following = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: follower.id,
          followingId,
        },
      },
    });

    if (!following) {
      return res
        .status(400)
        .json({ error: "No estás siguiendo a este usuario" });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: follower.id,
          followingId,
        },
      },
    });

    res.json({ message: "Ya no sigues al usuario" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al dejar de seguir al usuario" });
  }
});

export default router;
