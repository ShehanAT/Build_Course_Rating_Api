const auth = require('basic-auth');
const User = require('../models/user');

function requiresLogin(req, res, next){
	const cred = auth(req);
	if(cred){
		User.authenticate(cred.name, cred.pass, (err, user) => {
			if(err || !user){
		
				const err = new Error('Password did not match')
				err.status = 401;
				return next(err);
			}else if(user){
				req.activeUser = user;
				return next();
			}
		})
	}else{
		const err = new Error('Authentication header not found');
		err.status = 401;
		return next(err);
	}
}

module.exports.requiresLogin = requiresLogin;
