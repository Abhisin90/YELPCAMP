const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
   .then(() => console.log("MONGODB connected!!!"))
   .catch(err => console.log(err))

const samples = array => array[Math.floor(Math.random()*array.length)]

const seedDB =  async() => {
    await Campground.deleteMany({})
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000)
        const newCamp = new Campground({
            title:`${samples(descriptors)} ${samples(places)}`,
            location:`${cities[random1000].city},${cities[random1000].state}`,
        })
        await newCamp.save()
    }
}
seedDB()
.then(() => mongoose.connection.close())


