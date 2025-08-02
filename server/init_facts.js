const mongoose=require('mongoose');
const Facts=require('./models/facts');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;

main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const sampleFacts = [
  {
    id: 1,
    title: "Wrestling: The Ancient Tradition",
    description: "Wrestling is revered as the world's oldest competitive sport, dating back to ancient Mesopotamia around 3000 BC.",
    image: "🤼",
    category: "Ancient Sports",
    date: new Date('3000-01-01')
  },
  {
    id: 2,
    title: "Tennis Serve Record",
    description: "Sam Groth holds the record for the fastest tennis serve ever recorded at a blistering speed of 263.4 km/h (163.7 mph) in 2012.",
    image: "🎾",
    category: "Tennis",
    date: new Date('2012-05-09')
  },
  {
    id: 3,
    title: "Global Passion for Football",
    description: "Football, known as soccer in some countries, is the most played and watched sport worldwide, boasting millions of fans across continents.",
    image: "⚽",
    category: "Global Sports",
    date: new Date('1863-10-26')
  },
  {
    id: 4,
    title: "Basketball's Olympic Journey",
    description: "Basketball made its grand debut as an Olympic sport in Berlin, Germany, during the 1936 Summer Olympics, greatly enhancing its international prominence.",
    image: "🏀",
    category: "Olympics",
    date: new Date('1936-08-01')
  },
  {
    id: 5,
    title: "Marathon Tennis Match",
    description: "The longest tennis match in history spanned 11 hours and 5 minutes, played over three days during the 2010 Wimbledon Championships.",
    image: "⏱️",
    category: "Records",
    date: new Date('2010-06-22')
  }
];

Facts.insertMany(sampleFacts)
.then((res) => console.log(res))
.catch((err) => console.log(err));