var path = require('path');

//cargamos Modelo ORM
var Sequelize = require('sequelize');

//usamos BBDD SQLite
var sequelize = new Sequelize(null, null, null, 
						{ dialect: "sqlite", storage: "quiz.sqlite"}
					);

//Importamos la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz;	//exportamos definición de tabla Quiz

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().success(function()
				{
					//success(..) ejecuta el manejador una vez creada la tabla
					console.log('Vamos a mirar si hay algo');
					Quiz.count().success(function(count)
									{
										if(count===0)
										{
											console.log("No hay nada añadimos");
											Quiz.create({
													pregunta: 'Capital de Italia',
													respuesta: 'Roma'
												})
												.then(function()
														{
															console.log('Base de Datos Inicializada');
														});
										} else console.log("HAY DATOS");
									});
				});
