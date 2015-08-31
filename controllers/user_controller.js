var users = {
				admin: {id:1, username:"admin", password:"1234", date:""},
				mario: {id:2, username:"mario", password:"5678", date:""}
			};

//Comprobamos si el usuario está registrado en users
// Si autenticar falla o hay errores se ejecuta callback(error)
exports.autenticar = function(login, password, callback) {
	if(users[login])
	{
		if(password === users[login].password)
		{
			callback(null, users[login]);
		} else 	
			{
				callback(new Error('Password erroneo.') );
			}
	} else {
		callback( new Error('No existe el usuario.') );
	}
};
