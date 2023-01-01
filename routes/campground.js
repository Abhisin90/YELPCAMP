const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn,isOwner,validateCampground} = require('../middleware')

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
    const foundCamp = await Campground.findById(id)
    .populate({
        path:'reviews',
        populate:{
            path:'owner'
        }
    }).populate('owner')
    if(!foundCamp) {
        req.flash('error','No such campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{foundCamp})
}))

router.get('/:id/edit',isLoggedIn,isOwner,catchAsync(async (req,res) => {
    const {id} = req.params
    const foundCamp = await Campground.findById(id)
    if(!foundCamp) {
        req.flash('error','No such campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{foundCamp})
}))

// using middleware to first verify input data from form
router.put('/:id',isLoggedIn,isOwner,validateCampground,catchAsync(async (req,res) => {
    const {id} = req.params
    const updatedCamp = await Campground.findByIdAndUpdate(id,req.body.campground)
    req.flash('success','Successfully updated the campground')
    res.redirect(`/campgrounds/${updatedCamp.id}`) 
}))

router.post('/',isLoggedIn,validateCampground,catchAsync(async (req,res) => {
    const campground =  new Campground(req.body.campground)
    campground.owner = req.user._id
    await campground.save()
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${campground.id}`)
}))

router.delete('/:id',isLoggedIn,isOwner,catchAsync(async (req,res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted campground')
    res.redirect("/campgrounds")
}))

module.exports = router