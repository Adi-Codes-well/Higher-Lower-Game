// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- Expanded Static Keyword Database ---
const KEYWORD_DATA = [
    // Indian - Top Tier
    { name: "IPL", searches: 9500000, rawScore: 100, imageUrl: "https://placehold.co/600x400/orange/white?text=IPL" },
    { name: "Cricket", searches: 8800000, rawScore: 98, imageUrl: "https://placehold.co/600x400/green/white?text=Cricket" },
    { name: "Narendra Modi", searches: 8500000, rawScore: 97, imageUrl: "https://placehold.co/600x400/F97316/white?text=Narendra+Modi" },
    { name: "Bollywood", searches: 7800000, rawScore: 95, imageUrl: "https://placehold.co/600x400/EC4899/white?text=Bollywood" },
    { name: "Virat Kohli", searches: 7500000, rawScore: 94, imageUrl: "https://placehold.co/600x400/1D4ED8/white?text=Virat+Kohli" },
    { name: "Shah Rukh Khan", searches: 7200000, rawScore: 93, imageUrl: "https://placehold.co/600x400/7C3AED/white?text=Shah+Rukh+Khan" },
    { name: "Diwali", searches: 6800000, rawScore: 91, imageUrl: "https://placehold.co/600x400/F59E0B/white?text=Diwali" },
    { name: "Mumbai", searches: 6500000, rawScore: 90, imageUrl: "https://placehold.co/600x400/3B82F6/white?text=Mumbai" },

    // Worldwide - Top Tier
    { name: "Google", searches: 10000000, rawScore: 100, imageUrl: "https://placehold.co/600x400/4285F4/white?text=Google" },
    { name: "Facebook", searches: 9800000, rawScore: 99, imageUrl: "https://placehold.co/600x400/1877F2/white?text=Facebook" },
    { name: "YouTube", searches: 9700000, rawScore: 99, imageUrl: "https://placehold.co/600x400/FF0000/white?text=YouTube" },
    { name: "Amazon", searches: 9200000, rawScore: 98, imageUrl: "https://placehold.co/600x400/FF9900/white?text=Amazon" },
    { name: "Cristiano Ronaldo", searches: 8900000, rawScore: 98, imageUrl: "https://placehold.co/600x400/000000/white?text=Ronaldo" },
    { name: "Lionel Messi", searches: 8700000, rawScore: 97, imageUrl: "https://placehold.co/600x400/3399FF/white?text=Messi" },
    { name: "Netflix", searches: 8400000, rawScore: 96, imageUrl: "https://placehold.co/600x400/E50914/white?text=Netflix" },
    { name: "Instagram", searches: 8200000, rawScore: 96, imageUrl: "https://placehold.co/600x400/C13584/white?text=Instagram" },
    { name: "Taylor Swift", searches: 8000000, rawScore: 95, imageUrl: "https://placehold.co/600x400/B39EB5/white?text=Taylor+Swift" },
    { name: "Bitcoin", searches: 7700000, rawScore: 94, imageUrl: "https://placehold.co/600x400/F7931A/white?text=Bitcoin" },
    
    // Indian - High Tier
    { name: "Holi", searches: 5800000, rawScore: 88, imageUrl: "https://placehold.co/600x400/EF4444/white?text=Holi" },
    { name: "Delhi", searches: 5500000, rawScore: 87, imageUrl: "https://placehold.co/600x400/059669/white?text=Delhi" },
    { name: "Taj Mahal", searches: 5200000, rawScore: 86, imageUrl: "https://placehold.co/600x400/FDF4E3/black?text=Taj+Mahal" },
    { name: "Samosa", searches: 4800000, rawScore: 85, imageUrl: "https://placehold.co/600x400/D97706/white?text=Samosa" },
    { name: "Ratan Tata", searches: 4500000, rawScore: 84, imageUrl: "https://placehold.co/600x400/4B5563/white?text=Ratan+Tata" },
    { name: "Arijit Singh", searches: 4200000, rawScore: 83, imageUrl: "https://placehold.co/600x400/6D28D9/white?text=Arijit+Singh" },
    { name: "Indian Army", searches: 4000000, rawScore: 82, imageUrl: "https://placehold.co/600x400/22C55E/white?text=Indian+Army" },
    { name: "ISRO", searches: 3800000, rawScore: 81, imageUrl: "https://placehold.co/600x400/0284C7/white?text=ISRO" },

    // Worldwide - High Tier
    { name: "TikTok", searches: 7000000, rawScore: 92, imageUrl: "https://placehold.co/600x400/000000/white?text=TikTok" },
    { name: "Twitter (X)", searches: 6800000, rawScore: 91, imageUrl: "https://placehold.co/600x400/1DA1F2/white?text=Twitter" },
    { name: "Marvel", searches: 6600000, rawScore: 90, imageUrl: "https://placehold.co/600x400/ED1D24/white?text=Marvel" },
    { name: "Game of Thrones", searches: 6400000, rawScore: 89, imageUrl: "https://placehold.co/600x400/A5A5A5/black?text=GoT" },
    { name: "iPhone", searches: 6200000, rawScore: 89, imageUrl: "https://placehold.co/600x400/333333/white?text=iPhone" },
    { name: "Minecraft", searches: 6000000, rawScore: 88, imageUrl: "https://placehold.co/600x400/6E4D35/white?text=Minecraft" },
    { name: "Donald Trump", searches: 5800000, rawScore: 88, imageUrl: "https://placehold.co/600x400/BF0A30/white?text=Donald+Trump" },
    { name: "Elon Musk", searches: 5600000, rawScore: 87, imageUrl: "https://placehold.co/600x400/1C1C1C/white?text=Elon+Musk" },
    { name: "NASA", searches: 5400000, rawScore: 86, imageUrl: "https://placehold.co/600x400/0B3D91/white?text=NASA" },
    { name: "Harry Potter", searches: 5200000, rawScore: 86, imageUrl: "https://placehold.co/600x400/7F0909/white?text=Harry+Potter" },

    // Indian - Mid Tier
    { name: "Yoga", searches: 3500000, rawScore: 80, imageUrl: "https://placehold.co/600x400/8B5CF6/white?text=Yoga" },
    { name: "Paneer Tikka", searches: 3300000, rawScore: 79, imageUrl: "https://placehold.co/600x400/F59E0B/white?text=Paneer+Tikka" },
    { name: "Ganges River", searches: 3100000, rawScore: 78, imageUrl: "https://placehold.co/600x400/5EEAD4/black?text=Ganges" },
    { name: "Monsoon", searches: 2900000, rawScore: 77, imageUrl: "https://placehold.co/600x400/5F99F7/white?text=Monsoon" },
    { name: "UPSC", searches: 2700000, rawScore: 76, imageUrl: "https://placehold.co/600x400/4A5568/white?text=UPSC" },
    { name: "Bangalore", searches: 2500000, rawScore: 75, imageUrl: "https://placehold.co/600x400/9333EA/white?text=Bangalore" },
    { name: "Aadhaar Card", searches: 2300000, rawScore: 74, imageUrl: "https://placehold.co/600x400/64748B/white?text=Aadhaar" },
    { name: "Zomato", searches: 2100000, rawScore: 73, imageUrl: "https://placehold.co/600x400/EF4444/white?text=Zomato" },

    // Worldwide - Mid Tier
    { name: "Star Wars", searches: 5000000, rawScore: 85, imageUrl: "https://placehold.co/600x400/FFE81F/black?text=Star+Wars" },
    { name: "Pizza", searches: 4800000, rawScore: 85, imageUrl: "https://placehold.co/600x400/FBC02D/black?text=Pizza" },
    { name: "World Cup", searches: 4600000, rawScore: 84, imageUrl: "https://placehold.co/600x400/8A1538/white?text=World+Cup" },
    { name: "COVID-19", searches: 4400000, rawScore: 83, imageUrl: "https://placehold.co/600x400/34D399/black?text=COVID-19" },
    { name: "K-Pop", searches: 4200000, rawScore: 83, imageUrl: "https://placehold.co/600x400/F472B6/black?text=K-Pop" },
    { name: "Anime", searches: 4000000, rawScore: 82, imageUrl: "https://placehold.co/600x400/3B82F6/white?text=Anime" },
    { name: "Premier League", searches: 3800000, rawScore: 81, imageUrl: "https://placehold.co/600x400/37003C/white?text=Premier+League" },
    { name: "Tesla", searches: 3600000, rawScore: 80, imageUrl: "https://placehold.co/600x400/CC0000/white?text=Tesla" },
    { name: "Olympics", searches: 3400000, rawScore: 79, imageUrl: "https://placehold.co/600x400/0085C7/white?text=Olympics" },
    { name: "Disney", searches: 3200000, rawScore: 78, imageUrl: "https://placehold.co/600x400/1B2954/white?text=Disney" },
    
    // Indian - Lower Tier
    { name: "Varanasi", searches: 1900000, rawScore: 70, imageUrl: "https://placehold.co/600x400/FB923C/black?text=Varanasi" },
    { name: "Biryani", searches: 1700000, rawScore: 68, imageUrl: "https://placehold.co/600x400/C2410C/white?text=Biryani" },
    { name: "Ayurveda", searches: 1500000, rawScore: 65, imageUrl: "https://placehold.co/600x400/16A34A/white?text=Ayurveda" },
    { name: "Saree", searches: 1300000, rawScore: 62, imageUrl: "https://placehold.co/600x400/DB2777/white?text=Saree" },
    { name: "Jawaharlal Nehru", searches: 1100000, rawScore: 60, imageUrl: "https://placehold.co/600x400/78716C/white?text=Nehru" },
    { name: "Ghats", searches: 900000, rawScore: 58, imageUrl: "https://placehold.co/600x400/A16207/white?text=Ghats" },
    { name: "Rabindranath Tagore", searches: 700000, rawScore: 55, imageUrl: "https://placehold.co/600x400/44403C/white?text=Tagore" },
    
    // Worldwide - Lower Tier
    { name: "Coffee", searches: 3000000, rawScore: 77, imageUrl: "https://placehold.co/600x400/6F4E37/white?text=Coffee" },
    { name: "Shakespeare", searches: 2800000, rawScore: 76, imageUrl: "https://placehold.co/600x400/8C7853/white?text=Shakespeare" },
    { name: "Eiffel Tower", searches: 2600000, rawScore: 75, imageUrl: "https://placehold.co/600x400/808080/white?text=Eiffel+Tower" },
    { name: "Leonardo da Vinci", searches: 2400000, rawScore: 74, imageUrl: "https://placehold.co/600x400/A36A00/white?text=Da+Vinci" },
    { name: "Formula 1", searches: 2200000, rawScore: 73, imageUrl: "https://placehold.co/600x400/FF1801/white?text=F1" },
    { name: "Albert Einstein", searches: 2000000, rawScore: 71, imageUrl: "https://placehold.co/600x400/999999/white?text=Einstein" },
    { name: "Mount Everest", searches: 1800000, rawScore: 68, imageUrl: "https://placehold.co/600x400/FFFFFF/black?text=Everest" },
    { name: "Chess", searches: 1600000, rawScore: 66, imageUrl: "https://placehold.co/600x400/D18B47/black?text=Chess" },
    { name: "The Beatles", searches: 1400000, rawScore: 63, imageUrl: "https://placehold.co/600x400/4A4A4A/white?text=The+Beatles" },
    { name: "Buddhism", searches: 1200000, rawScore: 61, imageUrl: "https://placehold.co/600x400/FFC300/black?text=Buddhism" },
    { name: "Sudoku", searches: 1000000, rawScore: 59, imageUrl: "https://placehold.co/600x400/E2E8F0/black?text=Sudoku" },
    { name: "Origami", searches: 800000, rawScore: 56, imageUrl: "https://placehold.co/600x400/F472B6/white?text=Origami" },
    
    // Niche (150k - 600k)
    { name: "Indie Gaming", searches: 580000, rawScore: 51, imageUrl: "https://placehold.co/600x400/9333EA/white?text=Indie+Gaming" },
    { name: "Vincent van Gogh", searches: 600000, rawScore: 52, imageUrl: "https://placehold.co/600x400/0074D9/white?text=Van+Gogh" },
    { name: "Dosa", searches: 500000, rawScore: 50, imageUrl: "https://placehold.co/600x400/FACC15/black?text=Dosa" },
    { name: "Air Fryer Recipes", searches: 450000, rawScore: 48, imageUrl: "https://placehold.co/600x400/F97316/white?text=Air+Fryer" },
    { name: "Gladiator (Movie)", searches: 400000, rawScore: 40, imageUrl: "https://placehold.co/600x400/A98307/white?text=Gladiator" },
    { name: "Sustainable Fashion", searches: 320000, rawScore: 45, imageUrl: "https://placehold.co/600x400/10B981/white?text=Sustainable+Fashion" },
    { name: "Kathakali", searches: 300000, rawScore: 35, imageUrl: "https://placehold.co/600x400/DC2626/white?text=Kathakali" },
    { name: "Local Coffee Shops", searches: 280000, rawScore: 42, imageUrl: "https://placehold.co/600x400/A16207/white?text=Coffee+Shops" },
    { name: "Konark Sun Temple", searches: 250000, rawScore: 33, imageUrl: "https://placehold.co/600x400/F59E0B/black?text=Konark" },
    { name: "Urban Gardening", searches: 220000, rawScore: 40, imageUrl: "https://placehold.co/600x400/22C55E/white?text=Urban+Gardening" },
    { name: "Rani Lakshmibai", searches: 200000, rawScore: 30, imageUrl: "https://placehold.co/600x400/9A3412/white?text=Lakshmibai" },
    { name: "The Rubik's Cube", searches: 200000, rawScore: 30, imageUrl: "https://placehold.co/600x400/009E60/white?text=Rubik's+Cube" },
    { name: "Historical Fiction Books", searches: 160000, rawScore: 38, imageUrl: "https://placehold.co/600x400/78716C/white?text=Historical+Fiction" },
    { name: "Jallianwala Bagh", searches: 150000, rawScore: 28, imageUrl: "https://placehold.co/600x400/7F1D1D/white?text=Jallianwala+Bagh" },

    // More Niche (40k - 150k)
    { name: "Satyajit Ray", searches: 100000, rawScore: 25, imageUrl: "https://placehold.co/600x400/1C1917/white?text=Satyajit+Ray" },
    { name: "Mechanical Keyboards", searches: 95000, rawScore: 24, imageUrl: "https://placehold.co/600x400/3B82F6/white?text=Mech+Keyboards" },
    { name: "Fountain Pens", searches: 85000, rawScore: 23, imageUrl: "https://placehold.co/600x400/4B5563/white?text=Fountain+Pens" },
    { name: "Bonsai Trees", searches: 75000, rawScore: 22, imageUrl: "https://placehold.co/600x400/16A34A/white?text=Bonsai" },
    { name: "Kombucha Brewing", searches: 65000, rawScore: 21, imageUrl: "https://placehold.co/600x400/F59E0B/black?text=Kombucha" },
    { name: "Film Photography", searches: 55000, rawScore: 20, imageUrl: "https://placehold.co/600x400/6B7280/white?text=Film+Photography" },
    { name: "Calligraphy", searches: 48000, rawScore: 19, imageUrl: "https://placehold.co/600x400/A16207/white?text=Calligraphy" },
    { name: "Lock Picking", searches: 42000, rawScore: 18, imageUrl: "https://placehold.co/600x400/1F2937/white?text=Lock+Picking" },

    // Ultra Niche (Under 40k)
    { name: "Artisanal Cheese Making", searches: 38000, rawScore: 15, imageUrl: "https://placehold.co/600x400/FBBF24/black?text=Cheese+Making" },
    { name: "Speedcubing", searches: 35000, rawScore: 14, imageUrl: "https://placehold.co/600x400/DC2626/white?text=Speedcubing" },
    { name: "Terrarium Building", searches: 32000, rawScore: 13, imageUrl: "https://placehold.co/600x400/059669/white?text=Terrarium" },
    { name: "Vintage Pen Collecting", searches: 25000, rawScore: 12, imageUrl: "https://placehold.co/600x400/4B5563/white?text=Vintage+Pens" },
    { name: "Home Beekeeping", searches: 19000, rawScore: 10, imageUrl: "https://placehold.co/600x400/F59E0B/black?text=Beekeeping" },
    { name: "Ant Farming", searches: 15000, rawScore: 9, imageUrl: "https://placehold.co/600x400/9A3412/white?text=Ant+Farming" },
    { name: "Forgotten 80s Movies", searches: 12000, rawScore: 8, imageUrl: "https://placehold.co/600x400/EC4899/white?text=80s+Movies" },
    { name: "Gothic Architecture", searches: 9000, rawScore: 7, imageUrl: "https://placehold.co/600x400/1C1917/white?text=Gothic+Architecture" },
    { name: "Geocaching", searches: 7000, rawScore: 6, imageUrl: "https://placehold.co/600x400/22C55E/white?text=Geocaching" },
    { name: "Stoicism Philosophy", searches: 5000, rawScore: 5, imageUrl: "https://placehold.co/600x400/78716C/white?text=Stoicism" },
    { name: "Mycology (Mushroom Foraging)", searches: 4500, rawScore: 4, imageUrl: "https://placehold.co/600x400/EF4444/white?text=Mycology" },
    { name: "Sanskrit Literature", searches: 3000, rawScore: 3, imageUrl: "https://placehold.co/600x400/F97316/white?text=Sanskrit" },
    { name: "Retro Synthesizers", searches: 2500, rawScore: 2, imageUrl: "https://placehold.co/600x400/6D28D9/white?text=Synths" },
    { name: "Quantum Entanglement", searches: 2000, rawScore: 1, imageUrl: "https://placehold.co/600x400/3B82F6/white?text=Quantum" },
];


// --- Helper Function ---
const getRandomItem = (exclude = null) => {
    let item;
    do {
        item = KEYWORD_DATA[Math.floor(Math.random() * KEYWORD_DATA.length)];
    } while (exclude && item.name === exclude.name);
    return item;
};

// --- API Route (Simplified) ---
app.get('/api/comparison', (req, res) => {
    try {
        const itemA = getRandomItem();
        const itemB = getRandomItem(itemA);

        const comparison = {
            itemA: {
                name: itemA.name,
                searches: itemA.searches,
                rawScore: itemA.rawScore,
                imageUrl: itemA.imageUrl
            },
            itemB: {
                name: itemB.name,
                searches: itemB.searches,
                rawScore: itemB.rawScore,
                imageUrl: itemB.imageUrl
            }
        };

        res.json(comparison);

    } catch (error) {
        console.error("Error generating comparison from static data:", error);
        res.status(500).json({ message: "Failed to generate comparison." });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));