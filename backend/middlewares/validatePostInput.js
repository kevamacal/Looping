export const validatePostInput = (req, res, next) => {
  const { content } = req.body || {};
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: "El contenido es requerido" });
  }
  next();
};
