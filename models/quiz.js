const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  voteTime: {
    type: Number,
    required: true
  },
  result: {
    type: Object,
    required: false
  }
});

module.exports = mongoose.model('quiz', quizSchema);
