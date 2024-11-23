import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import AuthScreen from "./components/AuthScreen/AuthScreen";
import CONFIG from "./config.ts";

interface AuthCheckResponse {
  authenticated: boolean;
}

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkUserAuth = async () => {
    try {
      setIsLoading(true);

      const url = `${CONFIG.SERVER_URL}/api/auth/check`;
      const response = await axios.get<AuthCheckResponse>(url, { withCredentials: true });

      setIsAuth(response.data.authenticated);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error from server:", error.response.status, error.response.data);
        } else if (error.request) {
          console.error("No response from server:", error.request);
        } else {
          console.error("Axios Unknow Error:", error.message);
        }
      } else {
        console.error("Unknow Error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  return <main>{!isAuth ? <AuthScreen /> : <p>Welcome!</p>}</main>;
}

export default App;
