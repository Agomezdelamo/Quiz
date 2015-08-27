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