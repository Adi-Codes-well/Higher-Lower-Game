require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { getJson } = require("google-search-results-nodejs");

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

const KEYWORDS = ["IPL", "Bollywood", "Narendra Modi", "Paneer Tikka", "Diwali", "Samosa", "Taj Mahal", "Virat Kohli", "Yoga", "Monsoon"];

// --- Helper Functions ---
const getRandomKeyword = (exclude = null) => {
    let keyword;
    do {
        keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
    } while (keyword === exclude);
    return keyword;
};

const getAverageInterest = (timelineData) => {
    const totalInterest = timelineData.reduce((sum, dataPoint) => sum + dataPoint.values[0].extracted_value, 0);
    return totalInterest / timelineData.length;
};

//scaling formula
const scaleToFakeSearches = (score) => {
    // Simple linear scale: a score of 100 becomes ~1,000,000
    return Math.round(score * 10000);
};

app.get('/api/comparison', async (req, res) => {
    try {
        const keyword1 = getRandomKeyword();
        const keyword2 = getRandomKeyword(keyword1);

        // API call to SerpApi for Google Trends
        const response = await getJson({
            engine: "google_trends",
            q: `${keyword1}, ${keyword2}`,
            geo: "IN", // Geo-location set to India
            data_type: "TIMESERIES",
            time: "today 12-m", // Timeframe set to last 12 months
            api_key: process.env.SERPAPI_KEY
        });

        const interestOverTime = response.interest_over_time;

        // Find the data for each keyword
        const data1 = interestOverTime.timeline_data.filter(d => d.values[0].query === keyword1);
        const data2 = interestOverTime.timeline_data.filter(d => d.values[0].query === keyword2);

        // Calculate the average raw score (0-100)
        const score1 = getAverageInterest(data1);
        const score2 = getAverageInterest(data2);

        // Create the response object for the frontend
        const comparison = {
            itemA: {
                name: keyword1,
                // We send the "fake" scaled number to the frontend
                searches: scaleToFakeSearches(score1), 
                // We also keep the raw score for internal comparison
                rawScore: score1 
            },
            itemB: {
                name: keyword2,
                searches: scaleToFakeSearches(score2),
                rawScore: score2
            }
        };

        res.json(comparison);

    } catch (error) {
        console.error("Error fetching data from SerpApi:", error);
        res.status(500).json({ message: "Failed to fetch comparison data." });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));