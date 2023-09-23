/*
let weather = {
  apiKey: "102a5a842527fd4452c1f1d3234042d2",
  fetchWeather: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        this.displayWeather(data);
        this.fetchForecast(city); // Fetch forecast after current weather
      });
  },
  fetchForecast: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("No forecast found.");
        }
        return response.json();
      })
      .then((data) => this.displayForecast(data));
  },
  displayWeather: function (data) {
    const weatherContainer = document.querySelector(".weather");
    weatherContainer.innerHTML = ""; // Clear previous weather data

    const city = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity; // New: Humidity
    const windSpeed = data.wind.speed; // New: Wind Speed

    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    // Create elements for weather details
    const cityElement = document.createElement("h2");
    cityElement.classList.add("city");
    cityElement.textContent = `Weather in ${city}`;

    const tempElement = document.createElement("h1");
    tempElement.classList.add("temp");
    tempElement.textContent = `${temperature}°C`;

    const flexElement = document.createElement("div");
    flexElement.classList.add("flex");

    const iconElement = document.createElement("img");
    iconElement.src = icon;
    iconElement.alt = description;
    iconElement.classList.add("icon");

    const descriptionElement = document.createElement("div");
    descriptionElement.classList.add("description");
    descriptionElement.textContent = description;

    const humidityElement = document.createElement("div");
    humidityElement.classList.add("humidity");
    humidityElement.textContent = `Humidity: ${humidity}%`;

    const windElement = document.createElement("div");
    windElement.classList.add("wind");
    windElement.textContent = `Wind speed: ${windSpeed} km/h`;

    // Append elements to weather container
    flexElement.appendChild(iconElement);
    flexElement.appendChild(descriptionElement);

    weatherContainer.appendChild(cityElement);
    weatherContainer.appendChild(tempElement);
    weatherContainer.appendChild(flexElement);
    weatherContainer.appendChild(humidityElement);
    weatherContainer.appendChild(windElement);
  },
  // ... (unchanged code for fetchForecast, search, and other functions) ...
};

// ... (unchanged code for geolocation)

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    weather.search();
  }
});

geocode.getLocation();

*/

let weather = {
  apiKey: "102a5a842527fd4452c1f1d3234042d2",
  fetchWeather: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        this.displayWeather(data);
        this.fetchForecast(city); // Fetch forecast after current weather
      });
  },
  fetchForecast: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("No forecast found.");
        }
        return response.json();
      })
      .then((data) => this.displayForecast(data));
  },
  displayWeather: function (data) {
    const weatherContainer = document.querySelector(".weather");
    weatherContainer.classList.remove("loading");
  
    const city = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const clouds = data.clouds.all; // Cloudiness in percentage
    const rainfall = data.rain && data.rain["1h"] ? data.rain["1h"] : 0; // Rainfall in the last hour
  
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  
    // Update the weather information in the HTML
    document.querySelector(".city").textContent = `Weather in ${city}`;
    document.querySelector(".temp").textContent = `${temperature}°C`;
    document.querySelector(".icon").src = icon;
    document.querySelector(".description").textContent = description;
    document.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
    document.querySelector(".wind").textContent = `Wind speed: ${windSpeed} km/h`;
  
    // Access the alert symbol element
    const alertSymbol = document.querySelector(".alert-symbol");
  
    // Check for storm conditions
    if (windSpeed >= 30 || clouds >= 70 || rainfall >= 10) {
      // Show the alert symbol and generate an alert for storm conditions
      alertSymbol.style.display = "block";
      alert("Storm alert! Take necessary precautions.");
    } else {
      // Hide the alert symbol when conditions are not met
      alertSymbol.style.display = "none";
    }
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
  displayForecast: function (data) {
    const forecastContainer = document.querySelector(".forecast");
    forecastContainer.innerHTML = "";

    // Get the forecast data for the next 7 days
    const forecastData = data.list;
    const days = {}; // Create an object to group forecast data by day
    const today = new Date().getDate();

    forecastData.forEach((forecast) => {
      const { dt, main, weather } = forecast;
      const forecastDate = new Date(dt * 1000);
      const day = forecastDate.getDate();

      // Check if the forecast is for a different day
      if (day !== today && Object.keys(days).length < 7) {
        if (!days[day]) {
          days[day] = {
            date: forecastDate.toLocaleDateString("en-US", { weekday: "short" }),
            temp: [],
            icon: [],
            humidity: [],
            windSpeed: [],
          };
        }
        days[day].temp.push(main.temp);
        days[day].icon.push(weather[0].icon);
        days[day].humidity.push(main.humidity);
        days[day].windSpeed.push(forecast.wind.speed);
      }
    });

    // Iterate over the days and display the forecast
    for (const day in days) {
      const { date, temp, icon, humidity, windSpeed } = days[day];
      const avgTemp = (temp.reduce((acc, val) => acc + val, 0) / temp.length).toFixed(1);
      const avgIcon = icon[Math.floor(icon.length / 2)];

      const forecastItem = document.createElement("div");
      forecastItem.classList.add("forecast-item");
      forecastItem.innerHTML = `
        <div class="forecast-day">${date}</div>
        <img src="https://openweathermap.org/img/wn/${avgIcon}.png" alt="Forecast" class="forecast-icon" />
        <div class="forecast-temp">${avgTemp}°C</div>
      `;

      // Add event listeners to show details when hovering or clicking
      forecastItem.addEventListener("mouseover", function () {
        const details = document.querySelector(".details");
        const dayData = days[day];
        const avgHumidity = (dayData.humidity.reduce((acc, val) => acc + val, 0) / dayData.humidity.length).toFixed(0);
        const avgWindSpeed = (dayData.windSpeed.reduce((acc, val) => acc + val, 0) / dayData.windSpeed.length).toFixed(1);
        details.innerHTML = `
          <div class="humidity">Humidity: ${avgHumidity}%</div>
          <div class="wind">Wind speed: ${avgWindSpeed} km/h</div>
        `;
      });

      forecastContainer.appendChild(forecastItem);
    }
  },
};

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      weather.search();
    }
  });

  geocode.getLocation(); // Include your existing code for geolocation here.
  // Include any other functions or code you have here.
});

