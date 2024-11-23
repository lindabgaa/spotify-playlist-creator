const axios = require("axios");
const querystring = require("querystring");
const CONFIG = require("./../config");

// ----  /auth/check : check if user is authenticated
const checkAuth = (req, res) => {
  if (req.cookies.access_token && req.cookies.refresh_token) {
    return res.status(200).json({
      authenticated: true,
      message: "User is authenticated",
    });
  }

  return res.status(401).json({
    authenticated: false,
    message: "User is not authenticated",
  });
};

// ----  /auth/login : redirects to Spotify Login Page
const redirectToSpotifyAuthPage = (req, res) => {
  const scopes = Object.values(CONFIG.SPOTIFY.SCOPES).flat().join(" ");

  const authUrl = `${CONFIG.SPOTIFY.AUTH_URL}?${querystring.stringify({
    response_type: "code",
    client_id: CONFIG.SPOTIFY.CLIENT_ID,
    scope: scopes,
    redirect_uri: CONFIG.SPOTIFY.REDIRECT_URI,
  })}`;

  console.log("Redirecting to Spotify Auth Page...");

  res.redirect(authUrl);
};

// ---- /auth/callback : retrieves access token from Spotify and redirects to client
const exchangeCodeForTokens = async (req, res) => {
  const { code } = req.query;

  try {
    console.log("Exchanging code for token...");

    const response = await axios.post(
      `${CONFIG.SPOTIFY.TOKEN_URL}`,
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: CONFIG.SPOTIFY.REDIRECT_URI,
        client_id: CONFIG.SPOTIFY.CLIENT_ID,
        client_secret: CONFIG.SPOTIFY.CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${CONFIG.SPOTIFY.CLIENT_ID}:${CONFIG.SPOTIFY.CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    if (!access_token || !refresh_token) {
      throw new Error("Access token or refresh token missing");
    }

    console.log("Authentication successful! Redirecting to client..");

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: CONFIG.ENV === "production" ? true : false,
      sameSite: "strict",
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: CONFIG.ENV === "production" ? true : false,
      sameSite: "strict",
    });

    res.redirect(`${CONFIG.CLIENT_REDIRECT_URI}`);
  } catch (error) {
    console.error("Authentication to Spotify failed!");

    if (error.response) {
      const { status, data } = error.response;

      console.error(
        `Response from Spotify: 
        Status: ${status}
        Error Type: ${data.error || "Unknown error type"}
        Error Description: ${data.error_description || "No error description provided."}
      `
      );
      return res.status(error.response.status).json({
        error: {
          status: status,
          message: "Spotify Authentication failed",
          type: data.error || "Unknown error type",
          detail: data.error_description || "No error description provided.",
        },
      });
    }

    if (error.request) {
      console.error("Network or API error:", error.request);
      return res.status(503).json({
        error: {
          status: 503,
          message: "Spotify Authentication failed",
          detail: "Network error or issue connecting to Spotify API. Please try again later.",
        },
      });
    }

    console.error(`Internal server error: ${error.stack || error}`);
    return res.status(500).json({
      error: {
        status: 500,
        message: "Spotify Authentication failed",
        detail: error.message || "An unexpected error occurred.",
      },
    });
  }
};

module.exports = { checkAuth, redirectToSpotifyAuthPage, exchangeCodeForTokens };
