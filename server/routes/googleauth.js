// routes/googleauth.js
const router = require("express").Router();
const passport = require("passport");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const fetch = require("node-fetch");

router.post("/auth/google", (req, res) => {
  const { code } = req.body;
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uri = process.env.CLIENT_URL;
  const grant_type = "authorization_code";
  fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri,
      grant_type,
    }),
  })
    .then((response) => response.json())
    .then((tokens) => {
      // Send the tokens back to the frontend, or store them securely and create a session
      res.json(tokens);
    })
    .catch((error) => {
      // Handle errors in the token exchange
      console.error("Token exchange error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;
