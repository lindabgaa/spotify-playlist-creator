const querystring = require("querystring");
const axios = require("axios");

const env = process.env.NODE_ENV || "development";

const SPOTIFY_REDIRECT_URI = `${
  env === "production" ? process.env.PROD_SERVER_URL : process.env.DEV_SERVER_URL
}/api/auth/callback`;

const CLIENT_REDIRECT_URI = env === "production" ? process.env.PROD_CLIENT_URL : process.env.DEV_CLIENT_URL;

// ----  /auth/login : redirects to Spotify Login Page
const login = async (req, res) => {
  const scopes = process.env.SPOTIFY_SCOPES.split(",")
    .map((scope) => scope.trim())
    .join(" ");

  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scopes,
    redirect_uri: SPOTIFY_REDIRECT_URI,
  })}`;

  console.log("Redirecting to Spotify login page..");
  res.redirect(authUrl);
};

// ---- /auth/callback : retrieves access token from Spotify and redirects to client
const callback = async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    const accessToken = response.data.access_token;

    if (!accessToken) {
      throw new Error("Access token not found");
    }

    console.log("Authentication successful! Redirecting to client..");

    res.cookie("access_token", accessToken, {
      httpOnly: true, // prevent XSS attacks and more
      secure: env === "production" ? true : false, // only send cookie over HTTPS in production
      sameSite: "strict", // prevent CSRF attacks and more
    });

    res.redirect(CLIENT_REDIRECT_URI);
  } catch (error) {
    console.error(`Authentication failed: ${error.message}`);

    if (error.response) {
      return res.status(error.response.status).send({
        error: {
          status: error.response.status,
          message: "Spotify Authentication failed",
          detail: error.response.data.error_description,
        },
      });
    } else
      return res.status(500).send({
        error: {
          status: 500,
          message: "Spotify Authentication failed",
          detail: "Internal server error",
        },
      });
  }
};

module.exports = { login, callback };
