var models = require('../models/models.js');

//GET /quizes/:id
exports.show = function(req, res)
          {
            models.Quiz.find(req.params.quizId).then(function(quiz)
                {
                  res.render('quizes/show', {quiz: quiz});
                })
          };

//GET /quizes/:id/answer
exports.answer = function(req, res)
          {
            models.Quiz.find(req.params.quizId).then(function(quiz)
                {
                  if(quiz.respuesta.localeCompare(req.query.respuesta,'es', 
                                {usage: 'search', sensitivity: 'base' }) == 0) 
                        res.render('quizes/answer', {quiz:quiz, respuesta: 'CORRECTO'});
                      else
                        res.render('quizes/answer', {quiz:quiz, respuesta: 'INCORRECTO'});
                })
          };          

//GET /quizes
exports.index=function(req, res) 
          {
            models.Quiz.findAll().then(function(quizes)
                  {
                    res.render('quizes/index.ejs', 
                        {quizes:quizes} );
                  })
          };



//GET /quizes/author
exports.authors = function(req, res)
          {
            res.render('creditos', {autores: 'Mario Francisco Tojar Trujillo'});
          };
