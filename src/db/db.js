const mongoose = require("mongoose");

async function connectDB(){
    await mongoose.connect(process.env.DB_URI)
    .then(()=>{
        console.log("Database connected");
    }).catch((error)=>{
        console.log("Error in db connection",error);
    })
}

module.exports = connectDB;