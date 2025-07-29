import express from "express";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
const upload = multer({ storage });

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.path;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ error: "Error al subir imagen" });
  }
});

export default router;
