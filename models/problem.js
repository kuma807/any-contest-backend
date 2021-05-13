const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
  },
  writer: String,
  contest: String,
  problemStatement: String,
  judgeType: String
})

module.exports = mongoose.model('problem', problemSchema);