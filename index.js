import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import pg from 'pg';
import "dotenv/config";


const dbPassword = process.env.DATABASE_PASSWORD;
const dbUser = process.env.DATABASE_USER;
const dbName = process.env.DATABASE_NAME;
const db = new pg.Client({
    user: dbUser,
    host: "localhost",
    database: dbName,
    password: dbPassword,
    port: 5432
});
db.connect();

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine','ejs');

const API_KEY_openweather = process.env.API_KEY;

app.get('/', async (req, res) => {
    res.render('index');
})

app.get('/get-weather', async (req, res) => {
    const query = req.query.query;
    const inputData = req.query.input;
    const measurData = req.query.measur;
    const isChecked = req.query.isChecked;
    try {
        const geoCodeResponse = await axios.get('http://api.openweathermap.org/geo/1.0/direct',{
            params: {
                q: inputData,
                appid: API_KEY_openweather
            }
        })
        const latitude = geoCodeResponse.data[0].lat;
        const longitude = geoCodeResponse.data[0].lon;

        const APIresponse_openweather = await axios.get("https://api.openweathermap.org/data/2.5/weather",{
            params:{
                lat: latitude,
                lon: longitude,
                appid: API_KEY_openweather,
                units: measurData
            }
        });

        const sunriseTime = APIresponse_openweather.data.sys.sunrise
        const sunsetTime = APIresponse_openweather.data.sys.sunset
        const currentTime = Math.floor(Date.now()/1000);
        const dt = {
            sunriseTime: sunriseTime,
            sunsetTime: sunsetTime,
            currentTime: currentTime
        }
        console.log(isChecked)
        if(isChecked === "true"){
            console.log("here")
            try {
                const validInput = inputData.toLowerCase();
                await db.query("INSERT INTO favorite_cities (city, measurement) VALUES($1,$2)",[validInput,measurData]);
            } catch (error) {
                console.log("Error inserting into db:", error);
            }
        }
        res.json({ success: true, data_open: APIresponse_openweather.data, dt: dt });
    } catch (error) {
        console.error("There is an error here: ", error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching weather data');
    }
});

app.get('/get-cities', async (req, res) => {
    try {
        const result = await db.query("SELECT city, measurement FROM favorite_cities");
        const cities = result.rows;
        res.json({ success: true, cities: cities });
    } catch (error) {
        console.log("Error reading the data from db:", error.message);  
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});