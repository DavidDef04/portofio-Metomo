// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Utilisateur hardcodé
const USER = {
  username: "admin",
  password: "password123", // ⚠️ Ne jamais utiliser en clair en prod
};

// Route de test pour vérifier que le backend tourne
app.get("/", (req, res) => {
  res.send("✅ Backend running !");
});

// Route POST pour la connexion
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    res.status(200).json({ success: true, message: "Connexion réussie" });
  } else {
    res.status(401).json({ success: false, message: "Identifiants incorrects" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
