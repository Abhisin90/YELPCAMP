const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn,isOwner,validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage });

// catchAsync --> function for catching the error , to reduce the repetitive use of try and catch
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))
 
router.get('/new',isLoggedIn,campgrounds.renderNewForm)

// using middleware to first verify if it is logged in and then check for if it is owner and then verify input data from form
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isOwner,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isOwner,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn,isOwner,catchAsync(campgrounds.renderEditForm))

module.exports = router 