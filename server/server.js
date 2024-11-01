require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : [],
};

(() => {
  const missingEnv = [];

  if (!process.env.SPOTIFY_CLIENT_ID) missingEnv.push("SPOTIFY_CLIENT_ID");
  if (!process.env.SPOTIFY_CLIENT_SECRET) missingEnv.push("SPOTIFY_CLIENT_SECRET");
  if (!process.env.SPOTIFY_REDIRECT_URI) missingEnv.push("SPOTIFY_REDIRECT_URI");

  if (missingEnv.length > 0) {
    console.error(
      "Missing required environment variables: ",
      missingVars.join(", "),
      "\nPlease refer to the README.md file for instructions on setting up the project."
    );
    process.exit(1);
  }

  console.log("All set!");
})();

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
