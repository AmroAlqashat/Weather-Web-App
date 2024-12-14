# Weather Web App

Follow the steps to run the project on your local machine:

1. Download pgAdmin4 or any database manager [Download pgAdmin4](https://www.pgadmin.org/download/).

2. Create a database.

3. Create a table with 3 columns:
```sql
-id SERIAL NOT NULL PRIMARY KEY

-city VARCHAR(50) NOT NULL UNIQUE

-measurement VARCHAR(8) NOT NULL
```

4. Get your OpenWeather API key [Get API key](https://home.openweathermap.org/api_keys).

5. Clone the project:
    ```bash
    git clone https://github.com/AmroAlqashat/Weather-Web-App.git
    
    cd Weather-Web-App
    ```

6. Go to index.js and replace the values of the existing variables at the top with your information.

7. Install dependencies and run the project:
   ```bash
   npm i
   node index.js
   ```
