const ENV = process.env.NODE_ENV || "development";
const validEnvironments = ["development", "production", "test"];
const isValidEnv = validEnvironments.includes(ENV);
const finalEnv = isValidEnv ? ENV : "development";

const CONFIG = {
  ENV: finalEnv,
  APP: {
    NAME: "My Spotify App",
    VERSION: "1.0.0",
  },
  SERVER: {
    DEV_URL: process.env.DEVELOPMENT_SERVER_URL,
    TEST_URL: process.env.TEST_SERVER_URL,
    PROD_URL: process.env.PRODUCTION_SERVER_URL,
  },
  CLIENT: {
    DEV_URL: process.env.DEVELOPMENT_CLIENT_URL,
    TEST_URL: process.env.TEST_CLIENT_URL,
    PROD_URL: process.env.PRODUCTION_CLIENT_URL,
  },
  SPOTIFY: {
    CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    REDIRECT_URI: `${process.env[`${finalEnv.toUpperCase()}_SERVER_URL`]}/api/auth/callback`,
    API_BASE_URL: "https://api.spotify.com/v1",
    AUTH_URL: "https://accounts.spotify.com/authorize",
    TOKEN_URL: "https://accounts.spotify.com/api/token",
    SCOPES: {
      basic: ["user-read-private", "user-read-email"],
      playlist: ["playlist-modify-public", "playlist-modify-private"],
      // streaming: ["streaming", "user-read-playback-state"],
    },
  },
  CLIENT_REDIRECT_URI: `${process.env[`${finalEnv.toUpperCase()}_CLIENT_URL`]}`,
};

module.exports = CONFIG;
