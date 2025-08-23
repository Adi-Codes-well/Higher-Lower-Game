// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const allowedOrigins = [
    'http://localhost:5173', // Your local frontend for development
    'https://higher-lower-game-fp4r.onrender.com' // Your future live frontend URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));

const ScoreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true }
});

const Score = mongoose.model('Score', ScoreSchema);

app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await Score.find({}).sort({ score: -1 }).limit(5);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaderboard." });
    }
});

app.post('/api/leaderboard', async (req, res) => {
    const { name, score } = req.body;
    try {
        const newScore = new Score({ name, score });
        await newScore.save();
        res.status(201).json({ message: 'Score submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: "Error submitting score." });
    }
});

// --- Expanded Static Keyword Database ---
const KEYWORD_DATA = [
    // Ultra Extreme Popular Words
    { name: "YouTube", searches: 594200000, rawScore: 100, imageUrl: "https://i.pinimg.com/736x/29/05/c5/2905c5f32f67d5eab22b9a97357f4541.jpg" },
    { name: "Whatsapp Web", searches: 505700000, rawScore: 100, imageUrl: "https://i.pinimg.com/736x/93/b2/65/93b265c795140247db600ac92e58746a.jpg" },
    { name: "ChatGPT", searches: 344700000, rawScore: 100, imageUrl: "https://i.pinimg.com/736x/e8/ad/0f/e8ad0fc6c8e52574d4139f930585b6b8.jpg" },
    { name: "Facebook", searches: 298800000, rawScore: 100, imageUrl: "https://i.pinimg.com/1200x/f2/27/d3/f227d34c79c0a69e6e411ba37f7c8468.jpg" },
    { name: "Google", searches: 287300000, rawScore: 100, imageUrl: "https://i.pinimg.com/1200x/84/e5/d6/84e5d69680c7f4faa82c7b6e272d8dbb.jpg" },
    { name: "Translate", searches: 261800000, rawScore: 99, imageUrl: "https://images.techhive.com/images/article/2017/05/pcw-translate-primary-100723319-large.jpg" },
    { name: "Gmail", searches: 248100000, rawScore: 99, imageUrl: "https://i.pinimg.com/736x/f3/e5/bd/f3e5bd1a4ba52fac0784b7afa97b8ccb.jpg" },
    { name: "Amazon", searches: 225800000, rawScore: 99, imageUrl: "https://i.pinimg.com/736x/c4/79/aa/c479aa2f94f060e5ca332dbb132f35b7.jpg" },
    { name: "Canva", searches: 160300000, rawScore: 99, imageUrl: "https://i.pinimg.com/736x/2c/3b/17/2c3b178a8d2a1854690a20ba2c70d23d.jpg" },
    { name: "Weather", searches: 145000000, rawScore: 99, imageUrl: "https://i.pinimg.com/736x/01/97/9c/01979cf1b2debf9e52872adf25cf3e5c.jpg" },
    { name: "Instagram", searches: 185000000, rawScore: 99, imageUrl: "https://i.pinimg.com/736x/70/94/b4/7094b40fd67ab2facb76e5b79d90cc0a.jpg" },
    { name: "Cricbuzz", searches: 317700000, rawScore: 100, imageUrl: "https://logodix.com/logo/2191264.jpg" },
    { name: "Twitter", searches: 148500000, rawScore: 99, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCGt-g5iUAsR6gxKqs00elfvspDAyHhVfo3w&s" },
    { name: "Flipkart", searches: 69200000, rawScore: 98, imageUrl: "https://www.financialexpress.com/wp-content/uploads/2024/09/flipkart-reuters-1.jpg" },
    
    { name: "IPL", searches: 9500000, rawScore: 100, imageUrl: "https://tse4.mm.bing.net/th/id/OIP.Ovy_PxLCgKoxRIfIj6CW6QHaEo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { name: "Cricket", searches: 8800000, rawScore: 98, imageUrl: "https://static.vecteezy.com/system/resources/previews/002/289/349/large_2x/abstract-group-of-cricket-players-vector.jpg" },
    { name: "Bollywood", searches: 7800000, rawScore: 95, imageUrl: "https://www.nfi.edu/wp-content/uploads/2022/05/image1-1.jpg" },
    { name: "Virat Kohli", searches: 7500000, rawScore: 94, imageUrl: "https://thefederal.com/h-upload/2024/01/14/426807-kohli-laughs.webp" },
    { name: "Shah Rukh Khan", searches: 7200000, rawScore: 93, imageUrl: "https://img.etimg.com/thumb/width-1200,height-900,imgsize-52140,resizemode-75,msid-122781052/magazines/panache/shah-rukh-khan-injured-during-king-shoot-in-mumbai-flies-to-us-for-treatment-report-when-will-srk-return.jpg" },
    { name: "Diwali", searches: 6800000, rawScore: 91, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/The_Rangoli_of_Lights.jpg/330px-The_Rangoli_of_Lights.jpg" },
    { name: "Mumbai", searches: 6500000, rawScore: 90, imageUrl: "https://www.thehosteller.com/_next/image/?url=https%3A%2F%2Fstatic.thehosteller.com%2Fhostel%2Fimages%2Fimage.jpg%2Fimage-1735884840040.jpg&w=2048&q=75" },
    
    // Worldwide - Top Tier
    { name: "Cristiano Ronaldo", searches: 8900000, rawScore: 98, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb-NGEQDekk2BwsllLjk4tcIM_BPIzXECdsg&s" },
    { name: "Lionel Messi", searches: 8700000, rawScore: 97, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Lionel_Messi_WC2022.jpg/250px-Lionel_Messi_WC2022.jpg" },
    { name: "Netflix", searches: 8400000, rawScore: 96, imageUrl: "https://yt3.googleusercontent.com/CvgBA1ypUZNxOjiCX0l1V2FbAm7oSDPZE4YkMvkpT_4iLXQ3IXWVtBgWnznHxgtcUoj50TXqZA=s900-c-k-c0x00ffffff-no-rj" },
    { name: "Taylor Swift", searches: 8000000, rawScore: 95, imageUrl: "https://imagenes.elpais.com/resizer/v2/AWNTN6VH5NFBPJYRX7DS6QAAMM.jpg?auth=1426161ce83c0dc66a4185ca80b7f19eeff59f2e1ea63dd2a803a2e8a4417824&width=980&height=980&smart=true" },
    { name: "Bitcoin", searches: 7700000, rawScore: 94, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7ENmNqKTWeJCeYKGmiAYUaEBJSqm46Nxmag&s" },
    
    // Indian - High Tier
    { name: "Holi", searches: 5800000, rawScore: 88, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi_BFLmdRqyVhyEE9sc_ZU3YeAugUDglA01g&s" },
    { name: "Delhi", searches: 5500000, rawScore: 87, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeXtB2-MLZaRUlv0QSt8SzbTs49VUqdXW2GA&s" },
    { name: "Taj Mahal", searches: 5200000, rawScore: 86, imageUrl: "https://whc.unesco.org/uploads/thumbs/site_0252_0008-400-400-20250108121530.webp" },
    { name: "Samosa", searches: 4800000, rawScore: 85, imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/12/samosa-recipe.jpg" },
    { name: "Ratan Tata", searches: 4500000, rawScore: 84, imageUrl: "https://media2.themorningcontext.com/media/posts_images/111024_Ratan_Tata_Ujval__T_Surender.jpg" },
    { name: "Arijit Singh", searches: 4200000, rawScore: 83, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEaO9oNwP0hT6rCxrP1_xtB2Q_ORBTsB3cmw&s" },
    { name: "Indian Army", searches: 4000000, rawScore: 82, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShJ4qpqok2WiI3wNg48g42RNWfystLwsrpSQ&s" },
    { name: "ISRO", searches: 3800000, rawScore: 81, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/LVM3_M3%2C_OneWeb_India-2_campaign_30.webp/1200px-LVM3_M3%2C_OneWeb_India-2_campaign_30.webp.png" },
    
    // Worldwide - High Tier
    { name: "TikTok", searches: 7000000, rawScore: 92, imageUrl: "https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/23951405/STK051_VRG_Illo_N_Barclay_7_tiktok.jpg?quality=90&strip=all&crop=0,0,100,100" },
    { name: "Marvel", searches: 6600000, rawScore: 90, imageUrl: "https://lumiere-a.akamaihd.net/v1/images/au_portrait_grid_marvel_logo_2025_mobile_1ad65200.png" },
    { name: "Game of Thrones", searches: 6400000, rawScore: 89, imageUrl: "https://t.ctcdn.com.br/nwiSi2wKHs9C9Fbdv79yQwK3HQo=/1024x576/smart/i441940.jpeg" },
    { name: "iPhone", searches: 6200000, rawScore: 89, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT31y7OlfN7OpPHPLzl_2MDPNAw9V6fjLUeIg&s" },
    { name: "Minecraft", searches: 6000000, rawScore: 88, imageUrl: "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/12a0ed7c6bc09b73d6558c6f69ed7f5f/minecraft-classic.png" },
    { name: "Donald Trump", searches: 5800000, rawScore: 88, imageUrl: "https://www.whitehouse.gov/wp-content/uploads/2025/01/Donald-J-Trump.jpg" },
    { name: "Elon Musk", searches: 5600000, rawScore: 87, imageUrl: "https://assets-us-01.kc-usercontent.com/5cb25086-82d2-4c89-94f0-8450813a0fd3/0c3fcefb-bc28-4af6-985e-0c3b499ae832/Elon_Musk_Royal_Society.jpg?fm=jpg&auto=format" },
    { name: "Narendra Modi", searches: 5500000, rawScore: 87, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEYEI5nU2R_FOfpmEBKHJW7TXrT7PKTdmtAw&s" },
    { name: "NASA", searches: 5400000, rawScore: 86, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj7cyiblt27C0oBPY7_380M2xNSNuWkX0PJA&s" },
    { name: "Harry Potter", searches: 5200000, rawScore: 86, imageUrl: "https://assets-prd.ignimgs.com/2021/01/26/harry-potter-button-1611619333944.jpg" },

    // Indian - Mid Tier
    { name: "Yoga", searches: 3500000, rawScore: 80, imageUrl: "https://articles-1mg.gumlet.io/articles/wp-content/uploads/2015/09/yoga3-2.jpg?w=300&compress=true&quality=80&dpr=2.6" },
    { name: "Paneer Tikka", searches: 3300000, rawScore: 79, imageUrl: "https://spicecravings.com/wp-content/uploads/2020/10/Paneer-Tikka-Featured-1.jpg" },
    { name: "Ganges River", searches: 3100000, rawScore: 78, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Varanasiganga.jpg" },
    { name: "Monsoon", searches: 2900000, rawScore: 77, imageUrl: "https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638889539/EducationHub/photos/monsoon-walk.jpg" },
    { name: "UPSC", searches: 2700000, rawScore: 76, imageUrl: "https://www.levelupias.com/wp-content/uploads/2024/04/upsc.webp" },
    { name: "Zomato", searches: 2100000, rawScore: 73, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU79OZNQVYc6saP22ow_a9WupDwPcl0GR-EA&s" },

    // Worldwide - Mid Tier
    { name: "Star Wars", searches: 5000000, rawScore: 85, imageUrl: "https://m.media-amazon.com/images/I/81WMUxNTRYL._UF1000,1000_QL80_.jpg" },
    { name: "Pizza", searches: 4800000, rawScore: 85, imageUrl: "https://imgmediagumlet.lbb.in/media/2025/04/67ecf7bfab0f38157d4cdc5b_1743583167585.jpg" },
    { name: "COVID-19", searches: 4400000, rawScore: 83, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr9HF2nbN02UbZ45sbYdES231LY0hE9MAPwQ&s" },
    { name: "K-Pop", searches: 4200000, rawScore: 83, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTNxLrwVsK-7U95TpQhoni-ACveNvzKic55A&s" },
    { name: "Anime", searches: 4000000, rawScore: 82, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnzY9wpxZIKdlfXRCdLaxNtVvdV6-IQUNElw&s" },
    { name: "Premier League", searches: 3800000, rawScore: 81, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwT6bvuYwjVWxyDWfarbnWpeqg0ZFytkcORg&s" },
    { name: "Tesla", searches: 3600000, rawScore: 80, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR52ZyD1kUXQ3pMpkaxG-ARHQUfgHwnKMLiyo6AhTo96yM2qaKTG4GNREb0kuQAEj7Ha8k&usqp=CAU" },
    { name: "Olympics", searches: 3400000, rawScore: 79, imageUrl: "https://imageio.forbes.com/specials-images/dam/imageserve/852989230/960x0.jpg?height=524&width=711&fit=bounds" },
    { name: "Disney", searches: 3200000, rawScore: 78, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7KqqV_3MomSfb9SRN1tVB50OMFQ9yJgWh2w&s" },
    
    // Indian - Lower Tier
    { name: "Varanasi", searches: 1900000, rawScore: 70, imageUrl: "https://cdn.britannica.com/13/189813-050-BF6163E7/Manikarnika-Ghat-cremation-site-Hindu-Ganges-River.jpg" },
    { name: "Biryani", searches: 1700000, rawScore: 68, imageUrl: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg" },
    { name: "Ayurveda", searches: 1500000, rawScore: 65, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNjFD6vHLotvXshrUKLl1rADaNWJIvVBf23Q&s" },
    { name: "Saree", searches: 1300000, rawScore: 62, imageUrl: "https://www.zarijaipur.com/cdn/shop/products/IMG_0087copy_44a93dfc-b9ef-4541-a20b-0a53f8d51502.jpg?v=1753947982&width=1080" },
    { name: "Jawaharlal Nehru", searches: 1100000, rawScore: 60, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsrgbQ5KGcu0ZGvmI26rseTqey6Mqjvb8mWQ&s" },
    
    // Worldwide - Lower Tier
    { name: "Coffee", searches: 3000000, rawScore: 77, imageUrl: "https://etimg.etb2bimg.com/photo/113047605.cms" },
    { name: "Shakespeare", searches: 2800000, rawScore: 76, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGog86INrQcrFpbmyncOg2XCkziNbuO01E5w&s" },
    { name: "Eiffel Tower", searches: 2600000, rawScore: 75, imageUrl: "https://www.travelandleisure.com/thmb/SPUPzO88ZXq6P4Sm4mC5Xuinoik=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/eiffel-tower-paris-france-EIFFEL0217-6ccc3553e98946f18c893018d5b42bde.jpg" },
    { name: "Leonardo da Vinci", searches: 2400000, rawScore: 74, imageUrl: "https://www.leonardodavinci.net/assets/img/leonardo-da-vinci.jpg" },
    { name: "Formula 1", searches: 2200000, rawScore: 73, imageUrl: "https://mclaren.bloomreach.io/delivery/resources/content/gallery/mclaren-racing/formula-1/2025/2025-schedule/miami-gp/race/report/race-report_0004_2213398172-1-2.jpg" },
    { name: "Albert Einstein", searches: 2000000, rawScore: 71, imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Albert_Einstein_1947.jpg/960px-Albert_Einstein_1947.jpg" },
    { name: "Mount Everest", searches: 1800000, rawScore: 68, imageUrl: "https://cdn.britannica.com/17/83817-050-67C814CD/Mount-Everest.jpg" },
    { name: "Chess", searches: 1600000, rawScore: 66, imageUrl: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NoZXNzLTQuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjoiMTIwMCJ9fX0=" },
    { name: "The Beatles", searches: 1400000, rawScore: 63, imageUrl: "https://i8.amplience.net/i/naras/the-beatles_MI0003995354-MN0000754032" },
    { name: "Buddhism", searches: 1200000, rawScore: 61, imageUrl: "https://images.squarespace-cdn.com/content/v1/5abe566ac3c16a912b110dbe/1525134466812-3JGURIOTV9VGZM4V2A9I/Buddha+IMG_4262+crop.jpg" },

    // New additions (under 1M) - Tier 1 (500k - 999k)
    { name: "Ghats", searches: 900000, rawScore: 58, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCBeRX4qxL_KAZW7-_pUzL0qYKiVyNCsJLAg&s" },
    { name: "Rabindranath Tagore", searches: 700000, rawScore: 55, imageUrl: "https://cdn.britannica.com/49/134949-050-242B08C7/Rabindranath-Tagore.jpg" },
    { name: "Sudoku", searches: 1000000, rawScore: 59, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCTuhN8kq8NUzqJnItIh-TSTRFc2JsXQdDnQ&s" },
    { name: "Origami", searches: 800000, rawScore: 56, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeAutNld-QOc0Bvg1jzgj1D-2Ykv1n3SJ0AA&s" },
    { name: "Satyajit Ray", searches: 950000, rawScore: 58, imageUrl: "https://m.media-amazon.com/images/M/MV5BMTQ4MDA1ODIzMF5BMl5BanBnXkFtZTcwNDU0OTkxOA@@._V1_FMjpg_UX1000_.jpg" },
    { name: "Hampi", searches: 850000, rawScore: 57, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBFjdTNzZ5N6vlpehb4NPviNnEWEU-Tz-jNg&s" },
    { name: "Konark Sun Temple", searches: 750000, rawScore: 56, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM8SNMes3N3Pkfyhpk0AF2WAiuTEI8URsy4w&s" },
    { name: "Elephanta Caves", searches: 650000, rawScore: 54, imageUrl: "https://whc.unesco.org/uploads/thumbs/site_0244_0004-400-400-20100705114254.webp" },
    { name: "Puran Poli", searches: 550000, rawScore: 51, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2bwdqRls2xfetQRNmAw5pOXWnZFicOycLAQ&s" },

    // New additions (under 1M) - Tier 2 (200k - 499k)
    { name: "Indie Gaming", searches: 580000, rawScore: 51, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsobXZ7rNUFd3-A9rEKm0O330HG-7izQl_wg&s" },
    { name: "Vincent van Gogh", searches: 600000, rawScore: 52, imageUrl: "https://cdn.britannica.com/78/43678-050-F4DC8D93/Starry-Night-canvas-Vincent-van-Gogh-New-1889.jpg" },
    { name: "Dosa", searches: 500000, rawScore: 50, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKNAL1ZQgQXd3fIiU522D3GAgCRVT7Of_tIA&s" },
    { name: "3D Printing", searches: 480000, rawScore: 49, imageUrl: "https://damassets.autodesk.net/content/dam/autodesk/draftr/28447/what-is-3d-printing-thumb-1172x660.jpg" },
    { name: "Gladiator (Movie)", searches: 400000, rawScore: 40, imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/fb/Gladiator_%282000_film_poster%29.png" },
    { name: "Pottery", searches: 350000, rawScore: 38, imageUrl: "https://m.media-amazon.com/images/I/61hV8lwDOsL.jpg" },
    { name: "Sustainable Fashion", searches: 320000, rawScore: 45, imageUrl: "https://timesapplaud.com/wp-content/uploads/2024/03/Untitled-design-28.jpg" },
    { name: "Kathakali", searches: 300000, rawScore: 35, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSiTti8YlSpicQpdemE9quUQJOGtyNKTVmaw&s" },
    { name: "Urban Gardening", searches: 220000, rawScore: 40, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIt5g5BE6V4o6pmmWY-0MLwLZbax4MJX58BA&s" },
    
    // New additions (under 1M) - Tier 3 (50k - 199k)
    { name: "Rani Lakshmibai", searches: 200000, rawScore: 30, imageUrl: "https://cdn.dollsofindia.com/images/p/people-posters/rani-jhansi-GA63_l.jpg" },
    { name: "The Rubik's Cube", searches: 200000, rawScore: 30, imageUrl: "https://media.ipassio.com/media/blog/benefits-of-solving-rubiks-cube/blog_icon/benefits-of-solving-rubiks-cube.jpg" },
    { name: "Warli Painting", searches: 180000, rawScore: 29, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIRdzkZYOl7GeCIYjfzIQyt4mpahsWlYJnIQ&s" },
    { name: "Historical Fiction Books", searches: 160000, rawScore: 38, imageUrl: "https://i0.wp.com/bookthoughtsfrombed.com/wp-content/uploads/2024/02/1.png?fit=800%2C1200&ssl=1" },
    { name: "Jallianwala Bagh", searches: 150000, rawScore: 28, imageUrl: "https://s7ap1.scene7.com/is/image/incredibleindia/jallianwala-bagh-amritsar-punjab-1-attr-hero?qlt=82&ts=1726662275638" },
    { name: "Sourdough Bread", searches: 140000, rawScore: 27, imageUrl: "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_1:1/k%2FPhoto%2FRecipes%2F2020-01-How-to-Sourdough-Bread%2F98877-sliced-lead_How-to-make-sourdough-bread" },
    { name: "Bandhani Sarees", searches: 120000, rawScore: 26, imageUrl: "https://www.aachho.co/cdn/shop/files/NRN_5337.jpg_1_1400x.jpg?v=1728303784" },
    { name: "Mechanical Keyboards", searches: 95000, rawScore: 24, imageUrl: "https://images.indianexpress.com/2021/06/Corsair-Mechanical-Keyboard.jpg" },
    { name: "Fountain Pens", searches: 85000, rawScore: 23, imageUrl: "https://m.media-amazon.com/images/I/81Cn1QkVKOL.jpg" },
    { name: "Bonsai Trees", searches: 75000, rawScore: 22, imageUrl: "https://hips.hearstapps.com/hmg-prod/images/bonsai-bonsai-premna-royalty-free-image-1733348240.jpg?crop=0.593xw:0.889xh;0.0801xw,0.111xh&resize=1200:*" },
    { name: "Film Photography", searches: 55000, rawScore: 20, imageUrl: "https://shotkit.com/wp-content/uploads/2023/03/film-photographer.jpg" },
    
    // New additions (under 1M) - Tier 4 (10k - 49k)
    { name: "Calligraphy", searches: 48000, rawScore: 19, imageUrl: "https://fontmeme.com/images/Calligraphy-Font-by-Alejandro-Paul-550x275.jpg" },
    { name: "Lock Picking", searches: 42000, rawScore: 18, imageUrl: "https://i0.wp.com/besecure-locksmiths.co.uk/wp-content/uploads/2023/06/Lockpicking.jpg?fit=800%2C428&ssl=1" },
    { name: "Terrarium Building", searches: 32000, rawScore: 13, imageUrl: "https://cdn.shopify.com/s/files/1/0622/2961/0748/files/Large_ball_terrarium.jpg?v=1714575661" },
    { name: "Wood Carving", searches: 28000, rawScore: 12, imageUrl: "https://hanumantimbers.com/wp-content/uploads/2022/06/1.jpg" },
    { name: "Vintage Pen Collecting", searches: 25000, rawScore: 12, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt1w_7uW2bSbOil8SEHmNuG2JFumFR0GYeyg&s" },
    { name: "Kolam Designs", searches: 22000, rawScore: 11, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9mwl86lmqtARpcxdL5CF1g-j1n4VVpsSW-w&s" },
    { name: "Ant Farming", searches: 15000, rawScore: 9, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5i8eK8TSd9HrdlsTgY3WzbxlMAqJbsorQMA&s" },
    { name: "Kalaripayattu", searches: 49500, rawScore: 19, imageUrl: "https://www.keralatourism.org/images/enchanting_kerala/large/kalaripayattu20150821085515_559_1.jpg" },

    // Ultra Niche (Under 10k)
    { name: "Sanskrit Literature", searches: 3000, rawScore: 3, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqt_O_otsgqOGTIQW52tBWpsGQFqwzM01kOw&s" },
    { name: "Quantum Entanglement", searches: 2000, rawScore: 1, imageUrl: "https://static.scientificamerican.com/sciam/cache/file/A4B2CAD0-B9CD-4C06-82FF402AC2D4E41D_source.jpg?w=1200" },
    { name: "Lawn Mower Racing", searches: 1500, rawScore: 1, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAH1CWGZPapyS8_YGCM76RDe-dCqs10wkBcg&s" },
    { name: "Bidriware", searches: 5400, rawScore: 8, imageUrl: "https://static.toiimg.com/photo/imgsize-866766,msid-68102322/68102322.jpg" },
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