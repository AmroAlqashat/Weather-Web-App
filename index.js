import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import pg from 'pg';
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import "dotenv/config";
import UserDB from './models/UserDB.js';
import UserClass from './models/UserClass.js';

const API_KEY_openweather = process.env.API_KEY;
const saltRounds = Number(process.env.SALT_ROUNDS);
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
app.use(
    session({
      secret: (process.env.SESSION_SECRET),
      resave: false,
      saveUninitialized: false,
      cookie:{
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      }
    })
);
app.use((err, req, res, next) => {
    console.log(req.stack)
    res.status(500).send('Something went wrong!');
})
app.use(passport.initialize());
app.use(passport.session());


function isLoggedIn(sessionOrPassport) {
    if (sessionOrPassport?.passport?.user) {
      return true;
    }
    if (sessionOrPassport?.user) {
      return true;
    }
    return false;
  }

passport.use('local', new Strategy({ usernameField: 'email', passwordField: 'password' }, async function verify(email, password, cb){
    try {
        const resultDB = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if(resultDB.rows.length <= 0){
            return cb(null, false);
        }else{
            const user = resultDB.rows[0];
            bcrypt.compare(password, resultDB.rows[0].password, function(err, valid) {
                if(err) return cb(err);
                if(valid) return cb(null, user);
                else return cb(null, false);
            });
        }
    } catch (error) {
        return cb(error);
    }
}));

passport.use('google', new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
        try {
            const result = await db.query("SELECT * FROM USERS WHERE email = $1",[profile.email]);
            if(result.rows.length === 0){
                const newUser = await db.query("INSERT INTO USERS (email, password) VALUES($1,$2) RETURNING *",
                [profile.email,"google"]);
                return cb(null, newUser.rows[0]);
            }else{
                return cb(null, result.rows[0]);
            }
        } catch (error) {
            return cb(error);
        }
    }
));


app.get('/', async (req, res) => {
    if(req.isAuthenticated()) 
        res.render('index', { loggedIn: true, errorMsg: false });
    else 
        res.render('index', { loggedIn: false, errorMsg: false });
});

app.get("/auth/google", passport.authenticate("google",{
    scope: ["profile", "email"],
}));

app.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
        if(err) return res.redirect('/');

        if(!user) return res.render("index", { loggedIn: false, errorMsg: "Authentication failed. Please try again." });

        req.login(user, (err) => {
            if(err) return res.render("index", { loggedIn: false, errorMsg: "An error occurred. Please try again." });

            return res.render("index", { loggedIn: true, errorMsg: false });
        });
    })(req, res, next);
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const newUserDB = new UserDB();
        const exist = await newUserDB.existUserDB(email);
        if(exist){
            res.render('index', { loggedIn: isLoggedIn(req.session), errorMsg: "Email already in use" })
        }else{
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if(err){
                    console.log('Error hashing password:', err);
                }else{
                    const newUser = new UserClass(email,hash);
                    const user = await newUserDB.insertUserDB(newUser);
                    req.login(user, (err) => {
                        res.render('index', { loggedIn: isLoggedIn(req.session.passport), errorMsg: false });
                    });
                }
            });
        }
    } catch (error) {
        console.log("Error registering user:",error);
    }
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) return next(err);
        if(!user) return (res.render('index', { loggedIn: isLoggedIn(req.session), errorMsg: "Wrong email or password" }));
        req.login(user, (err) => {
            if(err) return next(err);
            return (res.render('index', { loggedIn: isLoggedIn(req.session.passport), errorMsg: false }));
        });
    })(req, res, next);
});

app.post('/logout', (req, res) => {
    req.logOut(function (err) {
        if(err)
            return next(err);
        res.clearCookie('connect.sid');
        req.session.destroy((err) => {
            if (err) return next(err);
            res.redirect("/");
        })
    });
});

app.post('/auth/google/logout', (req, res) => {
    req.logOut(function (err) {
        if(err) return next(err);
        res.clearCookie('connect.sid');
        req.session.destroy((err) => {
            if (err) return next(err);
            res.redirect("/");
        })
    });
});

app.get('/get-weather', async (req, res) => {
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
        if(isLoggedIn(req.session)){
            const userID = req.session.passport.user.id;
            if(isChecked === "true"){
                try {
                    const firstLetter = inputData.charAt(0).toUpperCase();
                    const RestLetter = inputData.substring(1).toLowerCase();
                    const validInput = firstLetter + RestLetter;
                    await db.query("INSERT INTO favorite_cities (city, measurement, user_id) VALUES($1,$2,$3)",[validInput,measurData,userID]);
                } catch (error) {
                    console.log("Error inserting into db:", error);
                }
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
        if(isLoggedIn(req.session)){
            const result = await db.query("SELECT city, measurement, user_id FROM favorite_cities");
            const cities = result.rows;
            const vaildCities = cities.filter((obj) => req.session.passport.user.id == obj.user_id)
            res.json({ success: true, cities: vaildCities });
        }
    } catch (error) {
        console.log("Error reading DB data:", error.message);  
    }
});

passport.serializeUser((user, cb) => {
    cb(null, user);
});
passport.deserializeUser((user, cb) => {
    cb(null, user);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});