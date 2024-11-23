const express = require("express");
const {
  redirectToSpotifyAuthPage,
  exchangeCodeForTokens,
  checkAuth,
} = require("../controllers/authController");

const router = express.Router();

router.get("/check", checkAuth);
router.get("/login", redirectToSpotifyAuthPage);
router.get("/callback", exchangeCodeForTokens);

module.exports = router;
