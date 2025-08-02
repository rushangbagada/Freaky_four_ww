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
        name:"Sarah Chen",
        email:"sarah.chen@techcorp.com",
        total_point:950,
        prediction:"Q4 revenue will exceed $2.5M target by 15%",
        accuracy:0.92,
        wins:23,
        streak:8,
        badges:["📈","🎯","💎"]
    },
    {
        id:2,
        name:"Michael Rodriguez",
        email:"m.rodriguez@analytics.pro",
        total_point:875,
        prediction:"Market volatility will decrease by 20% next quarter",
        accuracy:0.88,
        wins:19,
        streak:5,
        badges:["📊","🔍","⭐"]
    },
    {
        id:3,
        name:"Emma Thompson",
        email:"emma.t@businessinsights.com",
        total_point:820,
        prediction:"Customer retention rate will improve to 85%",
        accuracy:0.85,
        wins:17,
        streak:3,
        badges:["🎯","💼","🚀"]
    },
    {
        id:4,
        name:"David Park",
        email:"david.park@strategicdata.io",
        total_point:765,
        prediction:"Technology sector will outperform by 12%",
        accuracy:0.81,
        wins:15,
        streak:2,
        badges:["💻","📈","🎖️"]
    },
    {
        id:5,
        name:"Jennifer Walsh",
        email:"j.walsh@marketpredictions.net",
        total_point:690,
        prediction:"E-commerce growth rate will stabilize at 18%",
        accuracy:0.78,
        wins:12,
        streak:1,
        badges:["🛒","📊","🏅"]
    }
]

Prediction_user.insertMany(all_prediction_user)
.then((res) => console.log(res))
.catch((err) => console.log(err));