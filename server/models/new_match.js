const mongoose=require('mongoose');

const   New_matchSchema=new mongoose.Schema({
    id:
    {
        type:Number,
        required:true
    },
    team1:
    {
        type:String,
        required:true
    },
    team2:
    {
        type:String,
        required:true
    },
    date:
    {
        type:Date,
        required:true
    },
    venue:
    {
        type:String,
        required:true
    },
    time:
    {
        type:String,
        required:true
    },
    category:
    {
        type:String,
        required:true
    }
});

const New_match=mongoose.model('New_match',New_matchSchema);
module.exports=New_match;