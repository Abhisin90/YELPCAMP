const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const { urlencoded } = require('express')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const ejsMate = require('ejs-mate')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
   .then(() => console.log("MONGODB connected!!!"))
   .catch(err => console.log(err))

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res) => {
    res.send('Home it is')
})

app.get('/campgrounds',async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id', async (req,res) => {
    const {id} = req.params
    const foundCamp = await Campground.findById(id)
    res.render('campgrounds/show',{foundCamp})
})

app.get('/campgrounds/:id/edit',async (req,res) => {
    const {id} = req.params
    const foundCamp = await Campground.findById(id)
    res.render('campgrounds/edit',{foundCamp})
})

app.put('/campgrounds/:id',async (req,res) => {
    const {id} = req.params
    const updatedCamp = await Campground.findByIdAndUpdate(id,req.body.campground)
    res.redirect(`/campgrounds/${updatedCamp.id}`)
})

app.post('/campgrounds',async (req,res) => {
    const campground =  new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
})

app.delete('/campgrounds/:id',async (req,res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
})

app.listen(3000,() => {
    console.log("APP listening on port 3000!!!")
})