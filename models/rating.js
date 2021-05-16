const mongoose = require('mongoose');

const ratingDatum = new mongoose.Schema({ contestName: String, rating: Number, rd: Number, vol: Number});

const ratingSchema = new mongoose.Schema({
  userid: String,
  fieldName: String,
  ratingData: [ratingDatum]
})

module.exports = mongoose.model('rating', ratingSchema);