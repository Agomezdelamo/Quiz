var models = require('../models/models.js');

exports.autenticar = function(login, password, callback) {
	
	//muestro por consola los usuarios y sus contraseñas.
	models.User.findAll().then(function(user){
		for(index in user){
			console.log("lista de usuarios registrados:"+user[index].username);
			console.log("lista de usuarios registrados:"+user[index].password);
		}
	});

	models.User.find({
        where: {
            username: login
        }}).then(function(user) {
    	if (user) {
    		if(user.verifyPassword(password)){
            	callback(null, user);
        	}
        	else { callback(new Error('Password erróneo.')); } 	
      	} else { callback(new Error('No existe user=' + login))}
    }).catch(function(error){callback(error)});
};
// GET /user/new   CREAR USUARIO FRONT
exports.new = function ( req, res ) {
	res.render('user/new', { errors: [] });
}

exports.create = function ( req, res ) {
	//genero un orm de user
	var user = models.User.build();
	console.log(user);
	//le paso los valores del formulario
	user.username = req.body.newUser;
	user.password = req.body.password;
	user.isAdmin = req.body.isAdmin;
	
	//valido y guardo en base de datos.
	user.validate().then(function(err){
		if(err) {
			res.render('user/new', {errors: err.errors});
		}
		else {
			user.save(["username","password","isAdmin"]).then(
				function(user){
					console.log("este es el usuario creado ----> "+user.username);
					res.redirect('/');}
			).then(function(user){
				models.Quiz.findAll().then()
			});
		}
	})
	
	
}