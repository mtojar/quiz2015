// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next)
			{
	// preguntamos por req.session.user por que es esta propiedad la que creamos cuando nos autenticamos login
	// en caso contrario la propiedad no existe, también se destruye cuando hacemo logout
				if(req.session.user)
				{
					next();
				} else {
					res.redirect('/login');
				}
			};


// Get /login -- Formulario de login
exports.new = function(req,res,next)
			{
				//creamos la variable errors con los errores de la sesión o vacío
				var errors = req.session.errors || {};
				req.session.errors = {};

				res.render('sessions/new', {errors: errors});
			}

// POST /login --Crear la sesión
exports.create = function(req, res, next)
			{
				var login = req.body.login;
				var password = req.body.password;

				var userController = require('./user_controller');
				userController.autenticar(login, password, function(error, user) {

					if (error)
					{
						req.session.errors = [{"message": 'Se ha producido un error ' + error}];
						res.redirect("/login");
						return;
					}

					// Creamos req.session.user y guardar campos id y username
					// La sesión se define por la existencia de: req.session.user, añadimos date para controlar el tiempo desde
					// que se creo
					var date = new Date();
					req.session.user = {id: user.id, username: user.username, date: date};

					// Redirección a path anterior a login
					console.log("req.session.redir " + req.session.redir + " typeof: " + typeof(req.session.redir));
					res.redirect(req.session.redir.toString());
				});
			};

// DELETE /logout  --Destruir sesion
exports.destroy = function(req, res, next)
			{
				delete req.session.user;
				res.redirect(req.session.redir.toString());		// redirect a path anterior a login
			}