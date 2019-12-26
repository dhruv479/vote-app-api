const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  quizId: {
    type: mongoose.Types.ObjectId,
    ref: 'quiz',
    required: true
  },
  votes: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('vote', voteSchema);
