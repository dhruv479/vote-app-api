const Quiz = require('./../models/quiz');
const Vote = require('./../models/voting');
const mongoose = require('mongoose');

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
        // if (response.voteTime >= time) {
        req.body.quizId = req.params.quizId;
        let quizVotes = new Vote(req.body);
        return quizVotes.save().then(() => {
          return res.json({
            error: false,
            message: 'Votes Added Successfully'
          });
        });
        // } else {
        //   return res.json({ error: true, message: 'Voting Time Finished!' });
        // }
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
          Vote.find({ quizId: req.params.quizId })
            .select('votes')
            .then(response => {
              let result = [
                { a: 0, b: 0, c: 0, d: 0 },
                { a: 0, b: 0, c: 0, d: 0 },
                { a: 0, b: 0, c: 0, d: 0 },
                { a: 0, b: 0 },
                { a: 0, b: 0 }
              ];
              let totalVotes = 0;
              response.map(voteObject => {
                totalVotes += voteObject.votes.length;
                result = getVotes(result, voteObject.votes);
              });
              percentResult = getPercentage(result, totalVotes);
              return Quiz.findByIdAndUpdate(req.params.quizId, {
                result: percentResult
              }).then(() => {
                return res.json({
                  error: false,
                  data: percentResult
                });
              });
            })
            .catch(error => {
              console.log(error);
              return res
                .status(500)
                .json({ error: true, message: 'Internal Error' });
            });
        }
      }
    });
  }
};

function getVotes(result, votes) {
  votes.map(userVote => {
    for (question in userVote) {
      result[Number(question) - 1][userVote[question]] += 1;
    }
  });
  return result;
}

function getPercentage(result, totalVotes) {
  console.log(result);
  result.map((question, index) => {
    for (option in question) {
      result[index][option] = ((question[option] / totalVotes) * 100).toFixed(
        2
      );
    }
  });
  return result;
}
