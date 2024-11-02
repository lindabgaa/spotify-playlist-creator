require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ---- Routes
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : [],
};

// ---- Check for required environment variables
(() => {
  const missingEnv = [];

  if (!process.env.SPOTIFY_CLIENT_ID) missingEnv.push("SPOTIFY_CLIENT_ID");
  if (!process.env.SPOTIFY_CLIENT_SECRET) missingEnv.push("SPOTIFY_CLIENT_SECRET");
  if (!process.env.SPOTIFY_SCOPES) missingEnv.push("SPOTIFY_SCOPES");
  if (!process.env.DEV_SERVER_URL) missingEnv.push("DEV_SERVER_URL");
  if (!process.env.PROD_SERVER_URL) missingEnv.push("PROD_SERVER_URL");
  if (!process.env.DEV_CLIENT_URL) missingEnv.push("DEV_CLIENT_URL");
  if (!process.env.PROD_CLIENT_URL) missingEnv.push("PROD_CLIENT_URL");

  if (missingEnv.length > 0) {
    console.error(
      "Missing required environment variables: ",
      missingEnv.join(", "),
      "\nPlease refer to the README.md file for instructions on setting up the project."
    );
    process.exit(1);
  }

  console.log("All set!");
})();

// ---- Middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);

// ---- Welcome route
app.get("/", (req, res) => {
  res.send("Hello from Server!");
});

// ---- Run server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
