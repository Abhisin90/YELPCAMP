const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
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