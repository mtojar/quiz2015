var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET Página de entrada. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors:[] });
});

// Autoload de comandos :quizId, tiene que ir antes de los controladores para ejecutarse primero
router.param('quizId', quizController.load);

//Definición de rutas de sesión
router.get('/login',	sessionController.new);		// formulario de login
router.post('/login',	sessionController.create);	// crear sesión
router.get('/logout',	sessionController.destroy);	// destruir sesión

//Definición de rutas de /quizes. \\+d significa que tiene que tener 1 o más decimales
router.get('/quizes',							quizController.index);
router.get('/quizes/:quizId(\\d+)', 			quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 		quizController.answer);
router.get('/quizes/new',						sessionController.loginRequired, quizController.new);
router.post('/quizes/create',					sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',		sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', 			sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', 			sessionController.loginRequired, quizController.destroy);

//Definición de rutas de /quizes/comment
//instancia el formulario de crear comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',	commentController.new);
//guarda el comentario en la tabla comment de la bd y redirecciona a la vista con la lista de preguntas
router.post('/quizes/:quizId(\\d+)/comments',		commentController.create);	

router.get('/authors',				quizController.authors);

module.exports = router;
