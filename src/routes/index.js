'use strict';

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Course = require("../models/course");
const Review = require("../models/review");
const midAuthUser = require("../middleware").authenticateUser;

router.get('/api/users', midAuthUser, (req, res, next) => {
	res
		.status(200)
		.json(req.activeUser);
		return res.end();
});

router.post('/api/users', (req, res, next) => {
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

router.get('/api/courses', (req, res, next) => {
	Course.find({}, {title: true})
		.exec((err, courses) =>{
			if(err) return next(err);
			res
				.status(200)
				.json(courses);
		})
});

router.get('/api/courses/:courseId', (req, res, next) => {
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

router.post('/api/courses', midAuthUser, (req, res, next) => {
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

router.put('/api/courses/:courseId', midAuthUser, (req, res, next) => {
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

router.post('/api/courses/:courseId/reviews', midAuthUser, (req, res, next) => {
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

module.exports = router;