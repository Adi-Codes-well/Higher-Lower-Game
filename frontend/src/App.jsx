// This file should be located at: frontend-tailwind/src/App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Animated Number Component ---
// This component handles the rolling number animation.
const AnimatedNumber = ({ value }) => {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
        let startTime = null;
        const duration = 800; // Animation duration in ms

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Animate from 0 to the target value
            const nextValue = Math.floor(progress * value);
            
            setCurrentValue(nextValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCurrentValue(value); // Ensure it ends on the exact value
            }
        };

        requestAnimationFrame(animate);

    }, [value]); // Reruns the animation whenever the 'value' prop changes

    return <>{currentValue.toLocaleString()}</>;
};


function App() {
    const [itemA, setItemA] = useState(null);
    const [itemB, setItemB] = useState(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    const API_URL = 'http://localhost:5001/api/comparison';

    const fetchComparison = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            if (response.data.itemA.rawScore >= response.data.itemB.rawScore) {
                setItemA(response.data.itemA);
                setItemB(response.data.itemB);
            } else {
                setItemA(response.data.itemB);
                setItemB(response.data.itemA);
            }
        } catch (error) {
            console.error("Error fetching comparison:", error);
            setGameOver(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchComparison();
    }, []);

    const handleGuess = async (guess) => {
        const correct = (guess === 'higher' && itemB.rawScore >= itemA.rawScore) || (guess === 'lower' && itemB.rawScore <= itemA.rawScore);
        
        setIsCorrect(correct);
        setShowResult(true);

        setTimeout(async () => {
            if (correct) {
                setScore(score + 1);
                const newItemA = itemB;
                
                const nextResponse = await axios.get(API_URL);
                const newItemB = nextResponse.data.itemA.name !== newItemA.name ? nextResponse.data.itemA : nextResponse.data.itemB;
                
                const img = new Image();
                img.src = newItemB.imageUrl;
                img.onload = () => {
                    setItemA(newItemA);
                    setItemB(newItemB);
                    setShowResult(false);
                };

            } else {
                setGameOver(true);
            }
        }, 2000); // Increased timeout to allow for number animation
    };

    const restartGame = () => {
        setScore(0);
        setGameOver(false);
        setShowResult(false);
        setIsCorrect(null);
        fetchComparison();
    };
    
    // --- Render Logic ---

    // A reusable card component for displaying the items
    const ComparisonCard = ({ item, children, isWrong }) => (
        <div className={`w-1/2 h-screen bg-slate-800 flex flex-col justify-center items-center text-center p-8 relative overflow-hidden shadow-lg transition-all duration-300 ${isWrong ? 'animate-shake' : ''}`}>
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out transform group-hover:scale-105"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            </div>
            
            <div className="relative z-10 flex flex-col justify-between h-full w-full text-white">
                <div></div> {/* Spacer */}
                <div>
                    <h2 className="text-5xl md:text-6xl font-bold drop-shadow-lg">{item.name}</h2>
                    {children}
                </div>
            </div>
        </div>
    );

    if (gameOver) {
        return (
            <div className="bg-slate-900 text-slate-200 min-h-screen flex items-center justify-center">
                <div className="bg-slate-800 text-white p-10 rounded-2xl shadow-2xl flex flex-col items-center text-center">
                    <h1 className="text-5xl font-bold mb-4">Game Over!</h1>
                    <h2 className="text-3xl mb-6">Your final score is: {score}</h2>
                    <button 
                        onClick={restartGame} 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-transform transform hover:scale-105"
                    >
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    if (loading || !itemA || !itemB) {
        return (
            <div className="bg-slate-900 min-h-screen flex items-center justify-center">
                <h1 className="text-4xl font-bold animate-pulse text-white">Loading Game...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center font-sans">
            <div className="absolute top-5 left-5 bg-black/50 text-white text-3xl font-bold px-6 py-4 rounded-xl shadow-lg z-30">
                Score: {score}
            </div>
            <div className="relative flex w-full h-screen group">
                <ComparisonCard item={itemA}>
                    <p className="text-2xl text-slate-300 mt-2">has</p>
                    <div className="text-6xl md:text-7xl font-extrabold text-white my-2 drop-shadow-md">
                        {itemA.searches.toLocaleString()}
                    </div>
                    <p className="text-2xl text-slate-300">monthly searches</p>
                </ComparisonCard>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white text-slate-900 w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold border-8 border-slate-900">
                    VS
                </div>

                <ComparisonCard item={itemB} isWrong={showResult && isCorrect === false}>
                    {showResult && isCorrect === false && (
                         <div className={`absolute inset-0 flex flex-col justify-center items-center text-white font-bold z-20 transition-opacity duration-300`}>
                           <p className="text-6xl font-extrabold text-red-500 drop-shadow-lg">Wrong!</p>
                           <div className="text-5xl mt-2 drop-shadow-lg">{itemB.searches.toLocaleString()}</div>
                        </div>
                    )}
                    {showResult && isCorrect === true ? (
                        <>
                            <p className="text-2xl text-slate-300 mt-2">has</p>
                            <div className="text-6xl md:text-7xl font-extrabold text-white my-2 drop-shadow-md">
                                <AnimatedNumber value={itemB.searches} />
                            </div>
                            <p className="text-2xl text-slate-300">monthly searches</p>
                        </>
                    ) : (
                        <>
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
                            <p className="text-xl text-slate-300 text-center">monthly searches than {itemA.name}</p>
                        </>
                    )}
                </ComparisonCard>
            </div>
        </div>
    );
}

export default App;
