const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  title: { type: String, requiered: true },
  description: { type: String, requiered: true },
  price: { type: String, requiered: true },
  created: { type: Date, default: Date.now },
  pictures: { type: Object },
  creator: { type: Object }
});

module.exports = Offer;
