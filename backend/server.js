require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connexion à la base de données
connectDB();


app.use(express.json());

app.get("/", (req, res) => {
  res.send("API du blog collaboratif fonctionne !");
}
);
app.listen(process.env.PORT, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT}`);
}
);