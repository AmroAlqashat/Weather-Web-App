$(".weather-btn").on('click', async function() {
    const input = $(".country-input").val();
    const measurement = $(".measurement").val();
    $.ajax({
        url: '/get-weather',
        method: 'GET',
        data: {
            input: input,
            measur: measurement
        },
        success: function(response){
            console.log(response.data_open)

            $(".country-input").val("");

            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const today = new Date();
            const dayName = days[today.getDay()];
            let weatherDescription = response.data_open.weather[0].description;

            $(".location").text(response.data_open.name);

            $(".day").text(dayName);
            
            if(measurement === "metric")
                $(".view-temp").text(parseInt(response.data_open.main.temp)+"°C");
            else if(measurement === "imperial")
                $(".view-temp").text(parseInt(response.data_open.main.temp)+"°F");

            $(".humidity").text(response.data_open.main.humidity+"%");

            $(".wind-speed").text(response.data_open.wind.speed+" meter/sec");

            $(".Cloudiness").text(response.data_open.clouds.all+"%");

            function generateGif(weatherDes){
                $(".view-icon").html(`
                    <div class="weather-appearance">
                        <img src='/gifs/${weatherDes}.gif' class="weather-icon" alt="clear sky"></img>
                    </div>
                    `);
            }
            const dt = response.dt;
            console.log(weatherDescription)
            switch(weatherDescription){
                case "clear sky":
                    if((dt.currentTime >= dt.sunrise) && (dt.currentTime <= dt.sunset)){
                        weatherDescription = "clearsky";
                        generateGif(weatherDescription);
                    } else {
                        weatherDescription = "moon";
                        generateGif(weatherDescription);
                    }
                    break;
                case "few clouds":
                    if(dt.currentTime >= dt.sunrise && dt.currentTime <= dt.sunset){
                        weatherDescription = "fewCloudsDay";
                        generateGif(weatherDescription);
                    } else {
                        weatherDescription = "fewCloudsNight";
                        generateGif(weatherDescription);
                    }
                    break;
                case "scattered clouds":
                    weatherDescription = "scatteredClouds";
                    generateGif(weatherDescription);
                    break;
                case "broken clouds":    
                case "overcast clouds":
                    weatherDescription = "brokenClouds";
                    generateGif(weatherDescription);
                    break;
                case "shower rain":
                    weatherDescription = "showerRain";
                    generateGif(weatherDescription);
                    break;
                case 'light rain':
                case 'moderate rain':
                case 'heavy intensity rain':
                case 'very heavy rain':
                case 'extreme rain':
                case 'freezing rain':
                case 'light intensity shower rain':
                case 'shower rain':
                case 'heavy intensity shower rain':
                case 'ragged shower rain':
                case 'rain':
                    if(dt.currentTime >= dt.sunrise && dt.currentTime <= dt.sunset){
                        weatherDescription = "rainDay";
                        generateGif(weatherDescription);
                    } else {
                        weatherDescription = "rainNight";
                        generateGif(weatherDescription);
                    }
                    break;
                case "thunderstorm with light rain":
                case "thunderstorm with rain":
                case "thunderstorm with heavy rain":
                case "light thunderstorm":
                case "thunderstorm":
                case "heavy thunderstorm":
                case "ragged thunderstorm":
                case "thunderstorm with light drizzle":
                case "thunderstorm with drizzle":
                case "thunderstorm with heavy drizzle":
                    weatherDescription = "thunderstorm";
                    generateGif(weatherDescription);
                    break;
                case "snow":
                case "light snow":
                case "heavy snow":
                case "sleet":
                case "light shower sleet":
                case "shower sleet":
                case "light rain and snow":
                case "rain and snow":
                case "light shower snow":
                case "shower snow":
                case "heavy shower snow":
                    weatherDescription = "snow";
                    generateGif(weatherDescription);
                    break;
                case "haze":
                case "fog":
                case "sand":
                case "dust":
                case "mist":
                case "smoke":
                case "sand/ dust whirls":
                case "volcanic ash":
                case "Squalls":
                case "Tornado":
                    weatherDescription = "mist";
                    generateGif(weatherDescription);
                    break;
                    
            }
            $(".inputs-container").css("animation-name", "slideFromBottomToUpSearch");
            $(".result-div").css("transform", "scale(1)");
            $(".result-div").css("animation-name", "slideFromBottomToUpResult");
        },
        error: function(error){
            console.log("There an error here bod: " , error);
        }
    })
})