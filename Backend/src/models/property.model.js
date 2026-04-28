const mongoose = require("mongoose");

// const propertySchema = new mongoose.Schema({
//     title:{
//         type: String,
//         required: true
//     },
//     description:{
//         type: String,
//         required: true
//     },
//     location:{
//         type: String,
//         required: true
//     },
//     rent:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "user",
//         required: true
//     },
//     type:{
//         type: String,
//         enum: ["PG", "Hostel", "Flat"],
//         required: true
//     },
//     images:{
//         type: [String],
//         required: true
//     },
//     ownerId:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "user",
//         required: true
//     },
//     availableRooms:{
//         type: Number,
//         required: true
//     },
//     amenities:{
//         type: [String],
//         required: true
//     },
//     status:{
//         type: String,
//         enum: ["Available", "Occupied"],
//         required: true
//     },
//     createdAt:{
//         type: Date,
//         default: Date.now
//     }
// });

const propertySchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    amenities:{
        type: [String],
        required: true
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    images: [{
        title: {
            type: String,
            required: true
        },
        uri: {
            type: String,
            required: true
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
    }],
    availableRooms:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ["Available", "Occupied"],
        default: "Available"
    },
    createdAt:{
        type: Date,
        default: Date.now
    }   
})

const property = mongoose.model("property", propertySchema);
module.exports = property;
