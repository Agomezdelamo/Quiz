var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Usar BBDD SQLite o Postgres 
var sequelize = new Sequelize(null, null, null, 
  { dialect:  "sqlite",
    storage:  "quiz.sqlite"
  }      
);

/** IMPORTO LA DEFINICIÓN DE LA TABLA QUIZ EN EL OBJETO MAPEADO (ORM) **/
//ruta del modelo.
var quiz_path = path.join(__dirname,'quiz');
//importo el modelo de esa ruta a sequelize para genere el ORM(mapeo objeto-tabla relacional) que sea puente entre el controlador y la DB.
var Quiz = sequelize.import(quiz_path);
//Lo mismo para el resto de tablas.
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

var user_path = path.join(__dirname,'user');
var User = sequelize.import(user_path);

/**ESTABLEZCO LAS RELACIONES ENTRE LAS TABLAS **/
//N-a-1
//Los comentarios pertenecen a una sola tabla Quiz.
Comment.belongsTo(Quiz);
//1-a-N
//Una sola tabla quiz puede tener muchos comentarios
Quiz.hasMany(Comment);

// los quizes pertenecen a un sólo usuario registrado
Quiz.belongsTo(User);
// un sólo usuario puede tener muchos quiz
User.hasMany(Quiz);


/** EXPORTO LAS TABLAS PARA PODER TRABAJAR EN EL CONTROLADOR CON ELLA **/
// exportar tablas
exports.Quiz = Quiz; 
exports.Comment = Comment; 
exports.User = User;

// sequelize.sync() inicializa tabla de preguntas en DB
	sequelize.sync().then(function() {
	//then ejecuta el manejador de una tabla
	User.count().then(function(count) {
		if(count == 0) {//la tabla solo se inicializa si esta vacia
			User.bulkCreate( 
			[ {username: 'admin',   password: '1234', isAdmin: true},
			  {username: 'pepe',   password: '5678'} // el valor por defecto de isAdmin es 'false'
			] ).then(function(){
        console.log('Base de datos (tabla user) inicializada');
        Quiz.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Quiz.bulkCreate( 
              [ {pregunta: 'Capital de Italia',   respuesta: 'Roma', UserId: 2}, // estos quizes pertenecen al usuario pepe (2)
                {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', UserId: 2}
              ]
            ).then(function(){console.log('Base de datos (tabla quiz) inicializada')});
          };
        });
      });
    };
  });
});
