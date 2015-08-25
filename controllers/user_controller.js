
var users = {
	admin: {id:1, username: "admin", password: "1234"},
	pepe: {id:2, username: "pepe", password: "5678"}
};


// Comprueba si el usuario esta registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error).
//si dentro del objeto users esta el parametro login q mandamos desde el formulario entra...

exports.autenticar = function(login, password, callback) {
	if(users[login]){console.log("hay un usuario",users[login]);
		if(password===users[login].password) {
			callback(null, users[login]);
		}
		else{callback(new Error('Password erróneo.'));}
	}
	else {callback(new Error('no Existe el usuario.'))}
};

