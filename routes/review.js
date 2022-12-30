const express = require('express')
const router = express.Router({mergeParams:true})
const Review = require('../models/review')
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require("../utils/ExpressError")
const {reviewSchema} = require('../schemas')  // Joi schemas

// function for validating review form
const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)  // take the input from req.body and validate it with schema provided in Joi for review
    if(error) {
        const msg = error.details.map(e => e.message) // throws the particular message of error
        throw new ExpressError(msg,400)    
    } else{
        next()
    }
}

router.post('/',validateReview,catchAsync(async (req,res) => {    
    const foundCamp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    foundCamp.reviews.push(review)
    await review.save()
    await foundCamp.save()
    req.flash('success','Review created')
    res.redirect(`/campgrounds/${foundCamp.id}`)
}))

// pull helps to delete particular reviews with matching pattern as given
router.delete('/:reviewId',async(req,res) => {
    const {id,reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted Review')
    res.redirect(`/campgrounds/${id}`)
})

module.exports = router