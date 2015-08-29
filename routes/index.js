var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');
var statisticController = require('../controllers/statistic_controller');


// P�gina de entrada (home page)
router.get('/', function(req, res) {
  res.render('index', { title: "Quiz", errors: []});
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load); // autoload :quizID
router.param('commentId', commentController.load); // autoload :commentID

// Definici�n de rutas de sesion
router.get('/login',  sessionController.new);     // formulario login
router.post('/login', sessionController.create);  // crear sesi�n
router.get('/logout', sessionController.destroy); // destruir sesi�n


// Crear un usuario
router.get('/register',  userController.new);  // formulario registro
router.post('/crear_usuario',  userController.create);  // grabar en base de datos

// Definicion de rutas de estadisticas
router.get('/quizes/statistics', statisticController.index);

// Definici�n de rutas de /quizes
router.get('/quizes',      		              quizController.index);
router.get('/quizes/:quizId(\\d+)',            quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',   quizController.answer);
// ya no tiene sentido el buscar preguntas, lo comento
//router.get('/quizes',                       quizController.search);
router.get('/quizes/new',	sessionController.loginRequired, quizController.new);
router.post('/quizes/create',	sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',	sessionController.loginRequired,   quizController.edit);
router.put('/quizes/:quizId(\\d+)',	sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',	sessionController.loginRequired, quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new',      commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',      commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',      sessionController.loginRequired, commentController.publish);



module.exports = router;
