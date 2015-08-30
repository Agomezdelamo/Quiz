var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

//1 view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015'));
app.app.use(session({
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// Helpers dinamicos:
app.use(function(req, res, next) {
  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

// Autologout despues de 2 minutos
app.use('/', function(req,res,next){

  var callNext = true;
  // Si el usuario está logado
if(req.session.user){
    var fecha = new Date(); // obtenemos la fecha
    
	// Si no hay fecha de ultima acción, se establece
	if(!req.session.lastActionTime){
		req.session.lastActionTime = fecha.getTime();
    }
	
	// Si hay fecha de ultima acción, se comprueba que no sea de hace más de 2 minutos
	else {
		var secondsDiff = (fecha.getTime() - req.session.lastActionTime)/1000;
		console.log('secondsDiff: '+secondsDiff);
		
		if(secondsDiff < 120){
			req.session.lastActionTime = fecha.getTime();
		}
		else {
			delete req.session.user;
			delete req.session.lastActionTime;

			var errors = req.session.errors || {message: ""};
			req.session.errors = [{"message": 'Sesión caducada. Identificate de nuevo'}];

			res.redirect("/login");
			callNext = false;
		}
	}
}
  // Si se ha redirigido al login no se debe pasar por ningún MiddleWare más
  if(callNext){
    next();
  }
});

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
			errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
		errors: []
    });
});


module.exports = app;
