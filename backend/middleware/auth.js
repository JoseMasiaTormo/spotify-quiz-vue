const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No autorizado" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No autorizado" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (e) {
    res.status(401).json({ message: "Token inválido" });
  }
}

module.exports = authMiddleware;
