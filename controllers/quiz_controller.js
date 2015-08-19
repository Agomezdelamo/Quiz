//Importo el modelo
var models = require('../models/models.js');
var tm = ["Otro", "Humanidades", "Ocio", "Ciencia", "Tecnología" ];

// Autoload - factoriza el código si ruta incluye :quizId
/*vamos, que si la peticion incluye una variable en la url :quizId lo pasa al objeto request como parametro para que guarde el objeto en una propiedad */
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(function(quiz){
		if(quiz) {
			//autoload realiza la búsqueda en la tabla antes de invocar el controlador, dejando el objeto en req.quiz
			req.quiz = quiz;
			next();
		}
		else {
			next(new Error('no existe quizId' + quizId));
		}
	}).catch(function(error) {next(error);});
};

// GET  /quizes  INDEX PREGUNTAS
exports.index = function(req, res, next) {
	models.Quiz.findAll().then(
		function(quizes){
			res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error) {next(error);})
};

// GET  /quizes/search BUSCAR PREGUNTA
exports.search = function(req, res, next) {
	var search = req.query.search;
	var sequelizado = "%"+search.replace(" ", "%")+"%";
					console.log("Esta es la pregunta que estoy buscando",sequelizado);
			 
				models.Quiz.findAll({where: ["pregunta like ?", sequelizado], order: ' pregunta ASC'}).then(
				function(quizes){
					res.render('quizes/index', {quizes: quizes, errors: []});
				}).catch(function(error) {next(error);})
			
};


// GET  /quizes/:id  MOSTRAR PREGUNTA
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};


// GET  /quizes/answer  MOSTRAR RESPUESTA
exports.answer = function(req, res) {
		var resultado = "Incorrecto";
		if(req.query.respuesta === req.quiz.respuesta) {
			resultado = "correcto";
		}
		res.render('quizes/answer', { quiz: req.quiz , respuesta: resultado, errors: [] });
};

// GET /quizes/new   CREAR PREGUNTA FRONT
exports.new = function(req,res) {
	var quiz = models.Quiz.build(//crea un objeto quiz solo para renderizar vistas, no es persistente, no se queda en base de datos.
	{pregunta: "Pregunta", respuesta: "Respuesta", tema: "Humanidades"}
	);
	res.render('quizes/new', {quiz: quiz, tema: tm, errors: []});
};

// POST /quizes/create CREAR PREGUNTA BACK
exports.create = function(req,res) {
	//ESTE CONTROLADOR genera el objeto quiz con models.Quiz.build
	//incializandolo con los parámetros enviados desde el formulario, 
	//que están accesibles en req.body.quiz.	
	var quiz = models.Quiz.build(req.body.quiz);
	quiz.tema = req.body.quiz.temaName;
	//y lo guardo en DB, tanto pregunta como respuesta.
	quiz.validate().then(function(err){
		if(err){
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		}
		else{
			quiz.save({fields: ["pregunta", "respuesta","tema"]}).then(function(){
			res.redirect('/quizes');
			//redirección http (url relativo) lista de preguntas PORQUE NO TENGO VISTA ASOCIADA.
			})
		}
	})	
};


// POST /quizes/:id/edit  EDITAR PREGUNTA FRONT
exports.edit = function(req,res) {
	var quiz = req.quiz; //autoload de la instacia quiz.
	res.render('quizes/edit', {quiz: quiz, tema: tm, errors: []})
};

// PUT /quizes/:id?_method='put'  EDITAR PREGUNTA BACK
exports.update = function(req,res) {
	/* actualiza la DB con la pregunta corregida.
	Cuando damos a salvar la pregunta editada, invocamos la ruta quizes/con el id, en método http put, que es para modificar una tabla.
	Eso viene dado por el actión del formulario.
	Además, al llamar a esta ruta, el autoload guarda el objeto requerido(el modelo orm de la tabla), en req.quiz, y después llama al controlador, update.*/
	
	/*El controlador actualiza las propiedades pregunta y respuesta de req.quiz con lo enviado desde el formulario*/
	req.quiz.pregunta = req.body.quiz.pregunta; //actualizamos
	//objeto para db ---- valor enviado por formulario.
	
	req.quiz.respuesta = req.body.quiz.respuesta;
	//objeto para db ---- valor enviado por formulario.

	req.quiz.tema = req.body.quiz.temaName;
	//objeto para db ---- valor enviado por formulario.

	req.quiz.validate()//validamos
	.then(
	function(err){
		if(err){
			res.render('quizes/edit', {quiz:req.quiz, tema:req.tema, errors: err.errors});
		}
		
		/* actualiza la DB y
		edirecciona a la lista de preguntas con la pregunta ya corregida.*/
		else {
			console.log("esto es la DB TEMA", req.quiz.tema);
			console.log("esto es el body de el formulario", req.body.quiz.temaName);
			req.quiz	//salvamos los campos que escribamos del objeto quiz del req en la DB.
			.save( {fields: ["pregunta","respuesta","tema"]})
			.then( function() {res.redirect('/quizes');});
				//redireccionamos a preguntas con la pregunta modificada.

		}
	});
};

// POST /quizes/:id?_method='destroy'   BORRAR PREGUNTA
exports.destroy = function(req,res) {
	req.quiz.destroy().then(
		function(){
			res.redirect('/quizes');
		}).catch(function(error){next(error)});
};
