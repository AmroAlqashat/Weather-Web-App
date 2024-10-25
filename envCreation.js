import fs from 'fs';

const content = `API_KEY_openweather=37edbeb80990917cb1f055e575b0a277\n`;

fs.writeFile('.env', content, (err) => {
    if (err) {
        console.error('Error creating .env file:', err);
        return;
    }
    console.log('.env file created. Please edit it to add your OpenWeatherMap API key.');
});