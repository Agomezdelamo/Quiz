var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* Quiz: question */
router.get('/quizes/question', quizController.question );

/* Quiz: answer */
router.get('/quizes/answer', quizController.answer );


module.exports = router;
