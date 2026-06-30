const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const history = db.prepare("SELECT * FROM history WHERE userId = ? ORDER BY createdAt DESC LIMIT 30").all(req.userId);
  res.json(history);
});

router.delete("/:id", auth, (req, res) => {
  db.prepare("DELETE FROM history WHERE id = ? AND userId = ?").run(req.params.id, req.userId);
  res.json({ message: "Entrada eliminada" });
});

module.exports = router;
