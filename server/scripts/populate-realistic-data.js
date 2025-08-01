const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Club_player = require('../models/club-player');
const Match = require('../models/match');
const New_match = require('../models/new_match');
const News = require('../models/news');
const Gallery = require('../models/gallery');

// Generate realistic player data
const generateRealisticPlayers = () => {
  const indianNames = [
    // Basketball players
    { first: 'Arjun', last: 'Sharma' }, { first: 'Priya', last: 'Patel' }, { first: 'Vikash', last: 'Kumar' },
    { first: 'Sneha', last: 'Singh' }, { first: 'Rohit', last: 'Verma' }, { first: 'Ananya', last: 'Gupta' },
    { first: 'Karan', last: 'Mehta' }, { first: 'Riya', last: 'Jain' }, { first: 'Aman', last: 'Yadav' },
    { first: 'Pooja', last: 'Reddy' }, { first: 'Siddharth', last: 'Agarwal' }, { first: 'Kavya', last: 'Nair' },
    
    // Football players
    { first: 'Rahul', last: 'Dravid' }, { first: 'Sakshi', last: 'Malik' }, { first: 'Hardik', last: 'Pandya' },
    { first: 'Deepika', last: 'Kumari' }, { first: 'Virat', last: 'Kohli' }, { first: 'Saina', last: 'Nehwal' },
    { first: 'Suresh', last: 'Raina' }, { first: 'PV', last: 'Sindhu' }, { first: 'Jasprit', last: 'Bumrah' },
    { first: 'Mirabai', last: 'Chanu' }, { first: 'Shikhar', last: 'Dhawan' }, { first: 'Mary', last: 'Kom' },
    
    // Cricket players
    { first: 'Ajinkya', last: 'Rahane' }, { first: 'Smriti', last: 'Mandhana' }, { first: 'Cheteshwar', last: 'Pujara' },
    { first: 'Harmanpreet', last: 'Kaur' }, { first: 'Rishabh', last: 'Pant' }, { first: 'Jemimah', last: 'Rodrigues' },
    { first: 'Shreyas', last: 'Iyer' }, { first: 'Shafali', last: 'Verma' }, { first: 'KL', last: 'Rahul' },
    { first: 'Taniya', last: 'Bhatia' }, { first: 'Mayank', last: 'Agarwal' }, { first: 'Radha', last: 'Yadav' },
    
    // Tennis players
    { first: 'Leander', last: 'Paes' }, { first: 'Sania', last: 'Mirza' }, { first: 'Rohan', last: 'Bopanna' },
    { first: 'Ankita', last: 'Raina' }, { first: 'Divij', last: 'Sharan' }, { first: 'Karman', last: 'Kaur' },
    
    // Swimming players
    { first: 'Srihari', last: 'Nataraj' }, { first: 'Maana', last: 'Patel' }, { first: 'Sajan', last: 'Prakash' },
    { first: 'Kenisha', last: 'Gupta' }, { first: 'Advait', last: 'Page' }, { first: 'Damini', last: 'Gowda' },
    
    // Badminton players
    { first: 'Kidambi', last: 'Srikanth' }, { first: 'Carolina', last: 'Marin' }, { first: 'HS', last: 'Prannoy' },
    { first: 'Ashwini', last: 'Ponnappa' }, { first: 'Sameer', last: 'Verma' }, { first: 'Rituparna', last: 'Das' }
  ];

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'Electrical', 'Information Technology', 'Biotechnology'];
  const years = ['first year', 'second year', 'third year', 'final year'];

  const basketballPositions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];
  const footballPositions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Striker', 'Winger'];
  const cricketPositions = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper', 'Captain'];
  const tennisPositions = ['Singles Player', 'Doubles Player', 'Mixed Doubles'];
  const swimmingPositions = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Medley'];
  const badmintonPositions = ['Singles Player', 'Doubles Player', 'Mixed Doubles'];

  const players = [];
  let nameIndex = 0;

  // Basketball Club (8 players)
  for (let i = 0; i < 8; i++) {
    const name = indianNames[nameIndex++];
    players.push({
      name: `${name.first} ${name.last}`,
      year: years[Math.floor(Math.random() * years.length)],
      position: basketballPositions[i % basketballPositions.length],
      department: departments[Math.floor(Math.random() * departments.length)],
      matches: Math.floor(Math.random() * 20) + 10,
      wins: Math.floor(Math.random() * 15) + 5,
      losses: Math.floor(Math.random() * 8) + 2,
      win_rate: Math.floor(Math.random() * 30) + 60,
      club: 'Basketball Club'
    });
  }

  // Football Club (11 players - realistic team size)
  for (let i = 0; i < 11; i++) {
    const name = indianNames[nameIndex++];
    players.push({
      name: `${name.first} ${name.last}`,
      year: years[Math.floor(Math.random() * years.length)],
      position: footballPositions[i % footballPositions.length],
      department: departments[Math.floor(Math.random() * departments.length)],
      matches: Math.floor(Math.random() * 25) + 12,
      wins: Math.floor(Math.random() * 18) + 7,
      losses: Math.floor(Math.random() * 6) + 1,
      win_rate: Math.floor(Math.random() * 25) + 65,
      club: 'Football Club'
    });
  }

  // Cricket Club (11 players - realistic team size)
  for (let i = 0; i < 11; i++) {
    const name = indianNames[nameIndex++];
    players.push({
      name: `${name.first} ${name.last}`,
      year: years[Math.floor(Math.random() * years.length)],
      position: cricketPositions[i % cricketPositions.length],
      department: departments[Math.floor(Math.random() * departments.length)],
      matches: Math.floor(Math.random() * 18) + 8,
      wins: Math.floor(Math.random() * 12) + 4,
      losses: Math.floor(Math.random() * 7) + 2,
      win_rate: Math.floor(Math.random() * 28) + 62,
      club: 'Cricket Club'
    });
  }

  // Tennis Club (6 players)
  for (let i = 0; i < 6; i++) {
    const name = indianNames[nameIndex++];
    players.push({
      name: `${name.first} ${name.last}`,
      year: years[Math.floor(Math.random() * years.length)],
      position: tennisPositions[i % tennisPositions.length],
      department: departments[Math.floor(Math.random() * departments.length)],
      matches: Math.floor(Math.random() * 16) + 8,
      wins: Math.floor(Math.random() * 10) + 4,
      losses: Math.floor(Math.random() * 6) + 2,
      win_rate: Math.floor(Math.random() * 25) + 60,
      club: 'Tennis Club'
    });
  }

  // Swimming Club (8 players)
  for (let i = 0; i < 8; i++) {
    const name = indianNames[nameIndex++];
    players.push({
      name: `${name.first} ${name.last}`,
      year: years[Math.floor(Math.random() * years.length)],
      position: swimmingPositions[i % swimmingPositions.length],
      department: departments[Math.floor(Math.random() * departments.length)],
      matches: Math.floor(Math.random() * 14) + 6,
      wins: Math.floor(Math.random() * 8) + 3,
      losses: Math.floor(Math.random() * 5) + 1,
      win_rate: Math.floor(Math.random() * 30) + 58,
      club: 'Swimming Club'
    });
  }

  // Badminton Club (6 players) - Note: database has "Badminton " with trailing space
  for (let i = 0; i < 6; i++) {
    const name = indianNames[nameIndex++];
    players.push({
      name: `${name.first} ${name.last}`,
      year: years[Math.floor(Math.random() * years.length)],
      position: badmintonPositions[i % badmintonPositions.length],
      department: departments[Math.floor(Math.random() * departments.length)],
      matches: Math.floor(Math.random() * 15) + 7,
      wins: Math.floor(Math.random() * 9) + 3,
      losses: Math.floor(Math.random() * 6) + 2,
      win_rate: Math.floor(Math.random() * 28) + 58,
      club: 'Badminton '
    });
  }

  return players;
};

