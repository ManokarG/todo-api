const _ = require('underscore');
const bcrypt = require('bcryptjs');

module.exports = function(db, express) {

	const middleware=require('./../middleware')(db);

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
		var userInstance;

		db.user.authenticate(body).then(function(user) {
			var token = user.generateToken('authenticate');
			userInstance = user;
			if (token) {
				return db.token.create({
					token: token
				});
			} else {
				res.send('Error while creating token');
			}
		}).then(function(tokenInstance) {
			res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
		}).catch(function(e) {
			console.log(e);
			res.json({
				status:'error',
				message:'Username or password error'
			});
		});
	});

	router.delete('/login',middleware.requireAuthentication,function(req,res){
		req.token.destroy().then(function(){
			res.send('Logged out successfully');
		}).catch(function(e){
			res.status(404).send('Unable to logout user');
		});
	})

	return router;
}