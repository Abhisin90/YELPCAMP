const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require("./utils/ExpressError")
const campgrounds = require('./routes/campground')
const reviews = require('./routes/review')
const session = require('express-session')
const flash = require('connect-flash')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
   .then(() => console.log("MONGODB connected!!!"))
   .catch(err => console.log(err))

app.engine('ejs',ejsMate)   // for using boilerplate for all pages
app.set('view engine','ejs')  // for setting the dynamic templating to be ejs format
app.set('views',path.join(__dirname,'views'))  // for setting the views directory accessible from any directory
app.use(methodOverride('_method'))     // middleware for using https method other than Get,Post
app.use(express.urlencoded({extended:true})) // built in middleware for form-data
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret:'thiswasagoodsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

// success flash
app.use((req,res,next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

// routes
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)

// crud functionality requests
app.get('/',(req,res) => {
    res.send('Home it is')
})

// for paths other than required
app.all('*',(req,res,next) => {
    next(new ExpressError('Page not Found',404))
})

// error handling middleware
app.use((err,req,res,next) => {
    const {statusCode=500} = err
    if(!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error',{err})
})

app.listen(3000,() => {
    console.log("APP listening on port 3000!!!")
})