// Generate realistic match data
const generateRealisticMatches = () => {
  const today = new Date();
  const getPastDate = (daysAgo) => {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    return date;
  };

  const getFutureDate = (daysFromNow) => {
    const date = new Date(today);
    date.setDate(today.getDate() + daysFromNow);
    return date;
  };

  const venues = {
    Basketball: ['Main Basketball Court', 'Indoor Sports Complex', 'College Gymnasium', 'Sports Arena'],
    Football: ['Football Ground', 'Main Football Stadium', 'College Football Field', 'Sports Complex Ground'],
    Cricket: ['Cricket Ground', 'Main Cricket Stadium', 'College Cricket Field', 'Sports Ground'],
    Tennis: ['Tennis Court 1', 'Tennis Court 2', 'Indoor Tennis Complex', 'College Tennis Courts'],
    Swimming: ['Swimming Pool', 'Olympic Pool', 'College Aquatic Center', 'Indoor Pool Complex'],
    Badminton: ['Badminton Hall', 'Indoor Sports Complex', 'College Badminton Courts', 'Sports Arena']
  };

  const collegeNames = [
    'Engineering College', 'Medical College', 'Arts College', 'Science College', 
    'Commerce College', 'Law College', 'Management College', 'Technical Institute',
    'Polytechnic College', 'Agricultural College', 'Architecture College'
  ];

  const recentMatches = [];
  const upcomingMatches = [];

  // Generate realistic recent matches (past 3 months)
  const sports = ['Basketball', 'Football', 'Cricket', 'Tennis', 'Swimming', 'Badminton'];
  
  sports.forEach((sport, sportIndex) => {
    // 3-5 recent matches per sport
    const matchCount = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < matchCount; i++) {
      const daysAgo = Math.floor(Math.random() * 90) + 7; // 7-97 days ago
      const team1Score = sport === 'Cricket' ? Math.floor(Math.random() * 100) + 150 :
                        sport === 'Basketball' ? Math.floor(Math.random() * 40) + 70 :
                        sport === 'Football' ? Math.floor(Math.random() * 4) + 1 :
                        sport === 'Tennis' ? Math.floor(Math.random() * 2) + 6 :
                        sport === 'Swimming' ? Math.floor(Math.random() * 5) + 8 :
                        Math.floor(Math.random() * 5) + 18; // Badminton
      
      const team2Score = sport === 'Cricket' ? Math.floor(Math.random() * 80) + 120 :
                        sport === 'Basketball' ? Math.floor(Math.random() * 35) + 65 :
                        sport === 'Football' ? Math.floor(Math.random() * 3) + 0 :
                        sport === 'Tennis' ? Math.floor(Math.random() * 2) + 4 :
                        sport === 'Swimming' ? Math.floor(Math.random() * 4) + 5 :
                        Math.floor(Math.random() * 4) + 15; // Badminton

      const playerNames = ['Arjun Sharma', 'Priya Patel', 'Vikash Kumar', 'Rahul Dravid', 'Saina Nehwal', 'Leander Paes', 'Srihari Nataraj'];
      
      recentMatches.push({
        team1: `${sport} Team A`,
        team2: collegeNames[Math.floor(Math.random() * collegeNames.length)],
        date: getPastDate(daysAgo),
        venue: venues[sport][Math.floor(Math.random() * venues[sport].length)],
        category: sport,
        team1_score: team1Score,
        team2_score: team2Score,
        mvp: playerNames[Math.floor(Math.random() * playerNames.length)]
      });
    }
  });

  // Generate realistic upcoming matches (next 3 months)
  sports.forEach((sport, sportIndex) => {
    // 4-6 upcoming matches per sport
    const matchCount = Math.floor(Math.random() * 3) + 4;
    for (let i = 0; i < matchCount; i++) {
      const daysFromNow = Math.floor(Math.random() * 90) + 3; // 3-93 days from now
      const times = ['2:00 PM', '3:30 PM', '4:00 PM', '5:00 PM', '6:30 PM', '10:00 AM', '11:30 AM'];
      
      upcomingMatches.push({
        id: 2000 + (sportIndex * 10) + i,
        team1: `${sport} Club`,
        team2: collegeNames[Math.floor(Math.random() * collegeNames.length)],
        date: getFutureDate(daysFromNow),
        venue: venues[sport][Math.floor(Math.random() * venues[sport].length)],
        time: times[Math.floor(Math.random() * times.length)],
        category: sport
      });
    }
  });

  return { recentMatches, upcomingMatches };
};

