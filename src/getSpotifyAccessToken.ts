interface TokenInfo {
  token: string;
  expirationTime: number;
}

// ---- Function to get access token from Spotify when logging in
export default function getSpotifyAccessToken(): string | null {
  try {
    // Check if token info are already stored in localStorage
    const tokenInfoString = window.sessionStorage.getItem("tokenInfo");
    const tokenInfo: TokenInfo | null = tokenInfoString
      ? JSON.parse(tokenInfoString)
      : null;

    if (tokenInfo && tokenInfo.token && tokenInfo.expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime < tokenInfo.expirationTime) {
        return tokenInfo.token;
      } else {
        // Token expired, remove it
        window.sessionStorage.removeItem("tokenInfo");
      }
    }

    //  If token info doesn't exist in localStorage, we will extract them from the URL hash

    // Extract the hash from the URL
    const hash = window.location.hash;
    if (!hash) {
      throw new Error(
        "No hash found in URL. User may not have completed the Spotify authorization process."
      );
    }

    // Extract the access token and expiration time from the hash
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const expiresIn = params.get("expires_in");

    if (!accessToken) {
      throw new Error(
        "Access token not found in URL hash. Spotify authorization may have failed."
      );
    }

    if (!expiresIn) {
      throw new Error(
        "Expiration time not found in URL hash. Spotify authorization response may be incomplete."
      );
    }

    // Calculate the token expiration time (in milliseconds)
    const expirationTime =
      new Date().getTime() + parseInt(expiresIn, 10) * 1000;

    // Store the token and expiration time in localStorage
    window.sessionStorage.setItem(
      "tokenInfo",
      JSON.stringify({
        token: accessToken,
        expirationTime,
      })
    );

    return accessToken;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    return null;
  }
}
