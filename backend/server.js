require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const spotifyRoutes = require("./routes/spotify");
const favoritesRoutes = require("./routes/favorites");
const historyRoutes = require("./routes/history");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/spotify", spotifyRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/history", historyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
