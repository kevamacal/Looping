import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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
