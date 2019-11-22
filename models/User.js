const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: { type: String, unique: true, requiered: true },
  token: String,
  salt: String,
  hash: String,
  account: Object
});

module.exports = User;
