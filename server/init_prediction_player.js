const mongoose=require('mongoose');
const Prediction_user=require('./models/prediction_user');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;

main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://rushang:rushi198@rushang.vtkbz.mongodb.net');
}

const all_prediction_user=[
    {
        id:1,
        name:"Sachin Tendulkar",
        email:"4H2Z0@example.com",
        total_point:80,
        prediction:"India won the match",
        accuracy:0.8,
        wins:1,
        streak:1,
        badges:["🏆","🎯","⚡"]
    },
    {
        id:2,
        name:"Sachin Tendulkar",
        email:"4H2Z0@example.com",
        total_point:80,
        prediction:"India won the match",
        accuracy:0.8,
        wins:1,
        streak:1,
        badges:["🏆","🎯","⚡"]
    },
    {
        id:3,
        name:"Sachin Tendulkar",
        email:"4H2Z0@example.com",
        total_point:80,
        prediction:"India won the match",
        accuracy:0.8,
        wins:1,
        streak:1,
        badges:["🏆","🎯","⚡"]
    },
    {
        id:4,
        name:"Sachin Tendulkar",
        email:"4H2Z0@example.com",
        total_point:80,
        prediction:"India won the match",
        accuracy:0.8,
        wins:1,
        streak:1,
        badges:["🏆","🎯","⚡"]
    },
    {
        id:5,
        name:"Sachin Tendulkar",
        email:"4H2Z0@example.com",
        total_point:80,
        prediction:"India won the match",
        accuracy:0.8,
        wins:1,
        streak:1,
        badges:["🏆","🎯","⚡"]
    }
]

Prediction_user.insertMany(all_prediction_user)
.then((res) => console.log(res))
.catch((err) => console.log(err));