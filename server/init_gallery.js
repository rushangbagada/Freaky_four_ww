const mongoose=require('mongoose');
const Gallery=require('./models/gallery');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;

main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const new_gallery = [
  {
    id: 1,
    title: "Epic Football Finale",
    image: "https://images.unsplash.com/photo-1606851095339-98c0e88e5071?auto=formatfit=cropw=800q=80",
    description: "An electrifying moment captured as players vie for the championship trophy in a thrilling football finale.",
    category: "Football",
    likes: 150,
    views: 1920
  },
  {
    id: 2,
    title: "Slam Dunk Spectacle",
    image: "https://images.unsplash.com/photo-1599058917212-dc596dbe5396?auto=formatfit=cropw=800q=80",
    description: "A powerful slam dunk that had the crowd on their feet, showcasing the raw energy of basketball.",
    category: "Basketball",
    likes: 200,
    views: 2345
  },
  {
    id: 3,
    title: "Tennis Triumph",
    image: "https://images.unsplash.com/photo-1599058916791-57c42a5e15cb?auto=formatfit=cropw=800q=80",
    description: "A moment of victory captured as a player secures an ace during a heated tennis tournament.",
    category: "Tennis",
    likes: 180,
    views: 2100
  },
  {
    id: 4,
    title: "Victory at the Nets",
    image: "https://images.unsplash.com/photo-1613482180640-1706ae24f648?auto=formatfit=cropw=800q=80",
    description: "Players display impeccable teamwork and strategy in a nail-biting volleyball match.",
    category: "Volleyball",
    likes: 170,
    views: 1980
  },
  {
    id: 5,
    title: "Perfect Pitching Moment",
    image: "https://images.unsplash.com/photo-1606851995170-27a12c129cfc?auto=formatfit=cropw=800q=80",
    description: "A snapshot of unparalleled precision as the pitcher delivers a decisive curveball.",
    category: "Baseball",
    likes: 160,
    views: 1750
  },
  {
    id: 6,
    title: "Soccer's Intensity Unleashed",
    image: "https://images.unsplash.com/photo-1606851287863-2f39c2de33b5?auto=formatfit=cropw=800q=80",
    description: "The raw intensity and skill of soccer players evident in every stride and tackle.",
    category: "Soccer",
    likes: 190,
    views: 2200
  }
];



Gallery.insertMany(new_gallery)
.then((res) => console.log(res))
.catch(err => console.log(err));