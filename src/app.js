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

  //   todo date format
  //   console.log(response.data.coord.dt);

  let temperatureEl = document.querySelector('#temperature');
  temperatureEl.innerHTML = Math.round(response.data.main.temp);

  let perceptionEl = document.querySelector('#perception');
  perceptionEl.innerHTML = response.data.weather[0].description;

  let humidityEl = document.querySelector('#humidity');
  humidityEl.innerHTML = response.data.main.humidity;

  let windEl = document.querySelector('#wind');
  windEl.innerHTML = Math.round(response.data.wind.speed);
}

// Callback after form submission
function getWeather(event) {
  event.preventDefault();

  // API URL parts
  let apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather';
  // Get input element & retrieve city value entered by user
  let inputEl = document.querySelector('#search');
  let city = inputEl.value.trim();
  let unit = 'metric';
  let apiKey = 'eedb5c6bcfb2fdb0fcba2cac7bada0f6';

  // URL built
  let apiUrl = `${apiEndpoint}?q=${city}&units=${unit}&appid=${apiKey}`;

  //  API call & callback to be executed once response ok
  axios.get(apiUrl).then(displayWeather);
}

let searchForm = document.querySelector('#search-form');
searchForm.addEventListener('submit', getWeather);
