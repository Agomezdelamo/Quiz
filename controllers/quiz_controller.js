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

// GET  /quizes/index
exports.search = function(req, res, next) {
	var search = req.query.search;
	var sequelizado = "%"+search.replace(" ", "%")+"%";
					console.log("Esta es la pregunta que estoy buscando",sequelizado);
			 
				models.Quiz.findAll({where: ["pregunta like ?", sequelizado], order: ' pregunta ASC'}).then(
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

// GET /quizes/new
exports.new = function(req,res) {
	var quiz = models.Quiz.build(//crea un objeto quiz solo para renderizar vistas, no es persistente, no se queda en base de datos.
	{pregunta: "Pregunta", respuesta: "Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req,res) {
	//ESTE CONTROLADOR genera el objeto quiz con models.Quiz.build
	//incializandolo con los parámetros enviados desde el formulario, 
	//que están accesibles en req.body.quiz.
	var quiz = models.Quiz.build(req.body.quiz);
	//y lo guardo en DB, tanto pregunta como respuesta.
	quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
			res.redirect('/quizes');
	})	//redirección http (url relativo) lista de preguntas PORQUE NO TENGO VISTA ASOCIADA.
};
