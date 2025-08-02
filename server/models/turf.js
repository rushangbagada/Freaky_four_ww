const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema({
    id:
    {
        type:Number,
        required:true
    },
    name:
    {
        type:String,
        required:true
    },
    location:
    {
        type:String,
        required:true
    },
    price:
    {
        type:Number,
        required:true
    },
    imageUrl:
    {
        type:String,
        required:true
    },
    availability:
    {
        type:Boolean,
        required:true
    }
});

const Turf = mongoose.model('Turf', turfSchema);
module.exports = Turf;