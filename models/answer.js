const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
  },
  answer: String
})

module.exports = mongoose.model('answer', answerSchema);