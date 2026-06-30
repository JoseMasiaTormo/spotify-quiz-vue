const axios = require("axios");

let cachedToken = null;
let expiresAt = 0;

async function getSpotifyToken() {
  if (cachedToken && Date.now() < expiresAt) {
    return cachedToken;
  }

  const res = await axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
    },
  });

  cachedToken = res.data.access_token;
  expiresAt = Date.now() + (res.data.expires_in - 60) * 1000;
  return cachedToken;
}

module.exports = getSpotifyToken;
