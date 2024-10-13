// tools
import { useCallback, useEffect, useState } from "react";

// utils
import { LOGIN_URL } from "../../config";
import getSpotifyAccessToken from "../../getSpotifyAccessToken";
// assets
import exitIcon from "./../../assets/exit-icon.svg";
import spotifyIcon from "./../../assets/spotify-icon.svg";

// styles
import styles from "./SpotifyAuth.module.css";

type Props = {
  setToken: (token: string | null) => void;
  isLogin: boolean;
  setIsLogin: (loginStatus: boolean) => void;
};

const SpotifyAuth: React.FC<Props> = ({ setToken, isLogin, setIsLogin }) => {
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  // ---- Function to handle Login Button Click
  const handleLoginButtonClick = useCallback(() => {
    window.location.href = LOGIN_URL;
  }, []);

  // ---- Function to handle Logout Button Click
  const handleLogOutButtonClick = useCallback(() => {
    setToken(null);
    setIsLogin(false);
    setFeedbackMessage("");

    window.sessionStorage.removeItem("tokenInfo");
  }, [setIsLogin, setToken]);

  useEffect(() => {
    // ---- Check if the user tried to login with Spotify by searching for the "access_token" parameter in the URL hash
    // ---- -> We can't extract the token from the URL hash if the user didn't try to login with Spotify
    const params = new URLSearchParams(window.location.hash.substring(1));
    const hasTriedToLogin = params.get("access_token") ? true : false;

    if (!hasTriedToLogin) {
      return;
    }

    // ---- Extract the access token from the URL hash
    const token = getSpotifyAccessToken();

    // ---- If the access token is valid : set the token and login status and show a success message
    if (token) {
      setToken(token);
      setIsLogin(true);
      setFeedbackMessage(
        "🎉 Spotify powers activated! Time to become the DJ of your dreams. Search, discover, and curate your perfect playlist!"
      );
    } else {
      // ---- If the access token is not valid : set the login status to false and show an error message
      setIsLogin(false);
      setFeedbackMessage(
        "An error occurred while connecting to Spotify. Please try again."
      );
    }

    window.history.replaceState(null, "", window.location.pathname);
  }, [setIsLogin, setToken]);

  return (
    <div className={styles.container}>
      {!isLogin ? (
        <button
          type="button"
          className={styles.loginButton}
          aria-label="Login to Spotify Button"
          onClick={handleLoginButtonClick}
        >
          <img
            src={spotifyIcon}
            alt=""
            className={styles.spotifyIcon}
            aria-hidden="true"
          ></img>
          Login to Spotify
        </button>
      ) : (
        <button
          type="button"
          className={styles.logoutButton}
          aria-label="Logout from Spotify Button"
          onClick={handleLogOutButtonClick}
        >
          <img
            src={exitIcon}
            alt=""
            className={styles.exitIcon}
            aria-hidden="true"
          ></img>
          Log Out
        </button>
      )}
      <p className={styles.feedbackMessage}>{feedbackMessage}</p>
    </div>
  );
};

export default SpotifyAuth;
