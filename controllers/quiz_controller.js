var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
/*vamos, que si la peticion incluye una variable en la url :quizId lo pasa al objeto request como parametro para que guarde el objeto en una propiedad */
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(function(quiz){
		if(quiz) {
			//autoload realiza la búsqueda en la tabla antes de invocar el controlador, dejando el objeto en req.quiz
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
			res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error) {next(error);})
};

// GET  /quizes/
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
		res.render('quizes/answer', { quiz: req.quiz , respuesta: resultado, errors: [] });
};

// GET /quizes/new
exports.new = function(req,res) {
	var quiz = models.Quiz.build(//crea un objeto quiz solo para renderizar vistas, no es persistente, no se queda en base de datos.
	{pregunta: "Pregunta", respuesta: "Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req,res) {
	//ESTE CONTROLADOR genera el objeto quiz con models.Quiz.build
	//incializandolo con los parámetros enviados desde el formulario, 
	//que están accesibles en req.body.quiz.
	var quiz = models.Quiz.build(req.body.quiz);
	//y lo guardo en DB, tanto pregunta como respuesta.
	quiz.validate().then(function(err){
		if(err){
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		}
		else{
			quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
			res.redirect('/quizes');
			//redirección http (url relativo) lista de preguntas PORQUE NO TENGO VISTA ASOCIADA.
			})
		}
	})	
};


// POST /quizes/:id/edit
exports.edit = function(req,res) {
	var quiz = req.quiz; //autoload de la instacia quiz.
	res.render('quizes/edit', {quiz: quiz, errors: []})
};

// PUT /quizes/:id
exports.update = function(req,res) {
	/* actualiza la DB con la pregunta corregida.
	Cuando damos a salvar la pregunta editada, invocamos la ruta quizes/con el id, en método http put, que es para modificar una tabla.
	Eso viene dado por el actión del formulario.
	Además, al llamar a esta ruta, el autoload guarda el objeto requerido(el modelo orm de la tabla), en req.quiz, y después llama al controlador, update.*/
	
	
	/*El controlador actualiza las propiedades pregunta y respuesta de req.quiz con lo enviado desde el formulario*/
	req.quiz.pregunta = req.body.quiz.pregunta; //actualizamos
	//objeto para db ---- valor enviado por formulario.
	req.quiz.respuesta = req.body.quiz.respuesta;
	
	req.quiz.validate()//validamos
	.then(
	function(err){
		if(err){
			res.render('quizes/edit', {quiz:req.quiz, errors: err.errors});
		}
		
		/* actualiza la DB y
		edirecciona a la lista de preguntas con la pregunta ya corregida.*/
		else {
			req.quiz	//salvamos los campos en DB.
			.save( {fields: ["pregunta","respuesta"]})
			.then( function() {res.redirect('/quizes');});
				//redireccionamos a preguntas con la pregunta modificada.
		}
	});
};

// POST /quizes/:id/edit
exports.destroy = function(req,res) {
	req.quiz.destroy().then(
		function(){
			res.redirect('/quizes');
		}).catch(function(error){next(error)});
};
