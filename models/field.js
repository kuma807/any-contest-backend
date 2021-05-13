const mongoose = require('mongoose');

const user = new mongoose.Schema({ name: String, id: String, rank: Number, rating: Number});

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  ranking: [user],
  description: String
})

module.exports = mongoose.model('Field', fieldSchema);