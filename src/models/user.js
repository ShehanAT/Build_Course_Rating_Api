'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true,
		trim: true
	},
	emailAddress: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	}


});

UserSchema.statics.auth = function(emailAddress, password, callback){
	User.findOne({ emailAddress: emailAddress})
		.exec( (err, user) => {
			if(err){
				return callback(err);
			}else if( !user ){
				var err = new Error('User not found in database');
				err.status = 401;
				return callback(err);
			}
			bcrypt.compare(password, user.password, function(err, result){
				if(result == true || user.password === password){
					return callback(null, user);
				}else{
					return callback();
				}
			})
		});
		
}

UserSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password, 10, (err, hash) => {
		if(err){
			return next(err);
		}
		user.password = hash;
		next();
	});
});

const User = mongoose.model('User', UserSchema);

module.exports = User;