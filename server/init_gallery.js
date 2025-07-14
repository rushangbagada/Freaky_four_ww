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
    title: "Football",
    image: "https://images.unsplash.com/photo-1606851095339-98c0e88e5071?auto=format&fit=crop&w=800&q=80",
    description: "Exciting football match moment",
    category: "Football",
    likes: 0,
    views: 0
  },
  {
    id: 2,
    title: "Basketball",
    image: "https://images.unsplash.com/photo-1599058917212-dc596dbe5396?auto=format&fit=crop&w=800&q=80",
    description: "High-flying slam dunk",
    category: "Basketball",
    likes: 0,
    views: 0
  },
  {
    id: 3,
    title: "Tennis",
    image: "https://images.unsplash.com/photo-1599058916791-57c42a5e15cb?auto=format&fit=crop&w=800&q=80",
    description: "Tennis court action",
    category: "Tennis",
    likes: 0,
    views: 0
  },
  {
    id: 4,
    title: "Volleyball",
    image: "https://images.unsplash.com/photo-1613482180640-1706ae24f648?auto=format&fit=crop&w=800&q=80",
    description: "Teamwork at the net",
    category: "Volleyball",
    likes: 0,
    views: 0
  },
  {
    id: 5,
    title: "Baseball",
    image: "https://images.unsplash.com/photo-1606851995170-27a12c129cfc?auto=format&fit=crop&w=800&q=80",
    description: "Pitching perfection",
    category: "Baseball",
    likes: 0,
    views: 0
  },
  {
    id: 6,
    title: "Soccer",
    image: "https://images.unsplash.com/photo-1606851287863-2f39c2de33b5?auto=format&fit=crop&w=800&q=80",
    description: "Intense soccer play",
    category: "Soccer",
    likes: 0,
    views: 0
  }
];



Gallery.insertMany(new_gallery)
.then((res) => console.log(res))
.catch(err => console.log(err));