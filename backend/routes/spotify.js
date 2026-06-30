const express = require("express");
const axios = require("axios");
const db = require("../db");
const auth = require("../middleware/auth");
const getSpotifyToken = require("../spotifyAuth");

const router = express.Router();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutos

function getCache(key) {
  const row = db.prepare("SELECT * FROM cache WHERE cacheKey = ?").get(key);
  if (!row) return null;
  if (Date.now() - row.createdAt > CACHE_TTL) return null;
  return JSON.parse(row.data);
}

function setCache(key, data) {
  db.prepare(
    `
        INSERT INTO cache (cacheKey, data, createdAt) VALUES (?, ?, ?)
        ON CONFLICT(cacheKey) DO UPDATE SET data = excluded.data, createdAt = excluded.createdAt
    `,
  ).run(key, JSON.stringify(data), Date.now());
}

router.get("/search", auth, async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ message: "Falta el parámetro q" });

  const cacheKey = `search:${q.toLowerCase()}`;
  const cached = getCache(cacheKey);

  // guardamos en historial siempre, aunque venga de caché
  db.prepare("INSERT INTO history (userId, query) VALUES (?, ?)").run(req.userId, q);

  if (cached) return res.json(cached);

  try {
    const token = await getSpotifyToken();
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: { q, type: "artist", limit: 12 },
    });

    const artists = response.data.artists.items.map((a) => ({
      id: a.id,
      name: a.name,
      followers: a.followers.total.toLocaleString("es-ES"),
      image: a.image[0]?.url || null,
    }));

    const result = { artists };
    setCache(cacheKey, result);
    res.json(result);
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ message: "Error al buscar en Spotify" });
  }
});

router.get("/artist/:id", auth, async (req, res) => {
  const cacheKey = `artist:${req.params.id}`;
  const cached = getCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/artists/${req.params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const artist = {
      id: response.data.id,
      name: response.data.name,
      followers: response.data.followers.total.toLocaleString("es-ES"),
      genres: response.data.genres,
      image: response.data.images[0]?.url || null,
    };

    setCache(cacheKey, artist);
    res.json(artist);
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ message: "Error al obtener el artista" });
  }
});

router.get("/artist/:id/albums", auth, async (req, res) => {
  const cacheKey = `albums:${req.params.id}`;
  const cached = getCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/artists/${req.params.id}/albums`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { include_groups: "album", limit: 12 },
    });

    const albums = response.data.items.map((a) => ({
      id: a.id,
      name: a.name,
      year: a.release_date.split("-")[0],
      image: a.images[0]?.url || null,
    }));

    setCache(cacheKey, albums);
    res.json(albums);
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ message: "Error al obtener álbumes" });
  }
});

module.exports = router;
