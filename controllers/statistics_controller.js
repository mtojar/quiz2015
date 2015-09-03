var models = require('../models/models.js');

var dataStatistics = {
      numQuizes: 0,
      numComentarios: 0,
      numComentariosNoPublicados: 0,
      numQuizesComentados: 0,
      numQuizesNoComentados:0
  };

var errors = [];


exports.calculate = function(req, res, next)
		{
			models.Quiz.count().then(function(numQuizes) 
			{
				dataStatistics.numQuizes = numQuizes;
				return models.Comment.count();
			})
				.then(function(numComments)
				{
					dataStatistics.numComentarios = numComments;
					return models.Comment.countUnPublished();
				})
				.then(function(numNoPublished)
				{
					dataStatistics.numComentariosNoPublicados = numNoPublished;
					return models.Comment.countNoCommentedQuizes();
				})
				.then(function(numQuizesNoCommented)
				{
					dataStatistics.numQuizesNoCommentados = numQuizesNoCommented;
					dataStatistics.numQuizesComentados = dataStatistics.numQuizes - dataStatistics.numQuizesNoCommentados;
				})
			.catch(function(error){errors.push(error); next(error); })
			.finally( function(){ next(); } );
		};

//GET  /quizes/statistics
exports.show = function(req, res)
		{
			res.render( 'quizes/statistics', {datos: dataStatistics, errors: errors} );
		}