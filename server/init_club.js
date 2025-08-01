const mongoose=require('mongoose');
const Club=require('./models/club');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;


main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const all_clubs=[
    {
        name:"football",
        description:"Description",
        image:"https://images.unsplash.com/photo-1519389950473-47ba8d0ef82c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        players:10,
        matches:5,
        type:"Team Sports"
    },
    {
        name:"basketball",
        description:"Description",
image:"https://yourdomain.com/path-to-real-basketball-image.jpg",
        players:17,
        matches:9,
        type:"Racket Sports"
    },
    {
        name:"tennis",
        description:"Description",
        image:"https://images.unsplash.com/photo-1519389950473-47ba8d0ef82c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        players:45,
        matches:8,
        type:"Racket Sports"
    },
    {
        name:"volleyball",
        description:"Description",
        image:"https://images.unsplash.com/photo-1519389950473-47ba8d0ef82c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        players:54,
        matches:6,
        type:"Individual Sports"
    },
    {
        name:"cricket",
        description:"Description",
        image:"https://images.unsplash.com/photo-1519389950473-47ba8d0ef82c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        players:14,
        matches:7,
        type:"Team Sports"
    }
]

Club.insertMany(all_clubs)
.then((res) => {
    console.log(res);
})
.catch((err) => {
    console.log(err);
})