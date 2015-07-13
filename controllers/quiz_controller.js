//GET /quizes/question
//notese que la parte del path "question" coincide con la función a exportar
//y quizes/question es el path de las vista
exports.question = function(req, res)
          {
            res.render('quizes/question', {pregunta: 'Capital de ITALIA'});
          }

//GET /quizes/answer
//notese que la parte del path "answer" coincide con la función a exportar
//y quizes/answer es el path de las vista
exports.answer = function(req, res)
          {
            if ("Roma".localeCompare(req.query.respuesta,'es'
			, {usage: 'search', sensitivity: 'base' }) == 0)
            //if(req.query.respuesta === 'Roma')
              res.render('quizes/answer', {respuesta: 'CORRECTO'});
            else
              res.render('quizes/answer', {respuesta: 'INCORRECTO'});
          }
