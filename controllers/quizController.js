const Quiz = require('./../models/quiz');
const Vote = require('./../models/voting');

module.exports = {
  addQuiz: (req, res) => {
    const newQuiz = new Quiz(req.body);
    newQuiz
      .save()
      .then(response => {
        return res.json({
          error: false,
          message: 'Quiz Added Successfully',
          data: response
        });
      })
      .catch(error => {
        console.log(error);
        return res
          .status(400)
          .json({ error: true, message: 'Incomplete Request' });
      });
  },
  addVotes: (req, res) => {
    Quiz.findById(req.params.quizId)
      .then(response => {
        let time = Number(new Date());
        if (response.voteTime >= time) {
          req.body.quizId = req.params.quizId;
          let quizVotes = new Vote(req.body);
          return quizVotes.save().then(() => {
            return res.json({
              error: false,
              message: 'Votes Added Successfully'
            });
          });
        } else {
          return res.json({ error: true, message: 'Voting Time Finished!' });
        }
      })
      .catch(error => {
        console.log(error);
        return res.status(500).json({ error: true, message: 'Internal Error' });
      });
  },
  getVotes: (req, res) => {
    Quiz.findById(req.params.quizId).then(response => {
      if (response.result) {
        return res.json({ error: false, data: response.result });
      } else {
        let time = Number(new Date());
        if (time < response.voteTime) {
          return res.json({
            error: false,
            message: 'Result Awaited',
            data: { resultTime: response.voteTime }
          });
        } else {
          Vote.find({ quizId: req.params.quizId }).then(response => {});
        }
      }
    });
  }
};
