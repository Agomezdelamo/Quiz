var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
/*vamos, que si la peticion incluye una variable en la url :quizId lo pasa al objeto request como parametro para que guarde el objeto en una propiedad */
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(function(quiz){
		if(quiz) {
			console.log("esto es lo que se graba en el request",quiz);
			req.quiz = quiz;
			next();
		}
		else {
			next(new Error('no existe quizId' + quizId));
		}
	}).catch(function(error) {next(error);});
};

// GET  /quizes/index
exports.index = function(req, res) {
	models.Quiz.findAll().then(
	function(quizes){
		res.render('quizes/index', {quizes: quizes});
	}).catch(function(error) {next(error);})
};

// GET  /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});
};


// GET  /quizes/answer
exports.answer = function(req, res) {
		var resultado = "Incorrecto";
		if(req.query.respuesta === req.quiz.respuesta) {
			resultado = "correcto";
		}
		res.render('quizes/answer', { quiz: req.quiz , respuesta: resultado });
};


