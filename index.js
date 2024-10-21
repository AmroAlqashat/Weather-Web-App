import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine','ejs');

const API_KEY_openweather = "37edbeb80990917cb1f055e575b0a277";
const API_KEY_current = "c3a6c7db36b97bd511e71d30d947663f";

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/get-weather', async (req, res) => {
    const inputData = req.query.input;
    const measurData = req.query.measur;
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

        res.json({ success: true, data_open: APIresponse_openweather.data, dt: dt });
    } catch (error) {
        console.error("There is an error here body: ", error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching weather data');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});