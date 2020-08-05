// ELEMENTS
const notificationElement = document.querySelector(".notification");
const currentIcon = document.querySelector(".weather-icon");
const currentLocation = document.querySelector(".location");
const currentTemp = document.querySelector(".temperature-value p");
const currentDesc = document.querySelector(".temperature-description p");
const currentDate = document.querySelector(".date p");
const currentWind = document.querySelector(".wind");
const currentCloud = document.querySelector(".cloudiness");
const currentPressure = document.querySelector(".pressure");
const currentHumidity = document.querySelector(".humidity");
const currentSunrise = document.querySelector(".sunrise");
const currentSunset = document.querySelector(".sunset");
const currentGeocoods = document.querySelector(".geocoords");

const weather = {};

const KELVIN = 273;
const API_KEY = "6583a10880ef923f9901cd118d84d06f";
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// check if browser supports geolocation
navigator.geolocation.getCurrentPosition(setPosition, showError);

// user's position
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
  getForecast(latitude, longitude);
}

// show error if an issue with geolocation service
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p>${error.message}</p>`;
}

// get weather from api
function getWeather(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.temperature = Math.floor(data.main.temp - KELVIN);
      weather.date = new Date(data.dt * 1000);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.wind = data.wind.speed + "m/s, " + data.wind.deg + "°";
      weather.cloudiness = data.clouds.all + "%";
      weather.pressure = data.main.pressure + " hpa";
      weather.humidity = data.main.humidity + "%";
      weather.sunset = new Date(data.sys.sunset * 1000);
      weather.sunrise = new Date(data.sys.sunrise * 1000);
      weather.coordinates = `[${data.coord.lat}, ${data.coord.lon}]`;
    })
    .then(function () {
      displayWeather();
    });
}

// display weather
function displayWeather() {
  currentIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather.iconId}@2x.png"/>`;
  currentLocation.innerHTML = weather.city + " " + weather.country;
  currentTemp.innerHTML = weather.temperature + " °C";
  currentDesc.innerHTML =
    weather.description.charAt(0).toUpperCase() + weather.description.slice(1);
  currentDate.innerHTML = `${
    weather.date.getHours() < 10 ? "0" : ""
  }${weather.date.getHours()}:${
    weather.date.getMinutes() < 10 ? "0" : ""
  }${weather.date.getMinutes()} ${
    monthNames[weather.date.getMonth()]
  } ${weather.date.getFullYear()}`;
  currentWind.innerHTML = weather.wind;
  currentCloud.innerHTML = weather.cloudiness;
  currentPressure.innerHTML = weather.pressure;
  currentHumidity.innerHTML = weather.humidity;
  currentSunset.innerHTML = `${
    weather.sunset.getHours() < 10 ? "0" : ""
  }${weather.sunset.getHours()}:${
    weather.sunset.getMinutes() < 10 ? "0" : ""
  }${weather.sunset.getMinutes()}`;
  currentSunrise.innerHTML = `${
    weather.sunrise.getHours() < 10 ? "0" : ""
  }${weather.sunrise.getHours()}:${
    weather.sunrise.getMinutes() < 10 ? "0" : ""
  }${weather.sunrise.getMinutes()}`;
  currentGeocoods.innerHTML = weather.coordinates;
}

// 5 DAY FORECAST
const forecastContainer = document.querySelector(".forecast-weather");
const forecastDate = document.querySelector(".forecast-date p");
const forecastLocation = document.querySelector(".forecast-location");

function getForecast(latitude, longitude) {
  let forecast_api = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  fetch(forecast_api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      let list = data.list;

      forecastLocation.innerHTML =
        " " + data.city.name + ", " + data.city.country;
      forecastDate.innerHTML = new Date(list[0].dt * 1000).toDateString();

      for (let i = 0; i < list.length; i++) {
        if (list[i + 1] === undefined) return;

        let nextDay =
          new Date(list[i].dt * 1000).getDay() !==
          new Date(list[i + 1].dt * 1000).getDay();

        // ADD UI
        forecastContainer.insertAdjacentHTML(
          "beforeend",
          `<div class="forecast-about">
          <div class="forecast-time-icon">
              <p class="forecast-time">
                  ${
                    new Date(list[i].dt * 1000).getHours() < 10 ? "0" : ""
                  }${new Date(list[i].dt * 1000).getHours()}:${
            new Date(list[i].dt * 1000).getMinutes() < 10 ? "0" : ""
          }${new Date(list[i].dt * 1000).getMinutes()}
              </p>
              <div class="forecast-icon">
                <img src="http://openweathermap.org/img/wn/${
                  list[i].weather[0].icon
                }@2x.png"/>
              </div>
          </div>
          <div class="forecast-details">
              <div class="forecast-desc-temp">
                  <p class="forecast-temperature">
                      ${Math.floor(list[i].main.temp - KELVIN)} °C
                  </p>
                  <p class="forecast-description">
                      ${list[i].weather[0].description}
                  </p>
              </div>
              <div class="forecast-rest">
                  <p class="forecast-wind">
                      ${list[i].wind.speed} m/s
                  </p>
                  <p class="forecast-clouds">
                      ${list[i].clouds.all} %
                  </p>
                  <p class="forecast-pressure">
                      ${list[i].main.pressure} hpa
                  </p>
              </div>`
        );

        // Create day block
        if (nextDay) {
          let createNextElement = document.createElement("div");
          let nextElementText = document.createElement("p");

          nextElementText.innerHTML = new Date(
            list[i + 1].dt * 1000
          ).toDateString();

          forecastContainer.appendChild(createNextElement);
          createNextElement.appendChild(nextElementText);

          createNextElement.classList.add("forecast-date");
        }
      }
    });
}
