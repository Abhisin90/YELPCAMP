const Campground = require('./models/campground')
const ExpressError = require("./utils/ExpressError")
const {campgroundSchema,reviewSchema} = require('./schemas')  // Joi schemas
const Review = require('./models/review')

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error','You must be logged in')
        return res.redirect('/login')
    }
    next()
}

module.exports.isOwner = async (req,res,next) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground.owner.equals(req.user._id)){
        req.flash('error','You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    } 
    next()
}

//  middleware function for validating campground form 
module.exports.validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body) // take the input from req.body and validate it with schema provided in Joi for campground
    if(error) {
        const msg = error.details.map(e => e.message)  // throws the particular message of error
        throw new ExpressError(msg,400)    
    } else{
        next()
    }
}

// function for validating review form
module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)  // take the input from req.body and validate it with schema provided in Joi for review
    if(error) {
        const msg = error.details.map(e => e.message) // throws the particular message of error
        throw new ExpressError(msg,400)    
    } else{
        next()
    }
}

module.exports.isReviewOwner = async (req,res,next) => {
    const {id,reviewId} = req.params
    const review = await Review.findById(reviewId)
    if(!review.owner.equals(req.user._id)){
        req.flash('error','You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    } 
    next()
}