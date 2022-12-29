const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const ejsMate = require('ejs-mate')
const ExpressError = require("./utils/ExpressError")
const catchAsync = require('./utils/catchAsync')
const {campgroundSchema,reviewSchema} = require('./schemas')  // Joi schemas
const Review = require('./models/review')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
   .then(() => console.log("MONGODB connected!!!"))
   .catch(err => console.log(err))

app.engine('ejs',ejsMate)   // for using boilerplate for all pages
app.set('view engine','ejs')  // for setting the dynamic templating to be ejs format
app.set('views',path.join(__dirname,'views'))  // for setting the views directory accessible from any directory
app.use(methodOverride('_method'))     // middleware for using https method other than Get,Post
app.use(express.urlencoded({extended:true})) // built in middleware for form-data

//  middleware function for validating campground form 
const validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body) // take the input from req.body and validate it with schema provided in Joi for campground
    if(error) {
        const msg = error.details.map(e => e.message)  // throws the particular message of error
        throw new ExpressError(msg,400)    
    } else{
        next()
    }
}

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

// crud functionality requests
app.get('/',(req,res) => {
    res.send('Home it is')
})

// catchAsync --> function for catching the error , to reduce the repetitive use of try and catch
app.get('/campgrounds',catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new')
})

// populate helps to showcase documents as whole rather than just their objectIds
app.get('/campgrounds/:id', catchAsync(async (req,res) => {
    const {id} = req.params
    const foundCamp = await Campground.findById(id).populate('reviews')
    res.render('campgrounds/show',{foundCamp})
}))

app.get('/campgrounds/:id/edit',catchAsync(async (req,res) => {
    const {id} = req.params
    const foundCamp = await Campground.findById(id)
    res.render('campgrounds/edit',{foundCamp})
}))

// using middleware to first verify input data from form
app.put('/campgrounds/:id',validateCampground,catchAsync(async (req,res) => {
    const {id} = req.params
    const updatedCamp = await Campground.findByIdAndUpdate(id,req.body.campground)
    res.redirect(`/campgrounds/${updatedCamp.id}`) 
}))

app.post('/campgrounds',validateCampground,catchAsync(async (req,res) => {
    const campground =  new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
}))

app.delete('/campgrounds/:id',catchAsync(async (req,res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))

app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async (req,res) => {    
    const foundCamp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    foundCamp.reviews.push(review)
    await review.save()
    await foundCamp.save()
    res.redirect(`/campgrounds/${foundCamp.id}`)
}))

// pull helps to delete particular reviews with matching pattern as given
app.delete('/campgrounds/:id/reviews/:reviewId',async(req,res) => {
    const {id,reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
})

// for paths other than required
app.all('*',(req,res,next) => {
    next(new ExpressError('Page not Found',404))
})

// error handling middleware
app.use((err,req,res,next) => {
    const {statusCode=500} = err
    if(!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error',{err})
})

app.listen(3000,() => {
    console.log("APP listening on port 3000!!!")
})