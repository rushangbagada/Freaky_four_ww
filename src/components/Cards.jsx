import { useState, useEffect } from 'react'
import Card from './Card'
import './Cards.css'

function Cards(){
    const initialItems = [
        { id: 1, img: '/images/html.png', stat: "" },
        { id: 1, img: '/images/html.png', stat: "" },
        { id: 2, img: '/images/css.png', stat: "" },
        { id: 2, img: '/images/css.png', stat: "" },
        { id: 3, img: '/images/js.png', stat: "" },
        { id: 3, img: '/images/js.png', stat: "" },
        { id: 4, img: '/images/scss.png', stat: "" },
        { id: 4, img: '/images/scss.png', stat: "" },
        { id: 5, img: '/images/react.png', stat: "" },
        { id: 5, img: '/images/react.png', stat: "" },
        { id: 6, img: '/images/vue.png', stat: "" },
        { id: 6, img: '/images/vue.png', stat: "" },
        { id: 7, img: '/images/angular.png', stat: "" },
        { id: 7, img: '/images/angular.png', stat: "" },
        { id: 8, img: '/images/nodejs.png', stat: "" },
        { id: 8, img: '/images/nodejs.png', stat: "" },
        { id: 9, img: '/images/logo1.png', stat: "" },
        { id: 9, img: '/images/logo1.png', stat: "" },
        { id: 10, img: '/images/logo2.png', stat: "" },
        { id: 10, img: '/images/logo2.png', stat: "" },

    ]

    const [items, setItems] = useState(initialItems.sort(() => Math.random() - 0.5))
    const [prev, setPrev] = useState(-1)
    const [time, setTime] = useState(0)
    const [timerActive, setTimerActive] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [gameCompleted, setGameCompleted] = useState(false)
    const [leaderboard, setLeaderboard] = useState(() => {
        const saved = localStorage.getItem('memoryGameLeaderboard')
        return saved ? JSON.parse(saved) : []
    })

    function check(current){
        if(current !== prev && items[current].id == items[prev].id){
            items[current].stat = "correct"
            items[prev].stat = "correct"
            setItems([...items])
            setPrev(-1)
        }else{
            items[current].stat = "wrong"
            items[prev].stat = "wrong"
            setItems([...items])
            setTimeout(() => {
                items[current].stat = ""
                items[prev].stat = ""
                setItems([...items])
                setPrev(-1)
            }, 1000)
        }
    }

    // Timer effect
    useEffect(() => {
        let interval = null
        if (timerActive) {
            interval = setInterval(() => {
                setTime(time => time + 1)
            }, 1000)
        } else if (!timerActive && time !== 0) {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [timerActive, time])

    // Check if game is completed
    useEffect(() => {
        const allCorrect = items.every(item => item.stat === "correct")
        if (allCorrect && gameStarted && !gameCompleted) {
            setTimerActive(false)
            setGameCompleted(true)
            saveScore(time)
        }
    }, [items, gameStarted, gameCompleted, time])

    function saveScore(finalTime) {
        const newScore = { time: finalTime, date: new Date().toLocaleDateString() }
        const updatedLeaderboard = [...leaderboard, newScore]
            .sort((a, b) => a.time - b.time)
            .slice(0, 5) // Keep only top 5
        
        setLeaderboard(updatedLeaderboard)
        localStorage.setItem('memoryGameLeaderboard', JSON.stringify(updatedLeaderboard))
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    function resetGame() {
        const shuffledItems = initialItems.sort(() => Math.random() - 0.5)
        setItems(shuffledItems)
        setPrev(-1)
        setTime(0)
        setTimerActive(false)
        setGameStarted(false)
        setGameCompleted(false)
    }

    function handleClick(id){
        // Start timer on first click
        if (!gameStarted) {
            setGameStarted(true)
            setTimerActive(true)
        }

        if(prev === -1){
            items[id].stat = "active"
            setItems([...items])
            setPrev(id)
        }else{
            check(id)
        }
    }

    return (
        <div className="game-wrapper">
            <div className="game-info">
                <div className="timer">
                    <h3>Time: {formatTime(time)}</h3>
                </div>
                <div className="controls">
                    <button onClick={resetGame} className="reset-btn">New Game</button>
                </div>
                {gameCompleted && (
                    <div className="completion-message">
                        <h2>🎉 Congratulations!</h2>
                        <p>You completed the game in {formatTime(time)}!</p>
                    </div>
                )}
            </div>
            
            <div className="game-content">
                <div className="container">
                    { items.map((item, index) => (
                        <Card key={index} item={item} id={index} handleClick={handleClick} />
                    )) }
                </div>
                
                <div className="leaderboard">
                    <h3>🏆 Best Times</h3>
                    {leaderboard.length > 0 ? (
                        <ol>
                            {leaderboard.map((score, index) => (
                                <li key={index}>
                                    <span className="time">{formatTime(score.time)}</span>
                                    <span>&emsp;</span>
                                    <span className="date">{score.date}</span>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p>No scores yet!</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Cards