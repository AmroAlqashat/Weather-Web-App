# Weather Web App

A simple web application that provides real-time weather information for any location. Users can search for a city to get current weather conditions, including temperature, humidity, and weather description.

## Features

- Search for weather by city name
- Display temperature, humidity, and weather conditions
- Your sign-up information will be stored for future visits
- User-friendly interface

## Technologies Used

- HTML, CSS, JavaScript
- OpenWeatherMap API
- Axios
- PostgreSQL (Database)
- bcrypt
- Session
- Passport (Local & Google Strategy)

## Setting Up the Weather App

### API Key Setup

This project uses the OpenWeatherMap API. To use it:

1. Sign up at [OpenWeatherMap](https://openweathermap.org/) and get an API key.
2. Replace `YOUR_API_KEY` in the `.env` file with your actual API key.

### Environment Variables Setup

Create a `.env` file in the root directory and add the following environment variables:
```env
DATABASE_USER=your_database_user
DATABASE_NAME=your_database_name
DATABASE_PASSWORD=your_database_password
API_KEY=your_openweathermap_api_key
SESSION_SECRET=your_session_secret
SALT_ROUNDS=your_salt_rounds_value
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Database Setup

1. Install PostgreSQL if not already installed.
2. Create the `users` table:
   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       email VARCHAR(320) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL
   );
   ```
3. Create the `favorite_cities` table and link it to `users`:
   ```sql
   CREATE TABLE favorite_cities (
       id SERIAL PRIMARY KEY,
       city VARCHAR(50) NOT NULL,
       measurement VARCHAR(8) NOT NULL,
       user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
   );
   ```

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/AmroAlqashat/Weather-Web-App.git
   ```
2. Navigate to the project folder:
   ```sh
   cd Weather-Web-App
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Run the project:
   ```sh
   node index.js
   ```

## Usage

1. Enter a city name in the search box.
2. Click the search button to fetch weather data.
3. View the current weather details for the entered location.
4. Sign-up to save your favorite cities in the database for easy access.

## Contributing

Feel free to fork the repository and submit pull requests to improve the project.

## Author

[Amro Alqashat](https://github.com/AmroAlqashat)

