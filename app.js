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
// Lo quitamos var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session({
    secret: "cookie_secret",
    resave: true,
    saveUninitialized: true
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use(function(req,res,next) {

        //guardamos path en session.redir para después de login
        if (!req.path.match(/\/login|\/logout/))
        {
            //console.log("req.path (app.js)": req.path);
            req.session.redir = req.path;
            //console.log("req.session.redir (app.js)": req.session.redir);
        }

        //Hacemos visible req.session para poder usarla en las vistas
        res.locals.session = req.session;
        next();
    });

app.use(function(req, res, next) {
    if(req.session.user)    //comprobamos si se ha comenzado la sesión
    {
        var now = new Date();   //hora actual
        var last = new Date(req.session.user.date); //hora de inicio de la session
        var time = now - last;  //diferencia

        if (time > 120000)  //ha expirado el tiempo superior a 2 minutos si hacer nada expira la sesión
        {
            delete req.session.user;
            var _error = new Error("HA EXPIRADO EL TIEMPO DE SESIÓN");
            _error.status = "001";
            next( _error );
        } else {
            req.session.user.date = now;
            next();
        }
    } else {
        next();
    }
})

app.use('/', routes);
//también lo quitamos app.use('/users', users);

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
