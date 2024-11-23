require("dotenv").config();
require("colors");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const CONFIG = require("./config");

// ---- Routes
const authRoutes = require("./routes/authRoutes");

const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : [],
  credentials: true,
};

console.log(`> ${CONFIG.ENV} mode`.yellow);

// ---- Check for required environment variables
(() => {
  const requiredEnv = {
    spotify: ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"],
    server: ["DEVELOPMENT_SERVER_URL", "PRODUCTION_SERVER_URL", "TEST_SERVER_URL"],
    client: ["DEVELOPMENT_CLIENT_URL", "PRODUCTION_CLIENT_URL", "TEST_CLIENT_URL"],
  };

  const missingEnv = Object.entries(requiredEnv).flatMap(([category, vars]) =>
    vars
      .filter((envVar) => !process.env[envVar])
      .map((envVar) => `${category.toUpperCase().grey}: ${envVar.magenta}`)
  );

  if (missingEnv.length > 0) {
    console.error(
      "Missing required environment variables: \n",
      missingEnv.join("\n "),
      "\nPlease refer to the README.md file for instructions on setting up the project.".red
    );
    process.exit(1);
  }
})();

// ---- Middlewares
app.use(cors(corsOptions));
app.use(cookieParser()); // !!! //
app.use(express.json());
app.use("/api/auth", authRoutes);

// ---- Welcome route
app.get("/", (req, res) => {
  res.send("Hello from Server!");
});

// ---- Run server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
