import { useState, useEffect } from 'react'
import './App.css'
import bronze from "./assets/bronze.png";
import silver from "./assets/silver.png";
import gold from "./assets/gold.png";
import platinum from "./assets/platinum.png";
import diamond from "./assets/diamond.png";
import champion from "./assets/champion.png";

type EloData = {
    _id: string;
    name: string;
    elo: number;
    gamesPlayed: number;
    gamesWon: number;
    gamesWonBySink: number;
    professionalsPlayed: number;
    professionalsWon: number;

}

function App() {
    const [activeTab, setActiveTab] = useState<'home' | 'submit' | 'leaderboards'>('home')
    const [data, setData] = useState<EloData[]>([]);
    const [selectedNameOne, setSelectedNameOne] = useState<string>();
    const [scoreOne, setScoreOne] = useState<number>(5);
    const [selectedNameTwo, setSelectedNameTwo] = useState<string>();
    const [scoreTwo, setScoreTwo] = useState<number>(5);

    const handleSubmit = () => {
        const payload = {
            scoreOne,
            scoreTwo,
            selectedNameOne,
            selectedNameTwo
        };

        fetch('https://192.168.1.101:3000/data', {
            method: 'POST', // Use POST to send data
            headers: {
                'Content-Type': 'application/json', // Tell server we're sending JSON
            },
            body: JSON.stringify(payload), // Convert JS object to JSON string
        });
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    useEffect(() => {
        fetch("https://192.168.1.101:3000/data")
            .then((res) => res.json())
            .then((json: EloData[]) => setData(json))
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <>
                        <h1>Asig Pong Server</h1>
                        <p>Submit games under submit tab</p>
                        <p>View top brothers under leaderboards</p>
                    </>
                )
            case 'submit':
                return (
                    <>
                        <p>Player 1</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item._id}
                                        onClick={() => setSelectedNameOne(item.name)}
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: selectedNameOne === item.name ? "#2E2E2E" : "#242424",
                                        }}
                                    >
                                        <td>{item.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p> Player 1 Score</p>
                        <p>{scoreOne}</p>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            value={scoreOne}
                            onChange={(e) => setScoreOne(Number(e.target.value))}
                        />

                        <hr />

                        <p>Player 2</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item._id}
                                        onClick={() => setSelectedNameTwo(item.name)}
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: selectedNameTwo === item.name ? "#2E2E2E" : "#242424",
                                        }}
                                    >
                                        <td>{item.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p> Player 2 Score</p>
                        <p>{scoreTwo}</p>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            value={scoreTwo}
                            onChange={(e) => setScoreTwo(Number(e.target.value))}
                        />

                        <hr />

                        <button onClick={handleSubmit}>Submit</button>
                    </>
                )
            case 'leaderboards':
                return (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>Elo</th>
                                    <th>Games Played</th>
                                    <th>Games Won</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice().sort((a, b) => b.elo - a.elo).map((item, index) => {
                                    let rankImg = "";
                                    const num = Math.round(item.elo);
                                    if (num < 850) {
                                        rankImg = bronze;
                                    } else if (num < 950) {
                                        rankImg = silver;
                                    } else if (num < 1050) {
                                        rankImg = gold
                                    } else if (num < 1150) {
                                        rankImg = platinum;
                                    } else if (num < 1250) {
                                        rankImg = diamond;
                                    } else if (num >= 1250) {
                                        rankImg = champion;
                                    }
                                    return (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img
                                                    src={rankImg}
                                                    alt="rank"
                                                    style={{ width: "24px", height: "24px" }}
                                                />
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{num}</td>
                                            <td>{item.gamesPlayed}</td>
                                            <td>{item.gamesWon}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )
            default:
                return null
        }
    }

    const tabs = [
        { id: 'home', label: 'Home' },
        { id: 'submit', label: 'Submit' },
        { id: 'leaderboards', label: 'Leaderboards' },
    ]

    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', borderBottom: '2px solid #ccc' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'home' | 'submit' | 'leaderboards')}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '3px solid blue' : '3px solid transparent',
                            background: 'none',
                            cursor: 'pointer',
                            fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div style={{ padding: '20px' }}>{renderTabContent()}</div>
        </div>
    )
}

export default App
