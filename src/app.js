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

// Callback if response ✅
function displayWeather(response) {
  //  Get elements, retrieve data from API & write in UI
  let cityEl = document.querySelector('#city');
  cityEl.innerHTML = response.data.name.replace('Arrondissement de', '');

  let iconEl = document.querySelector('#icon');
  iconEl.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconEl.setAttribute('alt', `${response.data.weather[0].description}`);

  let temperatureEl = document.querySelector('#temperature');
  temperatureEl.innerHTML = Math.round(response.data.main.temp);

  let perceptionEl = document.querySelector('#perception');
  perceptionEl.innerHTML = response.data.weather[0].description;

  let updateEl = document.querySelector('#update');
  updateEl.innerHTML = formattedDate(response.data.dt * 1000);

  let humidityEl = document.querySelector('#humidity');
  humidityEl.innerHTML = response.data.main.humidity;

  let windEl = document.querySelector('#wind');
  windEl.innerHTML = Math.round(response.data.wind.speed);

  getForecast(response.data.coord);
}

// Callback if response ❌
function displayError() {
  // Get elements
  let inputEl = document.querySelector('#search');
  let errorEl = document.querySelector('#error');

  // If city empty
  if (inputEl.value === '' || inputEl.value === null) {
    errorEl.innerHTML = 'Please enter a city';

    // If city undefined
  } else {
    errorEl.innerHTML = 'Please enter a valid city and try again';
  }

  // Clear input & error message on input click
  inputEl.addEventListener('click', function () {
    inputEl.value = '';
    errorEl.innerHTML = '';
  });
}

function getWeather(city) {
  // API URL parts
  let apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather';
  let unit = 'metric';
  let apiKey = 'eedb5c6bcfb2fdb0fcba2cac7bada0f6';

  // URL built
  let apiUrl = `${apiEndpoint}?q=${city}&units=${unit}&appid=${apiKey}`;

  //  API call & callbacks to be executed if response ok / if error
  axios.get(apiUrl).then(displayWeather).catch(displayError);
}

// Callback after form submission
function getCity(event) {
  event.preventDefault();

  // Get input element
  let inputEl = document.querySelector('#search');

  // Retrieve city value entered by user & clear input
  getWeather(inputEl.value.trim());
}

// On load, display default city
getWeather('Paris');

// Listen form submission
let searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', getCity);
