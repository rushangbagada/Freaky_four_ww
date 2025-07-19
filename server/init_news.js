const mongoose=require('mongoose');
const News=require('./models/news');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;

main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}


const news = [
  {
    title: "Basketball Team Wins Championship",
    image: "🏀", 
    description: "The Engineering Eagles clinch the finals with an outstanding performance.",
    date: new Date(),
    category: "Basketball"
  },
  {
    title: "Football Team Wins Championship",
    image: "⚽",
    description: "The Business Bears emerge victorious in a thrilling match.",
    date: new Date(),
    category: "Football"
  },
  {
    title: "Tennis Team Wins Championship",
    image: "🎾" ,
    description: "Medical Mavericks ace the tournament in straight sets.",
    date: new Date(),
    category: "Tennis"
  },
  {
    title: "Volleyball Team Wins Championship",
    image: "🏐" ,
    description: "Law Lions dominate the court to claim the championship.",
    date: new Date(),
    category: "Volleyball"
  },
  {
    title: "Badminton Team Wins Championship",
    image: "🏸", 
    description: "Arts Arrows smash their way to a clean victory.",
    date: new Date(),
    category: "Badminton"
  }
];

News.insertMany(news)
.then((res) => console.log(res))
.catch((err) => console.log(err));