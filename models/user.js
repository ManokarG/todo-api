var bcrypt = require('bcryptjs');
var crypto = require('crypto-js');
var _ = require('underscore');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataType) {
	var user = sequelize.define('user', {
		email: {
			type: DataType.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataType.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7, 100]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var passwordHash = bcrypt.hashSync(value, salt);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', passwordHash);
				this.setDataValue('password', value);
			}
		},
		salt: {
			type: DataType.STRING
		},
		password_hash: {
			type: DataType.STRING
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				user.email = user.email.toLowerCase();
			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {

					if (typeof body.email != 'string' || typeof body.password != 'string') {
						return reject();
					}

					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {

						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						}

						resolve(user);
					}, function(e) {
						reject();
					});

				});
			},
			findByToken: function(token) {
				return new Promise(function(resolve, reject) {
					try {

						var decodedJWT = jwt.verify(token, 'login123');
						var bytes = crypto.AES.decrypt(decodedJWT.token, 'user101');
						var tokenData = JSON.parse(bytes.toString(crypto.enc.Utf8));

						user.findById(tokenData.id).then(function(user) {
							if (user) {
								resolve(user);
							} else {
								reject();
							}
						}, function(e) {
							console.log(e);
							reject();
						});
					} catch (e) {
						console.log(e);
						reject();
					}


				});
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function(type) {
				if (!_.isString(type)) {
					return undefined;
				}

				try {
					var jsonData = JSON.stringify({
						id: this.get('id'),
						type: type
					});
					var encryptedData = crypto.AES.encrypt(jsonData, 'user101').toString();
					var token = jwt.sign({
						token: encryptedData
					}, 'login123');
					return token;
				} catch (e) {
					console.log(e);
					return undefined;
				}
			}
		},

	});

	return user;
}