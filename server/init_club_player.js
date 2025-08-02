const mongoose=require('mongoose');
const Club_Player=require('./models/club-player');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;


main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const all_club_players=[
    // Football Club Players
    {
        name: "Marcus Thompson",
        year: "Third Year",
        position: "Striker",
        department: "Computer Science Engineering",
        matches: 45,
        wins: 38,
        losses: 7,
        club: "Football Club"
    },
    {
        name: "David Rodriguez",
        year: "Fourth Year",
        position: "Goalkeeper",
        department: "Sports Management",
        matches: 42,
        wins: 35,
        losses: 7,
        club: "Football Club"
    },
    {
        name: "James Wilson",
        year: "Second Year",
        position: "Midfielder",
        department: "Business Administration",
        matches: 38,
        wins: 29,
        losses: 9,
        club: "Football Club"
    },
    {
        name: "Alex Mitchell",
        year: "Third Year",
        position: "Defender",
        department: "Mechanical Engineering",
        matches: 41,
        wins: 32,
        losses: 9,
        club: "Football Club"
    },
    
    // Cricket Club Players
    {
        name: "Rajesh Sharma",
        year: "Fourth Year",
        position: "All-rounder",
        department: "Electronics Engineering",
        matches: 35,
        wins: 29,
        losses: 6,
        club: "Cricket Club"
    },
    {
        name: "Aditya Patel",
        year: "Third Year",
        position: "Batsman",
        department: "Information Technology",
        matches: 33,
        wins: 27,
        losses: 6,
        club: "Cricket Club"
    },
    {
        name: "Vikram Singh",
        year: "Second Year",
        position: "Fast Bowler",
        department: "Civil Engineering",
        matches: 31,
        wins: 25,
        losses: 6,
        club: "Cricket Club"
    },
    {
        name: "Rohit Kumar",
        year: "Fourth Year",
        position: "Wicket Keeper",
        department: "Computer Science Engineering",
        matches: 34,
        wins: 28,
        losses: 6,
        club: "Cricket Club"
    },
    
    // Basketball Club Players
    {
        name: "Kevin Johnson",
        year: "Third Year",
        position: "Point Guard",
        department: "Sports Science",
        matches: 52,
        wins: 39,
        losses: 13,
        club: "Basketball Club"
    },
    {
        name: "Michael Davis",
        year: "Fourth Year",
        position: "Center",
        department: "Kinesiology",
        matches: 48,
        wins: 36,
        losses: 12,
        club: "Basketball Club"
    },
    {
        name: "Chris Anderson",
        year: "Second Year",
        position: "Shooting Guard",
        department: "Marketing",
        matches: 44,
        wins: 33,
        losses: 11,
        club: "Basketball Club"
    },
    {
        name: "Tyler Brown",
        year: "Third Year",
        position: "Power Forward",
        department: "Exercise Science",
        matches: 46,
        wins: 34,
        losses: 12,
        club: "Basketball Club"
    },
    
    // Volleyball Club Players
    {
        name: "Sarah Miller",
        year: "Third Year",
        position: "Outside Hitter",
        department: "Physical Education",
        matches: 38,
        wins: 27,
        losses: 11,
        club: "Volleyball Club"
    },
    {
        name: "Emma Garcia",
        year: "Fourth Year",
        position: "Setter",
        department: "Health Sciences",
        matches: 36,
        wins: 26,
        losses: 10,
        club: "Volleyball Club"
    },
    {
        name: "Ashley Taylor",
        year: "Second Year",
        position: "Libero",
        department: "Psychology",
        matches: 35,
        wins: 25,
        losses: 10,
        club: "Volleyball Club"
    },
    {
        name: "Megan White",
        year: "Third Year",
        position: "Middle Blocker",
        department: "Nursing",
        matches: 37,
        wins: 26,
        losses: 11,
        club: "Volleyball Club"
    },
    
    // Tennis Club Players
    {
        name: "Rafael Martinez",
        year: "Fourth Year",
        position: "Singles Specialist",
        department: "Sports Management",
        matches: 28,
        wins: 22,
        losses: 6,
        club: "Tennis Club"
    },
    {
        name: "Elena Petrov",
        year: "Third Year",
        position: "Doubles Expert",
        department: "International Business",
        matches: 26,
        wins: 21,
        losses: 5,
        club: "Tennis Club"
    },
    {
        name: "Lucas Chen",
        year: "Second Year",
        position: "All-Court Player",
        department: "Economics",
        matches: 24,
        wins: 19,
        losses: 5,
        club: "Tennis Club"
    },
    {
        name: "Sophia Lee",
        year: "Fourth Year",
        position: "Baseline Player",
        department: "Pre-Law",
        matches: 27,
        wins: 22,
        losses: 5,
        club: "Tennis Club"
    },
    
    // Hockey Club Players
    {
        name: "Connor O'Brien",
        year: "Third Year",
        position: "Forward",
        department: "Sports Medicine",
        matches: 32,
        wins: 23,
        losses: 9,
        club: "Hockey Club"
    },
    {
        name: "Jake Morrison",
        year: "Fourth Year",
        position: "Goalie",
        department: "Physical Therapy",
        matches: 30,
        wins: 22,
        losses: 8,
        club: "Hockey Club"
    },
    {
        name: "Ryan Campbell",
        year: "Second Year",
        position: "Defenseman",
        department: "Engineering",
        matches: 29,
        wins: 21,
        losses: 8,
        club: "Hockey Club"
    },
    {
        name: "Ethan Parker",
        year: "Third Year",
        position: "Midfielder",
        department: "Recreation Management",
        matches: 31,
        wins: 23,
        losses: 8,
        club: "Hockey Club"
    },
    
    // Swimming Club Players
    {
        name: "Katie Thompson",
        year: "Fourth Year",
        position: "Freestyle Specialist",
        department: "Exercise Physiology",
        matches: 22,
        wins: 19,
        losses: 3,
        club: "Swimming Club"
    },
    {
        name: "Daniel Kim",
        year: "Third Year",
        position: "Butterfly Stroke",
        department: "Biomedical Engineering",
        matches: 20,
        wins: 17,
        losses: 3,
        club: "Swimming Club"
    },
    {
        name: "Rachel Green",
        year: "Second Year",
        position: "Backstroke",
        department: "Marine Biology",
        matches: 21,
        wins: 18,
        losses: 3,
        club: "Swimming Club"
    },
    {
        name: "Mark Johnson",
        year: "Fourth Year",
        position: "Individual Medley",
        department: "Sports Science",
        matches: 23,
        wins: 20,
        losses: 3,
        club: "Swimming Club"
    },
    
    // Badminton Club Players
    {
        name: "Lin Wei",
        year: "Third Year",
        position: "Singles Player",
        department: "Computer Engineering",
        matches: 31,
        wins: 24,
        losses: 7,
        club: "Badminton Club"
    },
    {
        name: "Priya Sharma",
        year: "Fourth Year",
        position: "Doubles Specialist",
        department: "International Relations",
        matches: 29,
        wins: 22,
        losses: 7,
        club: "Badminton Club"
    },
    {
        name: "Ahmed Hassan",
        year: "Second Year",
        position: "Mixed Doubles",
        department: "Mechanical Engineering",
        matches: 28,
        wins: 21,
        losses: 7,
        club: "Badminton Club"
    },
    {
        name: "Yuki Tanaka",
        year: "Third Year",
        position: "All-Round Player",
        department: "Business Administration",
        matches: 30,
        wins: 23,
        losses: 7,
        club: "Badminton Club"
    },
    
    // Track & Field Club Players
    {
        name: "Usain Roberts",
        year: "Fourth Year",
        position: "Sprinter",
        department: "Exercise Science",
        matches: 15,
        wins: 12,
        losses: 3,
        club: "Track & Field Club"
    },
    {
        name: "Maya Patel",
        year: "Third Year",
        position: "Long Distance Runner",
        department: "Health Sciences",
        matches: 14,
        wins: 11,
        losses: 3,
        club: "Track & Field Club"
    },
    {
        name: "Jordan Smith",
        year: "Second Year",
        position: "High Jumper",
        department: "Sports Medicine",
        matches: 13,
        wins: 10,
        losses: 3,
        club: "Track & Field Club"
    },
    {
        name: "Carlos Mendez",
        year: "Fourth Year",
        position: "Shot Put",
        department: "Physical Education",
        matches: 16,
        wins: 13,
        losses: 3,
        club: "Track & Field Club"
    },
    
    // Table Tennis Club Players
    {
        name: "Wang Li",
        year: "Third Year",
        position: "Offensive Player",
        department: "Mathematics",
        matches: 42,
        wins: 31,
        losses: 11,
        club: "Table Tennis Club"
    },
    {
        name: "Anna Volkov",
        year: "Fourth Year",
        position: "Defensive Specialist",
        department: "Physics",
        matches: 40,
        wins: 30,
        losses: 10,
        club: "Table Tennis Club"
    },
    {
        name: "Hiroshi Sato",
        year: "Second Year",
        position: "All-Round Player",
        department: "Engineering",
        matches: 38,
        wins: 28,
        losses: 10,
        club: "Table Tennis Club"
    },
    {
        name: "Isabella Garcia",
        year: "Third Year",
        position: "Counter-Attacker",
        department: "Chemistry",
        matches: 41,
        wins: 30,
        losses: 11,
        club: "Table Tennis Club"
    }
]

const all_players = all_club_players.map(player => ({
  ...player,
  win_rate: player.matches === 0 ? 0 : parseFloat(((player.wins / player.matches) * 100).toFixed(2))
}));


Club_Player.insertMany(all_players)
.then((res) => console.log(res))
.catch((err) => console.log(err));