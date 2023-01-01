const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn,isReviewOwner,validateReview} = require('../middleware')
const reviews = require('../controllers/reviews')

router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewOwner,catchAsync(reviews.deleteReview))

module.exports = router