const mongoose=require('mongoose');

const user_scoreSchema=new mongoose.Schema({
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
    totalPoints:
    {
        type:Number,
        required:true
    },
    predictions:
    {
        type:Number,
        required:true
    },
    wins:
    {
        type:Number,
        required:true
    },
    accuracy:
    {
        type:Number,
        required:true
    },
    streak:
    {
        type:Number,
        required:true
    },
    badges:
    {
        type:[String],
        required:true
    },
    
});

const User_score=mongoose.model('User_score',user_scoreSchema);
module.exports=User_score;