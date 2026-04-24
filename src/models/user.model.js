const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },  
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["owner", "tenant"],
        default: "tenant"
    }
}, {timestamps:true});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;