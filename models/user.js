const mongoose = require('mongoose')
const {Schema} = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

UserSchema.plugin(passportLocalMongoose)  // insert username and password in the schema

module.exports = mongoose.model('User',UserSchema)