// Generate realistic news data
const generateRealisticNews = () => {
  const newsItems = [
    {
      title: "Basketball Championship Victory!",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
      description: "Our Basketball team dominated the inter-college championship with an outstanding 89-76 victory against Engineering College. Arjun Sharma led the team with 28 points and 12 rebounds in a spectacular performance.",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      category: "Basketball"
    },
    {
      title: "Football Team Advances to Finals",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80",
      description: "In a thrilling semi-final match, our Football Club secured a 3-1 victory over Medical College. Rahul Dravid scored twice while Hardik Pandya added another goal to seal the win.",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      category: "Football"
    },
    {
      title: "Cricket Club's Stunning Comeback",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
      description: "Down by 89 runs at one point, our Cricket team staged an incredible comeback to defeat Arts College by 15 runs. Ajinkya Rahane's unbeaten 78 and Smriti Mandhana's 4 wickets were the highlights.",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      category: "Cricket"
    },
    {
      title: "Tennis Team Wins Doubles Championship",
      image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80",
      description: "Leander Paes and Sania Mirza clinched the inter-college doubles championship defeating the Science College pair 6-4, 7-5 in the finals. This marks their third consecutive title.",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      category: "Tennis"
    },
    {
      title: "Swimming Records Broken at State Meet",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
      description: "Srihari Nataraj set a new state record in 100m backstroke with a time of 56.23 seconds. Maana Patel also secured gold in 50m freestyle, leading our swimming team to overall victory.",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      category: "Swimming"
    },
    {
      title: "Badminton Team Dominates League",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
      description: "Kidambi Srikanth and HS Prannoy led our Badminton team to a clean sweep in the inter-college league. The team won all matches without dropping a single set throughout the tournament.",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      category: "Badminton"
    },
    {
      title: "Annual Sports Day Celebrations",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      description: "The college celebrated its annual sports day with various competitions and exhibitions. Over 500 students participated in events ranging from athletics to esports, making it the biggest sports celebration yet.",
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
      category: "General"
    },
    {
      title: "New Sports Complex Inauguration",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
      description: "The college inaugurated its new state-of-the-art sports complex featuring modern equipment, indoor courts, and a swimming pool. The facility will boost training capabilities for all sports teams.",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      category: "Infrastructure"
    }
  ];

  return newsItems;
};

