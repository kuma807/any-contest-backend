const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    minlength: 1
  },
  time: String,
  state: String,
  answer: String
})

module.exports = mongoose.model('submission', submissionSchema);