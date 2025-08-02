const mongoose=require('mongoose');
const Review=require('./models/review');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;

main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const all_review=[
    {
        name:"Sarah Johnson",
        image:"https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
        position:"CEO, TechCorp Solutions",
        review:"Outstanding service and professionalism. Their team delivered exceptional results that exceeded our expectations and helped transform our business operations."
    },
    {
        name:"Michael Chen",
        image:"https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
        position:"Director of Operations, Global Enterprises",
        review:"Working with this team has been a game-changer for our company. Their expertise and dedication to quality are unmatched in the industry."
    },
    {
        name:"Emily Rodriguez",
        image:"https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
        position:"Marketing Manager, Innovation Labs",
        review:"Incredible attention to detail and customer service. They understood our vision perfectly and delivered results that drove significant growth for our business."
    },
    {
        name:"David Thompson",
        image:"https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
        position:"Founder, StartUp Dynamics",
        review:"Professional, reliable, and innovative. This partnership has been instrumental in scaling our operations and achieving our business objectives efficiently."
    }
]


Review.insertMany(all_review)
.then((res) => console.log(res))
.catch((err) => console.log(err));