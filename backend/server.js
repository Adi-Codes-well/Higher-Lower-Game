// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Correctly import the main SerpApi module
const SerpApi = require('google-search-results-nodejs');

const app = express();
app.use(cors());
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
    if (!timelineData || timelineData.length === 0) {
        return 0; // Return 0 if data is missing to prevent crashes
    }
    const totalInterest = timelineData.reduce((sum, dataPoint) => sum + dataPoint.values[0].extracted_value, 0);
    return totalInterest / timelineData.length;
};

const scaleToFakeSearches = (score) => {
    const scaledValue = score * 10000;
    // Round to the nearest thousand. e.g., 304,528 becomes 305,000
    return Math.round(scaledValue / 1000) * 1000;
};

// --- API Route ---
app.get('/api/comparison', async (req, res) => {
    try {
        const keyword1 = getRandomKeyword();
        const keyword2 = getRandomKeyword(keyword1);

        // 1. Create a new instance of the search client
        const search = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY);

        // 2. Define the parameters for the search
        const params = {
            engine: "google_trends",
            q: `${keyword1}, ${keyword2}`,
            geo: "IN",
            data_type: "TIMESERIES",
            time: "today 12-m",
        };

        // 3. Use a callback to get the JSON result
        search.json(params, (response) => {
            const interestOverTime = response.interest_over_time;

            // Add a check to ensure data exists
            if (!interestOverTime || !interestOverTime.timeline_data) {
                throw new Error("Invalid data structure from SerpApi");
            }

            const data1 = interestOverTime.timeline_data.filter(d => d.values[0].query === keyword1);
            const data2 = interestOverTime.timeline_data.filter(d => d.values[0].query === keyword2);

            const score1 = getAverageInterest(data1);
            const score2 = getAverageInterest(data2);

            const comparison = {
                itemA: {
                    name: keyword1,
                    searches: scaleToFakeSearches(score1),
                    rawScore: score1
                },
                itemB: {
                    name: keyword2,
                    searches: scaleToFakeSearches(score2),
                    rawScore: score2
                }
            };

            res.json(comparison);
        });

    } catch (error) {
        console.error("Error processing SerpApi request:", error);
        res.status(500).json({ message: "Failed to fetch comparison data." });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
