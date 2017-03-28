var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function (sequelize, DataTypes) {
	var user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING, 
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		}, 
		salt: {
		  type: DataTypes.STRING
		}, 
		password_hash: {
		  type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull:false,
			validate: {
				len: [7,100]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {
		  hooks: {
		     beforeValidate: function(user, options) {
			   if (typeof user.email === 'string') {
			     user.email = user.email.toLowerCase();
			   } 
		     }
		  },
		  classMethods: {
		  	authenticate: function(body) {
		  		return new Promise(function (resolve, reject) { 
		  		    console.log("authenticate promise");	
				    if ( (typeof body.email !== 'string') || 
				    	 (typeof body.password !== 'string')) {
					         return reject();
					} 
					       
					user.findOne({
						where: {
							email:body.email
						} 
					}).then(function(user) {
						console.log("foundOne user");
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
						  return reject(); 
						} 
						console.log("resolve user");
						resolve(user);
					}, function(e) {
						console.error(e);
						reject();
					});
		  		});
		  	},
		  	findByToken: function (token) {
		  		return new Promise(function (resolve, reject) {
		  			try {
		  				console.log("findBytoken token:" + token); 
		  				var decodedJWT = jwt.verify(token, 'qwerty098');
		  				var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!@#!');
		  				var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8)); 

		  				user.findById(tokenData.id).then(function(user) {
		  					if (user) {
		  						console.log("findBytoken found user");
		  						resolve(user);
		  					} else {
		  						console.log("findBytoken no found user");
		  						reject(); 
		  					}
		  				}, function (e) {
		  					console.error(e); 
		  					reject(); 
		  				}); 
		  			} catch (e) {
		  				console.error(e); 
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
		  	console.log("generateToken");
		  	 if (!_.isString(type)) {
		  	 	  return undefined; 
		  	 }
		  	 try {
		  	 	console.log("got here1");
		  	 	var stringData = JSON.stringify({
		  	 		id: this.get('id'), 
		  	 		type: type
		  	 	});
		  	 	var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();
		  	 	var token = jwt.sign({
		  	 		token: encryptedData,
		  	 	}, 'qwerty098');
		  	 	console.log("got here2");
		  	 	return token; 
		  	 } catch (e) {
		  	 	console.error(e);
		  	 	return undefined; 
		  	 }
		  }
	   }
	});
	return user; 
}