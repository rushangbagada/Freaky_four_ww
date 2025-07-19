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
        name:"player A",
        image:"https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400",
        position:"team A",
        review:"great player"
    },
    {
        name:"player B",
        image:"https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400",
        position:"team B",
        review:"great player"
    },
    {
        name:"player C",
        image:"https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400",
        position:"team C",
        review:"great player"
    },
    {
        name:"player D",
        image:"https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400",
        position:"team D",
        review:"great player"
    }
]


Review.insertMany(all_review)
.then((res) => console.log(res))
.catch((err) => console.log(err));