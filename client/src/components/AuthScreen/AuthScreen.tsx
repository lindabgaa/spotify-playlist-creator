import spotifyIcon from "./../../assets/spotify-icon.svg";

const AuthScreen = () => {
  return (
    <div>
      <p className="introduction-text">
        Find your favorite tracks, build your ideal playlist, and export it directly to Spotify.
      </p>
      <button type="button" className="login-button" aria-label="Login to Spotify Button">
        <img src={spotifyIcon} alt="" className="spotify-icon" aria-hidden="true"></img>
        Login to Spotify
      </button>{" "}
    </div>
  );
};

export default AuthScreen;
