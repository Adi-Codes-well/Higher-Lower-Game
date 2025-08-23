import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Animated Number Component ---
const AnimatedNumber = ({ value }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    const duration = 800;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const nextValue = Math.floor(progress * value);

      setCurrentValue(nextValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{currentValue.toLocaleString()}</>;
};

// --- Main App ---
function App() {
  const [itemA, setItemA] = useState(null);
  const [itemB, setItemB] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [madeLeaderboard, setMadeLeaderboard] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  const fetchLeaderboard = async () => {
    try {
        const response = await axios.get(`${API_URL}/leaderboard`);
        setLeaderboard(response.data);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
  };

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/comparison`);
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
    fetchLeaderboard();
  }, []);

  const handleGuess = async (guess) => {
    const correct =
      (guess === "higher" && itemB.rawScore >= itemA.rawScore) ||
      (guess === "lower" && itemB.rawScore <= itemA.rawScore);

    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(async () => {
      if (correct) {
        setScore(score + 1);
        const newItemA = itemB;

        const nextResponse = await axios.get(`${API_URL}/comparison`);
        const newItemB =
          nextResponse.data.itemA.name !== newItemA.name
            ? nextResponse.data.itemA
            : nextResponse.data.itemB;

        const img = new Image();
        img.src = newItemB.imageUrl;
        img.onload = () => {
          setItemA(newItemA);
          setItemB(newItemB);
          setShowResult(false);
        };
      } else {
        const lowestLeaderboardScore = leaderboard.length < 5 ? 0 : leaderboard[leaderboard.length - 1].score;
        if (score > lowestLeaderboardScore) {
            setMadeLeaderboard(true);
        } else {
            setGameOver(true);
        }
      }
    }, 2000);
  };

  const handleNewHighScore = async (name) => {
      try {
          await axios.post(`${API_URL}/leaderboard`, { name, score });
          fetchLeaderboard(); // Refresh leaderboard
      } catch (error) {
          console.error("Error submitting high score:", error);
      }
      setMadeLeaderboard(false);
      setGameOver(true);
  };

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    setShowResult(false);
    setIsCorrect(null);
    fetchComparison();
  };

  // --- Components ---
  const ComparisonCard = ({ item, children, isWrong }) => (
    <div
      className={`w-1/2 h-screen relative flex flex-col justify-center items-center text-center overflow-hidden transition-all duration-500 ${
        isWrong ? "animate-shake" : ""
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-110 blur-sm brightness-75"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      <div className="relative z-10 flex flex-col justify-center items-center px-6 py-8">
        <h2 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg text-white mb-4">
          {item.name}
        </h2>
        {children}
      </div>
    </div>
  );

  if (madeLeaderboard) {
    return (
        <NewHighScoreScreen
            score={score}
            onSubmit={handleNewHighScore}
        />
    );
  }

  if (gameOver) {
    return (
      <GameOverScreen
        score={score}
        leaderboard={leaderboard}
        onRestart={restartGame}
      />
    );
  }

  if (loading || !itemA || !itemB) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold animate-pulse text-white">
          Loading Game...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans relative">
      <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white text-2xl font-bold px-6 py-3 rounded-full shadow-lg z-30 border border-white/10">
        Score: {score}
      </div>
      {leaderboard.length > 0 && (
          <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md text-white text-lg font-bold px-5 py-2 rounded-full shadow-lg z-30 border border-white/10 text-center">
              Top Score <br />
              <span className="font-extrabold text-xl">{leaderboard[0].score} by {leaderboard[0].name}</span>
          </div>
      )}

      <div className="relative flex w-full h-screen">
        <ComparisonCard item={itemA}>
          <p className="text-2xl text-slate-300">has</p>
          <div className="text-6xl md:text-7xl font-extrabold text-white my-4">
            {itemA.searches.toLocaleString()}
          </div>
          <p className="text-2xl text-slate-300">monthly searches</p>
        </ComparisonCard>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white text-slate-900 w-28 h-28 rounded-full flex items-center justify-center text-4xl font-extrabold border-8 border-slate-900 shadow-xl">
          VS
        </div>

        <ComparisonCard item={itemB} isWrong={showResult && isCorrect === false}>
          {showResult && !isCorrect && (
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white font-bold z-20 transition-opacity duration-500 bg-black/60 backdrop-blur-md">
              <p className="text-6xl font-extrabold text-red-500 drop-shadow-lg">
                Wrong!
              </p>
              <div className="text-4xl mt-4 drop-shadow-lg">
                {itemB.searches.toLocaleString()} searches
              </div>
            </div>
          )}

          {showResult && isCorrect ? (
            <>
              <p className="text-2xl text-slate-300">has</p>
              <div className="text-6xl md:text-7xl font-extrabold text-white my-4">
                <AnimatedNumber value={itemB.searches} key={itemB.name} />
              </div>
              <p className="text-2xl text-slate-300">monthly searches</p>
            </>
          ) : (
            <>
              <div className="flex gap-6 mt-6">
                <button onClick={() => handleGuess("higher")} disabled={showResult} className="bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl text-xl transition-transform transform hover:scale-105 shadow-md">
                  Higher
                </button>
                <button onClick={() => handleGuess("lower")} disabled={showResult} className="bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl text-xl transition-transform transform hover:scale-105 shadow-md">
                  Lower
                </button>
              </div>
              <p className="text-lg text-slate-300 mt-4">
                monthly searches than{" "}
                <span className="font-semibold text-white">{itemA.name}</span>
              </p>
            </>
          )}
        </ComparisonCard>
      </div>
    </div>
  );
}

// --- New High Score Screen ---
const NewHighScoreScreen = ({ score, onSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
        }
    };

    return (
        <div className="bg-gradient-to-br from-green-800 via-green-700 to-black min-h-screen flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-lg p-12 rounded-3xl shadow-2xl text-center text-white w-[90%] max-w-md">
                <h1 className="text-5xl font-bold mb-4 text-yellow-300">Congratulations!</h1>
                <h2 className="text-3xl mb-6">
                    You've made it onto the leaderboard with a score of <span className="text-yellow-300 font-extrabold">{score}</span>!
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name to claim your spot"
                        className="w-full bg-black/20 text-white text-center text-lg px-4 py-3 rounded-lg mb-6 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    />
                    <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-8 py-4 text-lg font-bold rounded-xl shadow-md transition-transform transform hover:scale-105">
                        Submit to Leaderboard
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Game Over Screen ---
const GameOverScreen = ({ score, leaderboard, onRestart }) => (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg p-12 rounded-3xl shadow-2xl text-center text-white w-[90%] max-w-md">
            <h1 className="text-5xl font-bold mb-4">Game Over!</h1>
            <h2 className="text-3xl mb-6">
                Your final score is: <span className="text-blue-400 font-extrabold">{score}</span>
            </h2>
            <div className="text-xl mb-8">
                <h3 className="text-2xl font-bold text-yellow-300 mb-4">Global Leaderboard</h3>
                {leaderboard.length > 0 ? (
                    <ol className="text-left">
                        {leaderboard.map((entry, index) => (
                            <li key={entry._id} className="text-lg mb-2 flex justify-between">
                                <span>{index + 1}. {entry.name}</span>
                                <span className="font-bold">{entry.score}</span>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p>No scores yet. Be the first!</p>
                )}
            </div>
            <button
                onClick={onRestart}
                className="bg-blue-500 hover:bg-blue-600 px-8 py-4 text-lg font-bold rounded-xl shadow-md transition-transform transform hover:scale-105"
            >
                Play Again
            </button>
        </div>
    </div>
);

export default App;