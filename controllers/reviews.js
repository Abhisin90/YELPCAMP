const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.createReview = async (req,res) => {    
    const foundCamp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.owner = req.user.id
    foundCamp.reviews.push(review)
    await review.save()
    await foundCamp.save()
    req.flash('success','Review created')
    res.redirect(`/campgrounds/${foundCamp.id}`)
}

// pull helps to delete particular reviews with matching pattern as given
module.exports.deleteReview = async(req,res) => {
    const {id,reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted Review')
    res.redirect(`/campgrounds/${id}`)
}