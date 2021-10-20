// Format date
function formattedDate(timestamp) {
  // New Date
  let now = new Date(timestamp);

  // Get day : match week days with index returned by getDay()
  let weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  let day = weekDays[now.getDay() - 1];

  // Get date
  let date = now.getDate();

  // Get hours & minutes
  let hours = now.getHours();
  let minutes = now.getMinutes();
  // Prefix 0
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${date} , ${hours}:${minutes}`;
}

// Format forecast day
function formatDay(timestamp) {
  // New date
  let date = new Date(timestamp * 1000);

  // Get day : match week days with index returned by getDay()
  let weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  let day = date.getDay();

  return weekDays[day];
}

// Display forecast
function displayForecast(response) {
  let forecastDaily = response.data.daily;

  // Get parent element
  let forecastEl = document.querySelector('#forecast');

  // Define template
  let forecastTemplate = '';

  // Make a template for each iteration
  forecastDaily.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastTemplate =
        forecastTemplate +
        `<div class="col-2 forecast">
                <div class="forecast-day">${formatDay(forecastDay.dt)}</div>
                <img src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                alt="${
                  forecastDay.weather[0].description
                }" class="forecast-image" id="forecast-icon">
                <div class="forecast-temperatures">
                        <span class="forecast-temperature max" id="forecast-max">${Math.round(
                          forecastDay.temp.max
                        )}°</span>
                        <span class="forecast-temperature min" id="forecast-min">${Math.round(
                          forecastDay.temp.min
                        )}°</span>
                </div>
        </div>`;
    }
  });

  // Write in UI forecast for each day according to template
  forecastEl.innerHTML = forecastTemplate;
}

// Get forecast
function getForecast(coords) {
  // API URL parts
  let apiEndpoint = 'https://api.openweathermap.org/data/2.5/onecall';
  let unit = 'metric';
  let apiKey = 'eedb5c6bcfb2fdb0fcba2cac7bada0f6';

  // API URL built
  let apiUrl = `${apiEndpoint}?lat=${coords.lat}&lon=${coords.lon}&units=${unit}&appid=${apiKey}`;

  // API call & callback
  axios.get(apiUrl).then(displayForecast);
}

// Callback after response returned
function displayWeather(response) {
  //  Get elements, retrieve data from API & write in UI
  let cityEl = document.querySelector('#city');
  cityEl.innerHTML = response.data.name;

  let iconEl = document.querySelector('#icon');
  iconEl.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconEl.setAttribute('alt', `${response.data.weather[0].description}`);

  let dateEl = document.querySelector('#date');
  dateEl.innerHTML = formattedDate(response.data.dt * 1000);

  let temperatureEl = document.querySelector('#temperature');
  celsiusTemperature = Math.round(response.data.main.temp);
  temperatureEl.innerHTML = celsiusTemperature;

  let perceptionEl = document.querySelector('#perception');
  perceptionEl.innerHTML = response.data.weather[0].description;

  let humidityEl = document.querySelector('#humidity');
  humidityEl.innerHTML = response.data.main.humidity;

  let windEl = document.querySelector('#wind');
  windEl.innerHTML = Math.round(response.data.wind.speed);

  getForecast(response.data.coord);
}

function getWeather(city) {
  // API URL parts
  let apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather';
  let unit = 'metric';
  let apiKey = 'eedb5c6bcfb2fdb0fcba2cac7bada0f6';

  // URL built
  let apiUrl = `${apiEndpoint}?q=${city}&units=${unit}&appid=${apiKey}`;

  //  API call & callback to be executed once response ok
  axios.get(apiUrl).then(displayWeather);
}

// Callback after form submission
function getCity(event) {
  event.preventDefault();

  // Get input element & retrieve city value entered by user
  let inputEl = document.querySelector('#search');
  getWeather(inputEl.value.trim());
}

// On load, display default city
getWeather('Paris');

// Global access
let celsiusTemperature = '';

function displayFahrenheitTemperature() {
  // Manage active class
  fahrenheitEl.classList.add('active');
  celsiusEl.classList.remove('active');

  // Convert °C ➡ °F
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;

  // Write in UI
  let temperatureEl = document.querySelector('#temperature');
  temperatureEl.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature() {
  // Manage active class
  celsiusEl.classList.add('active');
  fahrenheitEl.classList.remove('active');

  // Get initial value of temperature & write in UI
  let temperatureEl = document.querySelector('#temperature');
  temperatureEl.innerHTML = celsiusTemperature;
}

// Listen form submission
let searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', getCity);

// Listen fahrenheit link on click event
let fahrenheitEl = document.querySelector('#fahrenheit');
fahrenheitEl.addEventListener('click', displayFahrenheitTemperature);

// Listen celsius link on click event
let celsiusEl = document.querySelector('#celsius');
celsiusEl.addEventListener('click', displayCelsiusTemperature);
