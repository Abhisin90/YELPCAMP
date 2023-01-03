const Joi = require('joi')

// Form validation package where it checks for particular input data alongside its conditions to check if they are met or not
module.exports.campgroundSchema = Joi.object({
    campground:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(0),
        description:Joi.string().required(),
        location:Joi.string().required(),
    }).required(),
    deleteImages:Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body:Joi.string().required(),
    }).required()
})
