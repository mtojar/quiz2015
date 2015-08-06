var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');

/* GET Página de entrada. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de comandos :quizId, tiene que ir antes de los controladores para ejecutarse primero
router.param('quizId', quizController.load);

//Definición de rutas de /quizes. \\+d significa que tiene que tener 1 o más decimales
router.get('/quizes',							quizController.index);
router.get('/quizes/:quizId(\\d+)', 			quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 		quizController.answer);

router.get('/authors',				quizController.authors);

module.exports = router;
