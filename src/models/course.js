const mongoose = require('mongoose');
//model for the courses
const CourseSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	estimatedTime: {
		type: String
	},
	materialsNeeded: {
		type: String
	},
	steps:[
	{
		stepNumber: {
			type: Number
		},
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		}
	}
	],
	reviews: [
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Review'
	}

	]

});
//adding course schema to the course model object
const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
