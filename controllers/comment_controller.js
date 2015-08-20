//Importo el modelo
var models = require('../models/models.js');

// GET /comments/new   CREAR COMENTARIO FRONT
exports.new = function(req,res) {
	res.render('comments/new.ejs', {quizId: req.params.quizId, errors: []});
};

// POST /comments/create CREAR COMENTARIO BACK
exports.create = function(req,res) {
	//ESTE CONTROLADOR genera el ORM comment con models.Comment.build
	//incializandolo con los parámetros enviados desde el formulario, 
	//que están accesibles en req.body.comment.	
	var comment = models.Comment.build(
	{	texto: req.body.comment.texto,
/*La relación belongsTo(…) de Comment a Quiz añade un parámetro :quizId adicional en
cada elemento de la tabla Comments que indica el quiz asociado.
Se utiliza el nombre :quizId definido en la ruta en routes/index.js.*/
		QuizId: req.params.quizId
	});

	comment.validate().then(function(err){
		if(err){
			res.render('comments/new.ejs', {comment: comment, quizid: req.params.quizId, errors: err.errors});
		}
		else{
			comment.save().then(function(){
			res.redirect('/quizes/'+req.params.quizId);
			//redirección http (url relativo) lista de preguntas PORQUE NO TENGO VISTA ASOCIADA.
			})
		}
	}).catch(function(error){next(error)});	
};

