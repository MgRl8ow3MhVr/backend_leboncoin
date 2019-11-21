const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//creer le serveur
const app = express();

//Creer des routes

app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

//Demarrer le serveur ici 4000

app.listen(4000, () => {
  console.log("server started");
});
