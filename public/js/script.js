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
            
            switch(weatherDescription){
                case "clear sky":
                    if(dt.currentTime >= dt.sunrise && dt.currentTime <= dt.sunset){
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
                    weatherDescription = "brokenClouds";
                    generateGif(weatherDescription);
                    break;
                case "shower rain":
                    weatherDescription = "showerRain";
                    generateGif(weatherDescription);
                    break;
                case "rain":
                    if(dt.currentTime >= dt.sunrise && dt.currentTime <= dt.sunset){
                        weatherDescription = "rainDay";
                        generateGif(weatherDescription);
                    } else {
                        weatherDescription = "rainNight";
                        generateGif(weatherDescription);
                    }
                    break;
                case "thunderstorm":
                    weatherDescription = "thunderstorm";
                    generateGif(weatherDescription);
                    break;
                case "snow":
                    weatherDescription = "snow";
                    generateGif(weatherDescription);
                    break;
                case "mist":
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