//Router Creation
const express = require("express");
const router = express.Router();

require("dotenv").config();
// Cloudinary import
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "pierredev",
  api_key: process.env.COULDINARY_APIKEY,
  api_secret: process.env.COULDINARY_APISECRETKEY
});

//Export du module
module.exports = router;

// encryption packages
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//Models Import
const Offer = require("../models/Offer");
const User = require("../models/User");

// # # # # # # # # # # # # UPLOAD PRODUCT # # # # # # # # #

// MiddleWare function to check

const authenticate = async (req, res, next) => {
  console.log("starting user authentification for pulblishing");
  const auth = req.headers.authorization;
  console.log(req.headers.authorization);

  if (!auth) {
    res.status(401).json({
      error: "Missing Authorization Header"
    });
    return;
  }
  const parts = req.headers.authorization.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({
      error: "Invalid Authorization Header"
    });
    return;
  }
  const token = parts[1];
  const user = await User.findOne({ token });
  if (!user) {
    res.status(401).json({
      error: "Invalid Token"
    });
    return;
  }
  // le token est valide, on appelle next() pour exécuter le code de la route
  console.log("user authent successfull for publishing");
  return next();
};

router.post("/publish", authenticate, async (req, res) => {
  try {
    console.log("publishing attempt");

    // Get fields
    const { title, description, price } = req.fields;

    // Get user infos
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({ token });

    //Get Photo Files
    const fileKeys = Object.keys(req.files);
    if (fileKeys.length === 0) {
      console.log("no photos");
      // res.json({ message: "NO PHOTO" });
      // return;
    }
    fileKeys.forEach(fileKey => {
      const file = req.files[fileKey];
      console.log("photo", fileKey, file.name);
      cloudinary.v2.uploader.upload(file.path, (error, result) => {
        if (error) {
          return res.json({ error: `Upload Error` });
        } else {
          console.log(result);
          console.log(result.secure_url);
          return res.json(result);
        }
      });
    });

    //Build a new Offer object and save it into db
    const offer = new Offer({
      title: title,
      description: description,
      price: price,
      created: "MAINTENANT !",
      creator: { account: user.account, _id: user._id }
    });
    await offer.save();
    console.log("publishing successful");
    res.json({ offer });
  } catch (e) {
    console.error(e.message); //
    res.status(400).json({ message: "an error occured" });
  }
});
