const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const favorites = db.prepare("SELECT * FROM favorites WHERE userId = ? ORDER BY createdAt DESC").all(req.user.id);
  res.json(favorites);
});

router.post("/", auth, async (req, res) => {
  const { artistId, artistName, artistImage } = req.body;

  const existing = db.prepare("SELECT id FROM favorites WHERE userId = ? AND artistId = ?").get(req.user.id, artistId);

  if (existing) {
    return res.status(400).json({ error: "El artista estaba ya en favoritos" });
  }

  db.prepare("INSERT INTO favorites (userId, artistId, artistName, artistImage) VALUES (?, ?, ?, ?)").run(
    req.user.id,
    artistId,
    artistName,
    artistImage,
  );

  res.json({ message: "Añadido a favoritos" });
});

router.delete("/", auth, (req, res) => {
  const { artistId } = req.body;
  db.prepare("DELETE FROM favorites WHERE userId = ? AND artistId = ?").run(req.userId, artistId);
  res.json({ message: "Eliminado de favoritos" });
});

module.exports = router;
