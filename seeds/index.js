const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers') 

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
   .then(() => console.log("MONGODB connected!!!"))
   .catch(err => console.log(err))

const samples = array => array[Math.floor(Math.random()*array.length)]

//seeding the initial data entries for the web page
const seedDB =  async() => {
    await Campground.deleteMany({})
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*1000)+500;
        const newCamp = new Campground({
            owner:'63b18dc0898e9065aeb8a7b9',
            title:`${samples(descriptors)} ${samples(places)}`,
            location:`${cities[random1000].city},${cities[random1000].state}`,
            description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla delectus cupiditate tempore et! Quidem, soluta? Ad cumque placeat neque ex impedit, laborum, officia sequi pariatur ipsa inventore modi corrupti eos.',
            price,
            images:[
                {
                  url: 'https://res.cloudinary.com/dn8gyag6a/image/upload/v1672668743/YelpCamp/pjhx1ektyeh74ud23zit.jpg',
                  filename: 'YelpCamp/pjhx1ektyeh74ud23zit',
                },
                {
                  url: 'https://res.cloudinary.com/dn8gyag6a/image/upload/v1672668743/YelpCamp/szt69psvhbddtwcvhebd.png',
                  filename: 'YelpCamp/szt69psvhbddtwcvhebd',
                }
            ]
        })
        await newCamp.save()
    }
}
seedDB()
.then(() => mongoose.connection.close())


