import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import formatPostDate from "../utils/formatPostDate.js";

const router = Router();
const prisma = new PrismaClient();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: currentUserId,
            recipientId: Number(id),
          },
          {
            senderId: Number(id),
            recipientId: currentUserId,
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
        recipient: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
      },
    });

    const createdAtFormatted = messages.map((msg) => {
      return formatPostDate(msg.createdAt);
    });

    messages.forEach((msg) => {
      msg.createdAtFormatted = formatPostDate(msg.createdAt);
    });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
});

router.post("/", async (req, res) => {
  const { recipientId, message } = req.body;
  const senderId = req.user.id;

  try {
    await prisma.message.create({
      data: {
        senderId,
        recipientId,
        text: message,
      },
    });

    res.json({ message: "Mensaje enviado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
});

export default router;
