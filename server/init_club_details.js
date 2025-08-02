const mongoose=require('mongoose');
const Club_Details=require('./models/club-detail');
const express=require('express');
const app=express();
const port=process.env.PORT || 5000;


main()
.then(() => app.listen(port, () => console.log(`Server is listening on port ${port}`)))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sports-hub');
}

const ClubDetails = [
    {
        name: "Football Club",
        description: "Our premier football club is dedicated to developing skilled players through rigorous training and competitive play. With a focus on teamwork, discipline, and athletic excellence, we compete in both inter-collegiate and regional tournaments. Join us to experience the beautiful game at its finest.",
        image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        upcoming_matches: 8,
        active_players: 25,
        win_rate: 78
    },
    {
        name: "Cricket Club",
        description: "The Cricket Club represents the pinnacle of strategic gameplay and athletic prowess. Our team combines traditional cricket values with modern techniques, competing in various formats from T20 to Test matches. We pride ourselves on nurturing both batting and bowling talents while maintaining the highest standards of sportsmanship.",
        image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        upcoming_matches: 6,
        active_players: 22,
        win_rate: 82
    },
    {
        name: "Basketball Club",
        description: "Fast-paced, dynamic, and electrifying - our Basketball Club embodies the spirit of competitive basketball. We focus on developing complete players with strong fundamentals, court vision, and team chemistry. Our training programs emphasize both offensive creativity and defensive intensity.",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        upcoming_matches: 12,
        active_players: 18,
        win_rate: 75
    },
    {
        name: "Volleyball Club",
        description: "The Volleyball Club combines power, precision, and teamwork in every match. Our players develop exceptional hand-eye coordination, strategic thinking, and lightning-fast reflexes. We compete in both indoor and beach volleyball formats, fostering a culture of continuous improvement and mutual support.",
        image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        upcoming_matches: 10,
        active_players: 16,
        win_rate: 71
    },
    {
        name: "Tennis Club",
        description: "Excellence in tennis begins with precision, strategy, and mental fortitude. Our Tennis Club provides comprehensive training in all aspects of the game, from powerful serves to delicate drop shots. We compete in singles and doubles tournaments, emphasizing both individual skill development and doubles partnership.",
        image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        upcoming_matches: 15,
        active_players: 24,
        win_rate: 80
    },
    {
        name: "Hockey Club",
        description: "The Hockey Club represents speed, skill, and strategic gameplay on the field. Our team focuses on developing stick skills, field awareness, and tactical understanding of the game. We participate in both field hockey and indoor hockey competitions, maintaining a tradition of competitive excellence and team spirit.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        upcoming_matches: 7,
        active_players: 20,
        win_rate: 73
    },
    {
        name: "Swimming Club",
        description: "Dive into excellence with our Swimming Club, where endurance meets technique in perfect harmony. Our swimmers train across all strokes and distances, from sprint events to endurance challenges. We emphasize proper form, breathing techniques, and mental preparation for competitive swimming success.",
        image: "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        upcoming_matches: 9,
        active_players: 28,
        win_rate: 85
    },
    {
        name: "Badminton Club",
        description: "The Badminton Club focuses on agility, precision, and tactical gameplay. Our players develop lightning-fast reflexes, strategic shot placement, and court coverage skills. We compete in singles, doubles, and mixed doubles events, fostering both individual excellence and partnership dynamics.",
        image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        upcoming_matches: 11,
        active_players: 26,
        win_rate: 77
    },
    {
        name: "Track & Field Club",
        description: "Run, jump, and throw your way to athletic excellence with our Track & Field Club. We specialize in developing athletes across sprints, distance running, jumping events, and throwing disciplines. Our comprehensive training programs focus on speed, strength, technique, and mental toughness.",
        image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        upcoming_matches: 5,
        active_players: 32,
        win_rate: 79
    },
    {
        name: "Table Tennis Club",
        description: "Experience the fast-paced world of table tennis with our dedicated club. We focus on developing quick reflexes, spin techniques, and strategic gameplay. Our players compete in various tournaments, mastering both offensive and defensive playing styles while maintaining the highest level of competitive spirit.",
        image: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        upcoming_matches: 14,
        active_players: 21,
        win_rate: 74
    }
]


Club_Details.insertMany(ClubDetails)
.then((res) => console.log(res))
.catch(err => console.log(err));