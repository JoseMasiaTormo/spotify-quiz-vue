const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(400).json({ message: "Ese email ya está registrado" });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const result = db
    .prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)")
    .run(username, email, hashed);

  res.json({ message: "Usuario creado", userId: result.lastInsertRowid });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return res.status(401).json({ message: "Email o contraseña incorrectos" });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Email o contraseña incorrectos" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
});

module.exports = router;
