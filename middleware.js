var crypto = require('crypto-js');
module.exports = function(db) {
	return {
		requireAuthentication: function(req, res, next) {
			var token = req.get('Auth') || '';

			db.token.findOne({
				where: {
					tokenHash: crypto.MD5(token).toString()
				}
			}).then(function(tokenInstance) {
				req.token=tokenInstance;
				return db.user.findByToken(tokenInstance.get('token'));
			}).then(function(user) {
				req.user = user;
				next();
			}).catch(function(e) {
				res.status(404).send('Token invalid');
			});

			/*			db.user.findByToken(header).then(function(user) {

							req.user = user;
							next();

						}, function(e) {
							console.log(e);
							res.status(404).send();
						});*/
		}
	};
};