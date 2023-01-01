const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require("../utils/ExpressError")
const {campgroundSchema} = require('../schemas')  // Joi schemas
const {isLoggedIn} = require('../middleware')

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

// catchAsync --> function for catching the error , to reduce the repetitive use of try and catch
router.get('/',catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

router.get('/new',isLoggedIn,(req,res) => {
    res.render('campgrounds/new')
})

// populate helps to showcase documents as whole rather than just their objectIds
router.get('/:id',catchAsync(async (req,res) => {
    const {id} = req.params
    const foundCamp = await Campground.findById(id).populate('reviews')
    if(!foundCamp) {
        req.flash('error','No such campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{foundCamp})
}))

router.get('/:id/edit',catchAsync(async (req,res) => {
    const {id} = req.params
    const foundCamp = await Campground.findById(id)
    if(!foundCamp) {
        req.flash('error','No such campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{foundCamp})
}))

// using middleware to first verify input data from form
router.put('/:id',validateCampground,catchAsync(async (req,res) => {
    const {id} = req.params
    const updatedCamp = await Campground.findByIdAndUpdate(id,req.body.campground)
    req.flash('success','Successfully updated the campground')
    res.redirect(`/campgrounds/${updatedCamp.id}`) 
}))

router.post('/',isLoggedIn,validateCampground,catchAsync(async (req,res) => {
    const campground =  new Campground(req.body.campground)
    await campground.save()
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${campground.id}`)
}))

router.delete('/:id',catchAsync(async (req,res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted campground')
    res.redirect("/campgrounds")
}))

module.exports = router