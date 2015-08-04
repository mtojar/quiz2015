var models = require('../models/models.js');

//GET /quizes/question
//notese que la parte del path "question" coincide con la función a exportar
//y quizes/question es el path de las vista
//modificado para buscar las preguntas en la base de datos
exports.question = function(req, res)
          {
            models.Quiz.findAll().then(function(quiz)
                    {
                      res.render('quizes/question', {pregunta:quiz[0].pregunta})
                    })
            //res.render('quizes/question', {pregunta: 'Capital de ITALIA'});
          };

//GET /quizes/answer
//notese que la parte del path "answer" coincide con la función a exportar
//y quizes/answer es el path de las vista ->  buscamos la solución en la base de datos
exports.answer = function(req, res)
          {
            models.Quiz.findAll().then(function(quiz)
                    {
                      if(quiz[0].respuesta.localeCompare(req.query.respuesta,'es', 
                                {usage: 'search', sensitivity: 'base' }) == 0) 
                        res.render('quizes/answer', {respuesta: 'CORRECTO'});
                      else
                        res.render('quizes/answer', {respuesta: 'INCORRECTO'});
                    })
          };

//GET /quizes/author
exports.authors = function(req, res)
          {
            res.render('creditos', {autores: 'Mario Francisco Tojar Trujillo'});
          };
