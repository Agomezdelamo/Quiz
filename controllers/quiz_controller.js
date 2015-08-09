var models = require('../models/models.js');

// GET  /quizes/question
exports.question = function(req, res) {
	models.Quiz.findAll().success(function(quizParam){
		res.render('quizes/question', {pregunta: quizParam[0].pregunta});
	})
};


// GET  /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.findAll().success(function(quizParam){
		if(req.query.respuesta === quizParam[0].respuesta) {
			res.render('quizes/answer', { respuesta: 'Respuesta Correcta' });
		}
		else {
			res.render('quizes/answer', { respuesta: 'Respuesta Incorrecta'});
		}
	})
};


