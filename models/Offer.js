const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  title: { type: String, requiered: true },
  description: { type: String, requiered: true },
  price: { type: String, requiered: true },
  created: { type: String },
  pictures: { type: String },
  creator: { type: Object }
});

module.exports = Offer;
