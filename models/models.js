var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@hosts:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
//extraemos los componentes con RegExp de la varaible de entorno DATABASE_URL
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name 	= (url[6]||null);
var user		= (url[2]||null);
var pwd 		= (url[3]||null);
var protocol	= (url[1]||null);
var dialect		= (url[1]||null);
var port 		= (url[5]||null);
var host 		= (url[4]||null);
var storage		= process.env.DATABASE_STORAGE;

console.log("storage: " + storage);

//cargamos Modelo ORM
var Sequelize = require('sequelize');

// Usamos BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
		{
			dialect: 	protocol,
			protocol: 	protocol,
			port: 		port,
			host: 		host,
			storage: 	storage,	//solo SQLite (.env)
			omitNull: 	true		//solo Postgres
		}
	)

//Importamos la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz;	//exportamos definición de tabla Quiz

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function()
				{
					//then(..) ejecuta el manejador una vez creada la tabla
					Quiz.count().then(function(count)
									{
										console.log("cuantos hay: " + count);
										if(count===0)
										{
											Quiz.create({ 	pregunta: 	'Capital de Italia',
															respuesta: 	'Roma',
															tema: 		'Humanidades'
												});
											Quiz.create({ 	pregunta: 	'Capital de Portugal',
															respuesta: 	'Lisboa',
															tema: 		'Humanidades'
												})									
											.then(function() {console.log('Base de Datos Inicializada');});
										} 
									}).catch(function(err){consolo.log("Error al contar: " + err);});
				}).catch(function(err) {console.log("Error al sincronizar: " + err); console.log("url: " + url)});
