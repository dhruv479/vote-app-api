var express = require('express');
var router = express.Router();
var quizController = require('./../controllers/quizController');

router.post('/quiz/:quizId/votes', quizController.addVotes);

router.get('/quiz/:quizId/result', quizController.getVotes);

router.post('/quiz', quizController.addQuiz);

module.exports = router;
