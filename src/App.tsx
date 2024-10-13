// tools
import { useState } from "react";

// components
import SpotifyAuth from "./components/SpotifyAuth/SpotifyAuth";

// styles
import styles from "./App.module.css";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  return (
    <main className={styles.mainContainer}>
      <p className={styles.introText}>
        Find your favorite tracks, build your ideal playlist, and export it
        directly to Spotify.
      </p>

      <SpotifyAuth
        setToken={setToken}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
    </main>
  );
}

export default App;