// Generate realistic gallery data
const generateRealisticGallery = () => {
  const galleryItems = [
    {
      id: 1,
      title: "Basketball Championship Final",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
      description: "Intense moment from the championship final where our team secured victory",
      category: "Basketball",
      likes: Math.floor(Math.random() * 150) + 50,
      views: Math.floor(Math.random() * 2000) + 500
    },
    {
      id: 2,
      title: "Football Team Strategy Session",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80",
      description: "Pre-match team huddle before the semi-final victory",
      category: "Football",
      likes: Math.floor(Math.random() * 120) + 40,
      views: Math.floor(Math.random() * 1800) + 400
    },
    {
      id: 3,
      title: "Cricket Match Winning Moment",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
      description: "The winning shot that secured our comeback victory",
      category: "Cricket",
      likes: Math.floor(Math.random() * 200) + 60,
      views: Math.floor(Math.random() * 2500) + 600
    },
    {
      id: 4,
      title: "Tennis Doubles Champions",
      image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80",
      description: "Victory celebration after winning the doubles championship",
      category: "Tennis",
      likes: Math.floor(Math.random() * 100) + 30,
      views: Math.floor(Math.random() * 1500) + 300
    },
    {
      id: 5,
      title: "Swimming Record Breaking Performance",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
      description: "Historic moment as new state record was set in backstroke",
      category: "Swimming",
      likes: Math.floor(Math.random() * 180) + 70,
      views: Math.floor(Math.random() * 2200) + 800
    },
    {
      id: 6,
      title: "Badminton League Victory",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
      description: "Team celebration after dominating the inter-college league",
      category: "Badminton",
      likes: Math.floor(Math.random() * 90) + 25,
      views: Math.floor(Math.random() * 1200) + 200
    },
    {
      id: 7,
      title: "Sports Day Opening Ceremony",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      description: "Grand opening ceremony of the annual sports day celebrations",
      category: "Events",
      likes: Math.floor(Math.random() * 250) + 100,
      views: Math.floor(Math.random() * 3000) + 1000
    },
    {
      id: 8,
      title: "New Sports Complex",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
      description: "State-of-the-art facilities in our newly inaugurated sports complex",
      category: "Infrastructure",
      likes: Math.floor(Math.random() * 300) + 150,
      views: Math.floor(Math.random() * 4000) + 1500
    },
    {
      id: 9,
      title: "Team Training Session",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      description: "Intense training session preparing for upcoming championships",
      category: "Training",
      likes: Math.floor(Math.random() * 80) + 20,
      views: Math.floor(Math.random() * 1000) + 150
    },
    {
      id: 10,
      title: "Victory Celebration",
      image: "https://images.unsplash.com/photo-1552318965-6e6be7484ada?auto=format&fit=crop&w=800&q=80",
      description: "Team celebrating after a series of successful matches",
      category: "Celebration",
      likes: Math.floor(Math.random() * 400) + 200,
      views: Math.floor(Math.random() * 5000) + 2000
    }
  ];

  return galleryItems;
};

