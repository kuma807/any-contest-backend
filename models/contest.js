const mongoose = require('mongoose');

const user = new mongoose.Schema({ name: String, id: String, point: Number, solved: [String], submissionTime: String});

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    unique: true
  },
  field: {
    type: String,
    required: true,
    minlength: 1,
  },
  ranking: [user],
  description: String,
  minRating: Number,
  maxRating: Number,
  maxperformance: Number,
  problemNames: [String],
  startTime: String,
  endTime: String,
  writers: [String],
  penalty: Number,
})

module.exports = mongoose.model('Contest', contestSchema);