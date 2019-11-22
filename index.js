require("dotenv").config(); //pour que le .env soit pris en compte
const express = require("express");
// const bodyParser = require("body-parser"); // we use formidable
const mongoose = require("mongoose");
const formidable = require("express-formidable");
const cors = require("cors");

//Server Creation
const app = express();
app.use(formidable());
app.use(cors());

// DataBase Definition and Models import
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = require("./models/User");
const Offer = require("./models/Offer");

// # # # # # # # # # # # #  Root Route # # # # # # # # # # # #
app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

// # # # # # # # # # # # # All Routes Import # # # # # # # # # # # #
const userRoutes = require("./routes/userRoutes");
app.use(userRoutes);
const offerRoutes = require("./routes/offerRoutes");
app.use(offerRoutes);

//Start Server on 4000
app.listen(process.env.PORT, () => {
  console.log("server started port", process.env.PORT);
});
