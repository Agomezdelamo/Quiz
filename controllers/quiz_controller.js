var models = require('../models/models.js');

// GET  /quizes/index
exports.index = function(req, res) {
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index', {quizes: quizes});
	})
};

// GET  /quizes/question
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: quiz});
	})
};


// GET  /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if(req.query.respuesta === quiz.respuesta) {
			res.render('quizes/answer', { quiz: quiz , respuesta: 'Respuesta Correcta' });
		}
		else {
			res.render('quizes/answer', { quiz: quizORMtoParam, respuesta: 'Respuesta Incorrecta'});
		}
	})
};


