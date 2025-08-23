// This file should be located at: frontend-tailwind/src/App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    // State variables to manage the game's data and flow
    const [itemA, setItemA] = useState(null);
    const [itemB, setItemB] = useState(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    // Backend API URL
    const API_URL = 'http://localhost:5001/api/comparison';

    /**
     * Fetches a new pair of items for comparison from the backend.
     */
    const fetchInitialComparison = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            // Ensure itemA always has a higher or equal score for the first round
            if (response.data.itemA.rawScore >= response.data.itemB.rawScore) {
                setItemA(response.data.itemA);
                setItemB(response.data.itemB);
            } else {
                setItemA(response.data.itemB);
                setItemB(response.data.itemA);
            }
        } catch (error) {
            console.error("Error fetching initial comparison:", error);
            setGameOver(true);
        }
        setLoading(false);
    };

    // Fetch the first comparison when the component mounts
    useEffect(() => {
        fetchInitialComparison();
    }, []);

    /**
     * Handles the player's guess ('higher' or 'lower').
     */
    const handleGuess = async (guess) => {
        const correct = (guess === 'higher' && itemB.rawScore >= itemA.rawScore) || (guess === 'lower' && itemB.rawScore <= itemA.rawScore);
        
        setIsCorrect(correct);
        setShowResult(true);

        // Use a timeout to show the result before moving on
        setTimeout(async () => {
            if (correct) {
                setScore(score + 1);
                setItemA(itemB); // The correct item becomes the new base
                // Fetch a new opponent
                try {
                    const response = await axios.get(API_URL);
                    const newItem = response.data.itemA.name !== itemB.name ? response.data.itemA : response.data.itemB;
                    setItemB(newItem);
                } catch (error) {
                    console.error("Error fetching next comparison:", error);
                    setGameOver(true);
                }
            } else {
                setGameOver(true);
            }
            setShowResult(false);
        }, 1500);
    };

    /**
     * Resets the game state to start over.
     */
    const restartGame = () => {
        setScore(0);
        setGameOver(false);
        setShowResult(false);
        setIsCorrect(null);
        fetchInitialComparison();
    };

    // --- Render Logic ---

    if (gameOver) {
        return (
            <div className="bg-slate-800 text-white p-10 rounded-2xl shadow-2xl flex flex-col items-center">
                <h1 className="text-5xl font-bold mb-4">Game Over!</h1>
                <h2 className="text-3xl mb-6">Your final score is: {score}</h2>
                <button 
                    onClick={restartGame} 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-transform transform hover:scale-105"
                >
                    Play Again
                </button>
            </div>
        );
    }
    
    // Main wrapper for the entire app view
    const AppWrapper = ({ children }) => (
        <div className="bg-slate-900 text-slate-200 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
            {children}
        </div>
    );

    if (loading || !itemA || !itemB) {
        return (
            <AppWrapper>
                <h1 className="text-4xl font-bold animate-pulse">Loading Game...</h1>
            </AppWrapper>
        );
    }

    return (
        <AppWrapper>
            <div className="absolute top-5 left-5 bg-slate-800/80 text-white text-2xl font-bold px-5 py-3 rounded-xl shadow-lg">
                Score: {score}
            </div>
            <div className="relative flex w-full max-w-4xl">
                {/* Left Card */}
                <div className="w-1/2 bg-slate-800 p-8 flex flex-col justify-center items-center rounded-l-2xl shadow-lg">
                    <h2 className="text-4xl font-bold text-white text-center mb-4">{itemA.name}</h2>
                    <p className="text-lg text-slate-400">has</p>
                    <div className="text-6xl font-extrabold text-green-400 my-2">{itemA.searches.toLocaleString()}</div>
                    <p className="text-lg text-slate-400">monthly searches in India.</p>
                </div>

                {/* VS Separator */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white text-slate-900 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold border-8 border-slate-900">
                    VS
                </div>

                {/* Right Card */}
                <div className="w-1/2 bg-slate-800 p-8 flex flex-col justify-center items-center rounded-r-2xl shadow-lg relative overflow-hidden">
                    {showResult && (
                        <div className={`absolute inset-0 flex flex-col justify-center items-center text-white font-bold z-20 transition-transform duration-300 ${isCorrect ? 'bg-green-500/95' : 'bg-red-500/95'}`}>
                           <div className="text-5xl">{itemB.searches.toLocaleString()}</div>
                           <p className="text-3xl mt-2">{isCorrect ? 'Correct!' : 'Wrong!'}</p>
                        </div>
                    )}
                    <h2 className="text-4xl font-bold text-white text-center mb-4">{itemB.name}</h2>
                    <p className="text-lg text-slate-400">has</p>
                    <div className="flex gap-4 my-4">
                        <button 
                            onClick={() => handleGuess('higher')} 
                            disabled={showResult}
                            className="bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105"
                        >
                            Higher
                        </button>
                        <button 
                            onClick={() => handleGuess('lower')} 
                            disabled={showResult}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105"
                        >
                            Lower
                        </button>
                    </div>
                    <p className="text-lg text-slate-400 text-center">monthly searches than {itemA.name}.</p>
                </div>
            </div>
        </AppWrapper>
    );
}

export default App;
