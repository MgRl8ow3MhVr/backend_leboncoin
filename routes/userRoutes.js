//Router Creation
const express = require("express");
const router = express.Router();
//Export du module
module.exports = router;

// encryption packages
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//Models Import
const User = require("../models/User");

// # # # # # # # # # # # # Display All Users # # # # # # # # #
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    console.error(e.message); // error affiches en rouge - console.warn en jaune
    res.status(400).json({ message: "an error occured" });
  }
});

// # # # # # # # # # # # # Create One User # # # # # # # # #
router.post("/user/signup", async (req, res) => {
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
router.post("/login", async (req, res) => {
  try {
    console.log("login attempt");
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