async function populateRealisticData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB successfully');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Club_player.deleteMany({});
    await Match.deleteMany({});
    await New_match.deleteMany({});
    await News.deleteMany({});
    await Gallery.deleteMany({});
    
    // Generate and insert realistic players
    console.log('👥 Generating realistic players...');
    const players = generateRealisticPlayers();
    const playersResult = await Club_player.insertMany(players);
    console.log(`✅ Successfully inserted ${playersResult.length} players`);
    
    // Generate and insert realistic matches
    console.log('⚽ Generating realistic matches...');
    const { recentMatches, upcomingMatches } = generateRealisticMatches();
    
    const recentResult = await Match.insertMany(recentMatches);
    console.log(`✅ Successfully inserted ${recentResult.length} recent matches`);
    
    const upcomingResult = await New_match.insertMany(upcomingMatches);
    console.log(`✅ Successfully inserted ${upcomingResult.length} upcoming matches`);
    
    // Generate and insert realistic news
    console.log('📰 Generating realistic news...');
    const news = generateRealisticNews();
    const newsResult = await News.insertMany(news);
    console.log(`✅ Successfully inserted ${newsResult.length} news items`);
    
    // Generate and insert realistic gallery
    console.log('🖼️ Generating realistic gallery...');
    const gallery = generateRealisticGallery();
    const galleryResult = await Gallery.insertMany(gallery);
    console.log(`✅ Successfully inserted ${galleryResult.length} gallery items`);
    
    // Show news and gallery summary
    const totalNews = await News.countDocuments();
    const totalGallery = await Gallery.countDocuments();
    console.log(`\n📰 News Items: ${totalNews}`);
    console.log(`🖼️ Gallery Items: ${totalGallery}`);
    
    // Show summary by club/sport
    console.log('\n📊 DATA SUMMARY:');
    const clubs = ['Basketball Club', 'Football Club', 'Cricket Club', 'Tennis Club', 'Swimming Club', 'Badminton '];
    const sports = ['Basketball', 'Football', 'Cricket', 'Tennis', 'Swimming', 'Badminton'];
    
    for (let i = 0; i < clubs.length; i++) {
      const club = clubs[i];
      const sport = sports[i];
      
      const clubPlayers = await Club_player.find({ club }).countDocuments();
      const sportRecentMatches = await Match.find({ category: sport }).countDocuments();
      const sportUpcomingMatches = await New_match.find({ category: sport }).countDocuments();
      
      console.log(`🏆 ${club}:`);
      console.log(`   Players: ${clubPlayers}`);
      console.log(`   Recent Matches: ${sportRecentMatches}`);
      console.log(`   Upcoming Matches: ${sportUpcomingMatches}`);
    }
    
    // Show some sample data
    console.log('\n🎯 SAMPLE DATA:');
    const samplePlayer = await Club_player.findOne({ club: 'Basketball Club' });
    console.log(`Sample Player: ${samplePlayer.name} - ${samplePlayer.position} (${samplePlayer.matches} matches, ${samplePlayer.wins} wins)`);
    
    const sampleRecentMatch = await Match.findOne({ category: 'Basketball' });
    console.log(`Sample Recent Match: ${sampleRecentMatch.team1} vs ${sampleRecentMatch.team2} (${sampleRecentMatch.team1_score}-${sampleRecentMatch.team2_score})`);
    
    const sampleUpcomingMatch = await New_match.findOne({ category: 'Basketball' });
    console.log(`Sample Upcoming Match: ${sampleUpcomingMatch.team1} vs ${sampleUpcomingMatch.team2} on ${sampleUpcomingMatch.date.toDateString()}`);
    
  } catch (error) {
    console.error('❌ Error populating realistic data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

populateRealisticData();
