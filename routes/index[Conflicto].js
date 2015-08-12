var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz'});
});


/* Quiz: quizes */
router.get('/quizes', quizController.index);

/* Quiz: preguntas con el id de la key de la tabla */
router.get('/quizes/:quizId(\\d+)', quizController.show);

/* Quiz: respuestas con el id de la key de la tabla y el controlador answer */
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);


module.exports = router;
