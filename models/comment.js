//Definición del modelo de Comment con validación

module.exports = function(sequelize, DataTypes)
				{
					return sequelize.define ('Comment',
						{
							texto: {
								type: 		DataTypes.STRING,
								validate: 	{ notEmpty: {msg: 	"-> Falta Comentario"} }
							},
							publicado: {
								type: 		DataTypes.BOOLEAN,
								defaultValue: false
							}
						},
						{
							// comentarios no publicados
							classMethods: {
								countUnPublished: function(){
									return this.count({where: {publicado: false}});
								},
								/*
								 * con la función aggregate no permite ejecutar una función segundo termino
								 * con la condición en tercer término y del campo especicificado en el primer 
								 * termino.
								 * Seria cuentame el campo QuizId en aquellos quizes que tengan comentarios,
								 * quizid que esten en Comment
								 */
								countCommentedQuizes: function(){
									return this.aggregate('QuizId', 'count', {distinct: true});
								}
							}
						}
					);
				};