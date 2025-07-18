const mongoose=require("mongoose")

const clubSchema=new mongoose.Schema({
    name: 
    {
        type:String,
        required:true
    },
    description:
    {
        type:String,
        required:true
    },
    image:
    {
        type:String,
        required:true
    },
    players:
    {
        type:Number,
        required:true
    },
    matches:
    {
        type:Number,
        required:true
    },
    type:
    {
        type:String,
        required:true
    }
    
});

const Club=mongoose.model('Club',clubSchema);
module.exports=Club;