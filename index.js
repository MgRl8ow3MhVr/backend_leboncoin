require("dotenv").config(); //pour que le .env soit pris en compte
const express = require("express");
// const bodyParser = require("body-parser"); // we use formidable
const mongoose = require("mongoose");
const formidable = require("express-formidable");
const cors = require("cors");

// encryption packages
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//Server Creation
const app = express();
// app.use(bodyParser.json());
app.use(formidable());
app.use(cors());

// DataBase Definition
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = mongoose.model("User", {
  email: { type: String, unique: true, requiered: true },
  token: String,
  salt: String,
  hash: String,
  account: Object
});
const Offer = mongoose.model("Offer", {
  title: { type: String, requiered: true },
  description: { type: String, requiered: true },
  price: { type: String, requiered: true }
});

// # # # # # # # # # # # # Route Root # # # # # # # # # # # #
app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

// # # # # # # # # # # # # Display All Users # # # # # # # # #
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    console.error(e.message); // error affiches en rouge - console.warn en jaune
    res.status(400).json({ message: "an error occured" });
  }
});

// # # # # # # # # # # # # Create One User # # # # # # # # #
app.post("/user/signup", async (req, res) => {
  try {
    const token = uid2(64);
    const salt = uid2(64);
    const hash = SHA256(req.fields.password + salt).toString(encBase64);

    const newUser = new User({
      email: req.fields.email,
      token: token,
      salt: salt,
      hash: hash,
      account: {
        username: req.fields.username,
        phone: req.fields.phone
      }
    });
    await newUser.save();
    res.json({
      _id: newUser.id,
      token: newUser.token,
      account: newUser.account
    });
    console.log(`user ${req.fields.email} created`);
  } catch (e) {
    console.error(e.message); // error affiches en rouge - console.warn en jaune
    if (e.code === 11000) {
      res.status(400).json({ message: "Cet email est déjà pris" });
    } else {
      res.status(400).json({ message: "an error occured" });
    }
  }
});

// # # # # # # # # # # # # LOGIN ATTEMPT # # # # # # # # #
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    //if user not found
    if (!user) {
      res.status(400).json({ message: "Email Not Found" });
      return;
    }
    //if password incorrect
    if (
      SHA256(req.fields.password + user.salt).toString(encBase64) !== user.hash
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    //else all good
    console.log("authentification successful");
    res.json({
      _id: user._id,
      token: user.token,
      account: user.account
    });
  } catch (e) {
    console.error(e.message);
    res
      .status(400)
      .json({ message: "An error Occured. That's all I can say." });
  }
});

// # # # # # # # # # # # # UPLOAD PRODUCT # # # # # # # # #

// MiddleWare function to check

// const authenticate = async (req, res, next) => {
//   const auth = req.headers.authorization;
//   if (!auth) {
//     res.status(401).json({
//       error: 'Missing Authorization Header',
//     });
//     return;
//   }
//   const parts = req.headers.authorization.split(' ');
//   if (parts.length !== 2 || parts[0] !== 'Bearer') {
//     res.status(401).json({
//       error: 'Invalid Authorization Header',
//     });
//     return;
//   }
//   const token = parts[1];
//   const user = await User.findOne({ token });
//   if (!user) {
//     res.status(401).json({
//       error: 'Invalid Token',
//     });
//     return;
//   }
//   // le token est valide, on appelle next() pour exécuter le code de la route
//   return next();
// };

app.post("/publish", async (req, res) => {
  try {
    console.log("upload attempt");
    const { title, description, price } = req.fields;
    console.log(title, description, price);
  } catch (e) {
    console.error(e.message); //
    res.status(400).json({ message: "an error occured" });
  }
});

//Demarrer le serveur ici 4000
app.listen(process.env.PORT, () => {
  console.log("server started port", process.env.PORT);
});
