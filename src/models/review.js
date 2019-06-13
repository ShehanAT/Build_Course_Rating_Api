const mongoose = require('mongoose');
//schema for the review database model
const ReviewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	postedOn: {
		type: Date,
		default: Date.now
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5
	}, 
	review: {
		type: String
	}
});
//adding schema to the Review database model
const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
