# Weather App

Welcome to the Weather App! This guide will walk you through the steps to get your project up and running on your local machine.

## Step 1: Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** (version 14 or higher)  
  [Download Node.js](https://nodejs.org/)
  
- **PostgreSQL** (version 12 or higher)  
  [Download PostgreSQL](https://www.postgresql.org/download/)
  
- **Git** (optional, for cloning the repository)  
  [Download Git](https://git-scm.com/)
  
- An **OpenWeather API key**  
  [Get your OpenWeather API key](https://home.openweathermap.org/users/sign_up)

## Step 2: Clone the Repository

Clone the repository to your local machine by running:

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

*Step 3: Create a PostgreSQL Database and User*
You need to set up a PostgreSQL database and a user with access to it. Here’s how:

1. *Create a PostgreSQL Database User and Password*

   - Open the PostgreSQL terminal (psql):

     ```bash
     psql -U postgres
     ```

   - Create a new user for the app:
   - Create a new database:
   - Grant the necessary permissions to the new user:

     ```sql
     CREATE USER weather_app_user WITH PASSWORD 'your_secure_password';

     CREATE DATABASE weather_app_db;
     
     GRANT ALL PRIVILEGES ON DATABASE weather_app_db TO weather_app_user;
     ```

   - Exit the PostgreSQL terminal:

     ```bash
     \q
     ```
*Step 4: Set Up Environment Variables*
1. *Create the `.env` file*

   Now that your PostgreSQL user and database are set up, you’ll need to configure environment variables for the database connection and the OpenWeather API key.

2. *Edit the `.env` file and add the following:*

   ```env
   DATABASE_USER=weather_app_user
   DATABASE_PASSWORD=your_secure_password
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=weather_app_db

   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

   Replace `your_secure_password` with the password you created for the PostgreSQL user.  
   Replace `your_openweather_api_key` with the API key you got from OpenWeather.

3. *Add `.env` to `.gitignore`*

   To ensure your sensitive information isn’t accidentally shared, add the `.env` file to the `.gitignore` file. This will prevent it from being tracked by Git.

*Step 5: Install Dependencies*
Now that you have your environment set up, install the project dependencies. Run the following command:

```bash
npm install
```

This will install all the required dependencies listed in `package.json`.

*Step 6: Run the Application*
Now that everything is set up, you can run the application locally:

```bash
npm start
```

The app should now be running locally at [http://localhost:3000](http://localhost:3000).

*Step 8: Troubleshooting*
If you encounter any issues, here are a few common problems and solutions:

1. *PostgreSQL Connection Error:*
   - Double-check that your `.env` file contains the correct credentials.
   - Ensure PostgreSQL is running. You can check this by running `psql -U postgres` in the terminal.
   - Verify that PostgreSQL is configured to allow connections from your local machine.

2. *Missing API Key:*
   - Ensure you have correctly entered the OpenWeather API key in your `.env` file.

Thank you for using the Weather App! We hope this guide helped you get the app up and running. If you run into any issues, feel free to open an issue on GitHub.

Good luck and enjoy building!
