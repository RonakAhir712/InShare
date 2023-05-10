const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGO_CONNECTION_URL

function connectDB(){
    // DB: mongo online - project 0
    mongoose.connect(url,{}).then(()=>{
        console.log("DB connected");
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports = connectDB