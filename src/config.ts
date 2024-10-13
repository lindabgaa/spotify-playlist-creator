const SPOTIFY_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  AUTH_ENDPOINT: "https://accounts.spotify.com/authorize",
  REDIRECT_URI: "http://localhost:5173/",
  SCOPES: "playlist-modify-private playlist-modify-public",
  RESPONSE_TYPE: "token",
};

export const LOGIN_URL = `${SPOTIFY_CONFIG.AUTH_ENDPOINT}?client_id=${
  SPOTIFY_CONFIG.CLIENT_ID
}&redirect_uri=${SPOTIFY_CONFIG.REDIRECT_URI}&scope=${encodeURIComponent(
  SPOTIFY_CONFIG.SCOPES
)}&response_type=${SPOTIFY_CONFIG.RESPONSE_TYPE}`;
