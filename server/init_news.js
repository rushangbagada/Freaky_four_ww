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
    title: "Basketball Championship Finals: Engineering Eagles Claim Victory in Thrilling Overtime",
    image: "🏀", 
    description: "In a nail-biting championship final, the Engineering Eagles defeated the Business Bears 94-91 in overtime. Kevin Johnson led the Eagles with 28 points, while Michael Davis dominated the boards with 15 rebounds. The victory marks the Eagles' first championship in three years.",
    date: new Date('2024-12-15'),
    category: "Basketball"
  },
  {
    title: "Football Season Concludes with Record-Breaking Attendance and Arts Arrows Championship",
    image: "⚽",
    description: "Over 6,200 spectators witnessed the Arts Arrows defeat the Science Sharks 3-2 in the football championship final. Marcus Thompson scored the winning goal in the 89th minute, completing a remarkable comeback from 2-1 down. The season saw unprecedented fan engagement across all matches.",
    date: new Date('2024-12-10'),
    category: "Football"
  },
  {
    title: "Tennis Excellence: Rafael Martinez and Elena Petrov Dominate Singles Championships",
    image: "🎾",
    description: "The tennis singles championships concluded with spectacular performances from Rafael Martinez and Elena Petrov. Martinez defeated Lucas Chen 6-4, 7-5 in the men's final, while Petrov overcame Sophia Lee 6-3, 6-4 in the women's championship. Both players showcased exceptional court coverage and strategic gameplay.",
    date: new Date('2024-12-08'),
    category: "Tennis"
  },
  {
    title: "Volleyball Powerhouse: Medical Mavericks Secure Third Consecutive Championship",
    image: "🏐",
    description: "The Medical Mavericks completed a historic three-peat by defeating the Law Lions 3-1 in the volleyball championship. Sarah Miller's 18 kills and Emma Garcia's precise setting led the Mavericks to victory. Coach Anderson praised the team's exceptional teamwork and mental fortitude throughout the season.",
    date: new Date('2024-12-05'),
    category: "Volleyball"
  },
  {
    title: "Swimming Sensation: Katie Thompson Breaks Multiple University Records",
    image: "🏊",
    description: "Katie Thompson delivered a record-breaking performance at the annual swimming championship, setting new university records in the 100m and 200m freestyle events. Daniel Kim complemented her performance with a stunning butterfly stroke victory, while the relay teams dominated their respective events.",
    date: new Date('2024-12-03'),
    category: "Swimming"
  },
  {
    title: "Badminton Brilliance: Lin Wei Claims Singles Title in Epic Three-Set Battle",
    image: "🏸",
    description: "Lin Wei from the Computer Cobras emerged victorious in the badminton singles championship after a grueling three-set match against Priya Sharma. The final scores of 21-19, 18-21, 21-17 reflected the intense competition. Wei's aggressive playing style and court awareness proved decisive in the championship point.",
    date: new Date('2024-11-30'),
    category: "Badminton"
  },
  {
    title: "Track and Field Excellence: University Athletes Shine at Regional Championships",
    image: "🏃",
    description: "The university's track and field team delivered outstanding performances at the regional championships. Usain Roberts set a new personal best in the 100m sprint, while Maya Patel dominated the long-distance events. Jordan Smith's high jump victory and Carlos Mendez's shot put triumph completed a remarkable day for the team.",
    date: new Date('2024-11-28'),
    category: "Track & Field"
  },
  {
    title: "Cricket Champions: Engineering Eagles Win Thrilling Final Against Business Bears",
    image: "🏏",
    description: "The Engineering Eagles secured the cricket championship with a 22-run victory over the Business Bears. Rajesh Sharma's all-round performance (67 runs and 4 wickets) earned him the Player of the Match award. Aditya Patel's crucial 45-run partnership with Vikram Singh in the middle overs proved decisive in setting a competitive total.",
    date: new Date('2024-11-25'),
    category: "Cricket"
  },
  {
    title: "State-of-the-Art Aquatic Center Opens with Olympic-Standard Facilities",
    image: "🏟️",
    description: "The newly constructed Aquatic Center opened its doors featuring Olympic-standard swimming pools, diving platforms, and cutting-edge timing systems. The facility includes a 50-meter competition pool, recreational pool, and specialized training areas. Athletic Director Sarah Johnson called it a 'game-changer for our aquatic programs.'",
    date: new Date('2024-11-22'),
    category: "Facilities"
  },
  {
    title: "Hockey Triumph: History Hawks Defeat Medical Mavericks in Championship Thriller",
    image: "🏒",
    description: "The History Hawks claimed their first hockey championship in over a decade with a 4-2 victory over the Medical Mavericks. Connor O'Brien scored twice, including the game-winning goal with 3:45 remaining. Jake Morrison made 28 saves to secure the victory in front of a capacity crowd at the Ice Hockey Rink.",
    date: new Date('2024-11-20'),
    category: "Hockey"
  },
  {
    title: "Table Tennis Mastery: Wang Li Dominates Annual Championship Tournament",
    image: "🏓",
    description: "Wang Li from the Table Tennis Club delivered a masterclass performance, winning the annual championship without dropping a single set. His victories over Anna Volkov in the semifinals and Hiroshi Sato in the final showcased exceptional technique and tactical awareness. The tournament featured 64 participants from across the university.",
    date: new Date('2024-11-18'),
    category: "Table Tennis"
  },
  {
    title: "Multi-Sport Excellence: University Hosts Successful Inter-Collegiate Championship",
    image: "🏆",
    description: "The university successfully hosted the annual Inter-Collegiate Championship, welcoming over 2,000 athletes from 25 institutions. The three-day event featured competitions in 12 different sports, with our teams securing podium finishes in 8 categories. The event generated significant media coverage and showcased our world-class facilities.",
    date: new Date('2024-11-15'),
    category: "Multi-Sport"
  },
  {
    title: "Athletic Scholarship Program Expands with Record $50,000 Fundraising Success",
    image: "💰",
    description: "The annual athletic scholarship fundraising campaign exceeded all expectations, raising over $50,000 through various events including the charity golf tournament, alumni dinner, and corporate sponsorships. The funds will support 15 student-athletes across different sports, ensuring continued excellence in our athletic programs.",
    date: new Date('2024-11-12'),
    category: "Fundraising"
  },
  {
    title: "Sports Medicine Center Launches Cutting-Edge Athlete Wellness Program",
    image: "🏥",
    description: "The Sports Medicine Center unveiled its comprehensive athlete wellness program, featuring advanced injury prevention protocols, nutrition counseling, and mental health support. The program utilizes state-of-the-art equipment for biomechanical analysis and recovery therapy, ensuring optimal performance and well-being for all student-athletes.",
    date: new Date('2024-11-10'),
    category: "Health & Wellness"
  },
  {
    title: "Sustainability Initiative: Sports Complex Goes Carbon Neutral",
    image: "🌱",
    description: "The university's sports complex achieved carbon neutrality through the installation of solar panels, energy-efficient LED lighting, and a comprehensive recycling program. The initiative saves an estimated 200 tons of CO2 annually while reducing operational costs by 30%. This makes us the first carbon-neutral athletic facility in the region.",
    date: new Date('2024-11-08'),
    category: "Sustainability"
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
