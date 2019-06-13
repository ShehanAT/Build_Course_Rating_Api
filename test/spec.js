var app = require('../src/index');
var request = require('supertest');
var chai = require('chai').expect;
const User = require('../src/models/user');


// describe('user authentication', function(){

// 	it('should return a valid user when sending GET /api/users(with auth)', function(done){
// 		const data = [{fullName: 'John Smith', emailAddress: 'john@smith.com', password:'password'}];
// 		User.create(data, function(err, user){
// 			request(app)
// 				.get('/api/users')
// 				.set('Accept', 'application/json')
// 				.set('Authorization', 'Basic am9lQHNtaXRoLmNvbTpwYXNzd29yZA==')
// 				.expect('Content-Type', 'json')
// 				.expect(200)
// 				.end(function(err, response){
// 					if(err) return done(err);
// 					chai(resp.body.fullName).to.eq('Joe Smith');
// 					done();
// 				})
// 		});
// 	});
// });

describe('user', function() {
  // When I make a request to the GET /api/users route with the correct credentials, the corresponding user document is returned
  it('should return a user', function(done) {
    const userData = [{ fullName: 'John Smith', emailAddress: 'john@smith.com', password: 'password' }];
    User.create(userData, function(err, users) {
     request(app)
       .get('/api/users')
       .set('Accept', 'application/json')
       .set('Authorization', 'Basic am9lQHNtaXRoLmNvbTpwYXNzd29yZA==')
       .expect('Content-Type', /json/)
       .expect(200)
       .end(function(err, resp) {
         if (err) return done(err);
         chai(resp.body.fullName).to.eq('John Smith');
         done();
       });
      });
  });

});


