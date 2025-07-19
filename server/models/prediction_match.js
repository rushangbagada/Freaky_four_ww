const mongoose=require('mongoose');

const prediction_matchSchema=new mongoose.Schema({
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
    time:
    {
        type:String,
        required:true
    },
    venue:
    {
        type:String,
        required:true
    },
    category:
    {
        type:String,
        required:true
    },
    status:
    {
        type:String,
        required:true
    }

    
});

const Prediction_match=mongoose.model('Prediction_Match',prediction_matchSchema);
module.exports=Prediction_match;