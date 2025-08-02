const mongoose=require('mongoose');
const News=require('./models/news');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;

main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('\nPlease ensure MongoDB is installed and running:');
    console.log('1. Download from: https://www.mongodb.com/try/download/community');
    console.log('2. Install with default settings');
    console.log('3. Start the MongoDB service');
    console.log('4. Run this script again');
    process.exit(1);
  }
}


const news = [
  {
    title: "Inter-College Basketball Championship Finals Set for This Weekend",
    image: "🏀", 
    description: "The top four teams from different colleges will compete in the most anticipated basketball championship of the year. Engineering Eagles face off against Business Bears in what promises to be an electrifying semifinal match.",
    date: new Date('2024-08-01'),
    category: "Basketball"
  },
  {
    title: "Football Season Kicks Off with Record-Breaking Attendance",
    image: "⚽",
    description: "Over 5,000 spectators gathered to witness the opening match between Medical Mavericks and Law Lions. The atmosphere was electric as both teams showcased exceptional skill and determination.",
    date: new Date('2024-07-30'),
    category: "Football"
  },
  {
    title: "Tennis Doubles Tournament Sees Unprecedented Competition",
    image: "🎾",
    description: "Sixteen pairs from eight different colleges participated in the annual doubles championship. The Arts Arrows duo dominated the courts with their strategic gameplay and powerful serves.",
    date: new Date('2024-07-28'),
    category: "Tennis"
  },
  {
    title: "Volleyball Team Prepares for National Championships",
    image: "🏐",
    description: "After winning the regional championship, our volleyball team is now preparing for the national competition. Coach Johnson reports that the team has been training intensively for the past month.",
    date: new Date('2024-07-25'),
    category: "Volleyball"
  },
  {
    title: "Swimming Records Broken at Annual Aquatic Meet",
    image: "🏊",
    description: "Three new college records were set during the annual swimming championship. Sarah Mitchell broke the 100m freestyle record, while the men's relay team set a new benchmark in the 4x100m event.",
    date: new Date('2024-07-23'),
    category: "Swimming"
  },
  {
    title: "Badminton Singles Champion Emerges After Intense Final",
    image: "🏸",
    description: "The badminton singles final went to three sets before Mike Chen from Science Spartans emerged victorious. The match lasted over two hours and kept spectators on the edge of their seats.",
    date: new Date('2024-07-20'),
    category: "Badminton"
  },
  {
    title: "Track and Field Athletes Qualify for State Competition",
    image: "🏃",
    description: "Five of our track and field athletes have qualified for the state-level competition after impressive performances at the regional meet. The 400m relay team posted their best time of the season.",
    date: new Date('2024-07-18'),
    category: "Track & Field"
  },
  {
    title: "Cricket Team Wins Inter-University Trophy",
    image: "🏏",
    description: "After a thrilling final match that went into overtime, our cricket team has secured the Inter-University Trophy. Captain James Rodriguez led from the front with a match-winning performance.",
    date: new Date('2024-07-15'),
    category: "Cricket"
  },
  {
    title: "New Sports Facility Opens with State-of-the-Art Equipment",
    image: "🏟️",
    description: "The newly constructed multi-purpose sports complex opened its doors today, featuring modern gym equipment, indoor courts, and a regulation-size swimming pool. The facility will serve all student athletes.",
    date: new Date('2024-07-12'),
    category: "Facilities"
  },
  {
    title: "Women's Soccer Team Advances to Championship Final",
    image: "⚽",
    description: "The women's soccer team defeated the defending champions 3-1 in a spectacular semifinal match. Star player Emma Thompson scored two goals, leading her team to their first final in five years.",
    date: new Date('2024-07-10'),
    category: "Soccer"
  },
  {
    title: "Golf Tournament Raises Funds for Athletic Scholarships",
    image: "⛳",
    description: "The annual charity golf tournament raised over $25,000 for athletic scholarships. More than 100 participants, including alumni and local business leaders, contributed to this successful fundraising event.",
    date: new Date('2024-07-08'),
    category: "Golf"
  },
  {
    title: "Esports Team Qualifies for National Gaming Championship",
    image: "🎮",
    description: "Our esports team has qualified for the national championship after winning the regional tournament in League of Legends. The team will compete against 15 other universities for the national title.",
    date: new Date('2024-07-05'),
    category: "Esports"
  }
];

// First, clear all existing news data
async function clearAndInsertNews() {
  try {
    console.log('Clearing existing news data...');
    const deleteResult = await News.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing news items`);
    
    console.log('Inserting new news data...');
    const insertResult = await News.insertMany(news);
    console.log(`Successfully inserted ${insertResult.length} new news items`);
    
    return insertResult;
  } catch (error) {
    console.error('Error updating news data:', error);
    throw error;
  }
}

clearAndInsertNews()
.then((res) => console.log('News data updated successfully!'))
.catch((err) => console.log('Error:', err));
