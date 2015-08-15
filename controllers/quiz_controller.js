var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId)
		  {
		  	models.Quiz.find(quizId).then(function(quiz)
		  		{
		  			if(quiz)
		  			{
		  				req.quiz = quiz;
		  				next();
		  			} else { next(new Error('No existe quizId='+quizId)); }
		  		}
		  	).catch(function(error){ next(error);});
		  };

//GET /quizes
exports.index=function(req, res, next) 
          {
          	if(req.query.search)
          	{
          		//res.render('quizes/tem.ejs', {search: req.query.search});
          		models.Quiz.findAll({
          				where: ["pregunta like ?", "%"+req.query.search+"%"]
          			}).then(function(quizes)
          					{
          						if(quizes.length != 0)
          							res.render('quizes/index', {quizes:quizes, errors: []});
          						else 
          						{
                        var err = new Error('No existen consultas con el dato ' + req.query.search);
                        err.status = (err.status || 500);
                        err.stack = "quiz_controllers -> exports.index -> models.Quiz.findAll({where: [\"pregunta like ?\", \"%\"+"
                              + req.query.search+"\"%\"]";
                        next(err);
          						}
          					}).catch(function(error){ next(error); } );
          	} else
          	{
            	models.Quiz.findAll().then(function(quizes)
                	{
                    	res.render('quizes/index.ejs', {quizes:quizes, errors:[]} );
                  }).catch(function(error){ next(error); })
        	}
          };

//GET /quizes/:id
//ya hemos preguntado por la pregunta en load
exports.show = function(req, res)
          {
            res.render('quizes/show', {quiz: req.quiz, errors:[]});
          };

//GET /quizes/:id/answer
//la pregunta nos viene dada por req.quiz
exports.answer = function(req, res)
          {
          	 var resultado = "INCORRECTO";
			       if(req.quiz.respuesta.localeCompare(req.query.respuesta,'es', 
                                {usage: 'search', sensitivity: 'base' }) == 0) 
				        resultado = "CORRECTO";
			       res.render('quizes/answer', {quiz:req.quiz, respuesta: resultado, errors:[]});
          };          

//GET /quizes/new
exports.new = function(req, res)
          {
            //creamos un objeto quiz
            var quiz = models.Quiz.build({pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"});

            res.render('quizes/new', {quiz:quiz, errors:[]});
          };

//POST /quizes/create
exports.create = function(req, res)
          {
            var quiz = models.Quiz.build( req.body.quiz );

            // guardamos en la bd los campos pregunta y respuesta de quiz pero primero contralamos si existe algún error
            // es decir, si alguno de ellos está vacio
            quiz
              .validate()
                .then( function(err)
                    {
                      if (err) { res.render('quizes/new', {quiz:quiz, errors:err.errors});}
                      else 
                      {
                        //save: guarda en la BD los campos pregunta y respuesta de quiz
                        //redireccón HTTP (URL relativo) lista de preguntas
                        quiz.save( {fields: ["pregunta", "respuesta", "tema"]} ).then(function()
                              { res.redirect('/quizes'); });
                      }
                });
          };

// GET /quizes/:id/edit
exports.edit = function(req, res)
          {
            var quiz = req.quiz;    //autoload de la instancia de quiz
            res.render('quizes/edit', {quiz:quiz, errors: []});
          };

exports.update = function(req, res)
          {
            req.quiz.pregunta = req.body.quiz.pregunta;
            req.quiz.respuesta = req.body.quiz.respuesta;

            req.quiz.validate().then (
                function(err)
                {
                  if (err) { res.render('quizes/edit', {quiz: req.quiz, errors: err.errors}); }
                  else
                  {
                    //save: guarda campos pregunta y respuesta en BD
                    req.quiz.save( {fields: ["pregunta", "respuesta"]})
                      .then( function(){ res.redirect('/quizes'); });   //redirección HTTP a lista de preguntas (URL relativo)
                  }
                }
              );
          };

//DELETE /quizes/:id
exports.destroy = function(req, res, next)
          {
            req.quiz.destroy()
              .then( 
                function(){ res.redirect('/quizes');}
              ).catch(function(error){ next(error);});
          };


//GET /quizes/author
exports.authors = function(req, res)
          {
            res.render('creditos', {autores: 'Mario Francisco Tojar Trujillo', errors: []});
          };
