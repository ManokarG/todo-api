const _ = require('underscore');
const bcrypt = require('bcryptjs');

module.exports = function(db, express) {
	var router = express.Router();

	router.post('/', function(req, res) {

		var user = _.pick(req.body, 'email', 'password');

		db.user.create(user).then(function(user) {
			res.json(user.toPublicJSON());
		}, function(e) {
			res.status(404).send(e.message);
		});
	});

	router.post('/login', function(req, res) {
		var body = _.pick(req.body, 'email', 'password');

		db.user.authenticate(body).then(function(user) {
			var token=user.generateToken('authenticate');
			if(token){
			res.header('Auth',token).json(user.toPublicJSON());
		}else{
			res.status(404).send('Error while creating token');
		}
		}, function() {
			res.status(404).send('Cannot user login');
		});
	});

	return router;
}