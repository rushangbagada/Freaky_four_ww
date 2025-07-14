const mongoose=require('mongoose');
const Stats=require('./models/web_stats');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;

main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const all_stats = [
  {
    image: "🏆",
    value: "24",
    label: "Active Sports Teams"
  },
  {
    image: "👥",
    value: "850+",
    label: "Student Athletes"
  },
  {
    image: "🥇",
    value: "47",
    label: "Championships Won"
  },
  {
    image: "🏟️",
    value: "12",
    label: "Sports Facilities"
  }
];


Stats.insertMany(all_stats)
.then((res) => console.log(res))
.catch((err) => console.log(err));


