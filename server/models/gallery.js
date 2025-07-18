const mongoose=require('mongoose');

const gallerySchema=new mongoose.Schema({
        id: 
        {
            type:Number,
            required:true
        },
        title: 
        {
            type:String,
            required:true
        },
        image: 
        {
            type:String,
            required:true
        },
        description: String,
    
        category:
        {
            type:String,
            required: true
        },
        likes:
        {
            type: Number
        },
        views:
        {
            type:Number
        }
    });
const Gallery=mongoose.model('Gallery',gallerySchema);
module.exports=Gallery
