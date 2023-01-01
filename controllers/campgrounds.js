const Campground = require('../models/campground')

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new')
}

// populate helps to showcase documents as whole rather than just their objectIds
module.exports.createCampground = async (req,res) => {
    const campground =  new Campground(req.body.campground)
    campground.owner = req.user._id
    await campground.save()
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${campground.id}`)
}

module.exports.showCampground = async (req,res) => {
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
}

module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params
    const foundCamp = await Campground.findById(id)
    if(!foundCamp) {
        req.flash('error','No such campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{foundCamp})
}

module.exports.updateCampground = async (req,res) => {
    const {id} = req.params
    const updatedCamp = await Campground.findByIdAndUpdate(id,req.body.campground)
    req.flash('success','Successfully updated the campground')
    res.redirect(`/campgrounds/${updatedCamp.id}`) 
}

module.exports.deleteCampground = async (req,res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted campground')
    res.redirect("/campgrounds")
}