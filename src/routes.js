'use strict';

const express = require("express");
const router = express.Router();
const User = require("./models/user");
const Course = require("./models/course");
const Review = require("./models/review");
const middleware = require("./middleware");


//get all the users in the database
router.get('/users', middleware.requiresLogin, (req, res, next) => {
	res
		.status(200)
		.json(req.activeUser);
		return res.end();
});

//create new user, returns error if existing email address is entered or there is incomplete data
router.post('/users', (req, res, next) => {
	const user = new User(req.body);
	user.save((err) => {
		if(err){
			err.status = 400;
			return next(err);
		}
		res
			.status(201)
			.set('Location', '/')
			.end();
	});
});
//gets all the courses
router.get('/courses', (req, res, next) => {
	Course.find({}, {title: true})
		.exec((err, courses) =>{
			if(err) return next(err);
			res
				.status(200)
				.json(courses);
		})
});
//gets the specified course based on the courseId
router.get('/courses/:courseId', (req, res, next) => {
	Course.findById(req.params.courseId)
		.populate({path: 'user', select: 'fullName'})
		.populate({path: 'reviews'})
		.exec((err, course) => {
			if(err) return next(err);
			res
				.status(200)
				.json(course);
		})
})
//creates a new course and adds it to the database, returns error message if request is sent with authorization or if request body contains only minimum data
router.post('/courses', middleware.requiresLogin, (req, res, next) => {
	const course = new Course(req.body);
	course.save((err) => {
		if(err){
			err.status = 400;
			return next(err);
		}
		res
			.location('/')
			.status(201)
			.end();
	});
})
//updates a course specified by the courseId, returns message error if courseId not found in database
router.put('/courses/:courseId', middleware.requiresLogin, (req, res, next) => {
	Course.findById(req.params.courseId)
	.update(req.body)
	.exec((err, course) => {
		if(err){
			err.status = 400;
			return next(err);
		}
		res.location('/')
		.status(204)
		.json(course);
	})
});
//creates review for the specified courseId and returns nothing
router.post('/courses/:courseId/reviews', middleware.requiresLogin, (req, res, next) => {
	const review = new Review(req.body);
	review.save((err) => {
		if(err){
			err.status = 400;
			return next(err);
		}
		Course.findById(req.params.courseId)
			.exec((err, course) => {
				if(err) return next(err);
				course.reviews.push(review);
				course.save((err) => {
					if(err){
						err.status = 400;
						return next(err);
					}
					res.location('/')
					.status(201)
					.end();
				});
			})
	});
});
//exporting the file 
module.exports = router;