const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url:String,
    filename:String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_200')
})

ImageSchema.virtual('original').get(function() {
    return this.url.replace('/upload','/upload/w_600,h_400,c_lfill')
})

const CampgroundSchema = new Schema({
    title:String,
    images:[ImageSchema],
    price:Number,
    description:String,
    location:String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

// this middleware is triggered only when findByIdAndDelete is used to delete campground
CampgroundSchema.post('findOneAndDelete',async function(foundCamp) {
   if(foundCamp) {
    await Review.deleteMany({
        _id:{
            $in:foundCamp.reviews
        }
    })
   }
})

module.exports = mongoose.model('Campground',CampgroundSchema)