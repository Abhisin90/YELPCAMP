const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type:'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML':'{{#label}} must not be in HTML!'
    },
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const cleansedValue=sanitizeHtml(value,{
                    allowedTags:[],
                    allowedAttributes:{}
                });
                if(cleansedValue !== value)  return helpers.error('string.escapeHTML',{value});
                return value;
            }
        }
    }

})

Joi = BaseJoi.extend(extension)

// Form validation package where it checks for particular input data alongside its conditions to check if they are met or not
module.exports.campgroundSchema = Joi.object({
    campground:Joi.object({
        title:Joi.string().required().escapeHTML(),
        price:Joi.number().required().min(0),
        description:Joi.string().required().escapeHTML(),
        location:Joi.string().required().escapeHTML()
    }).required(),
    deleteImages:Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body:Joi.string().required().escapeHTML()
    }).required()
})
