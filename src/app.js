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

  // Get month : match months with index returned by getmonth()
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  let month = months[now.getMonth()];

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

  return `${day} ${month}, ${date} - ${hours}:${minutes}`;
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
  console.log(dateEl.innerHTML);

  let temperatureEl = document.querySelector('#temperature');
  celsiusTemperature = Math.round(response.data.main.temp);
  temperatureEl.innerHTML = celsiusTemperature;

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
searchForm.addEventListener('submit', getWeather);

// Listen fahrenheit link on click event
let fahrenheitEl = document.querySelector('#fahrenheit');
fahrenheitEl.addEventListener('click', displayFahrenheitTemperature);

// Listen celsius link on click event
let celsiusEl = document.querySelector('#celsius');
celsiusEl.addEventListener('click', displayCelsiusTemperature);
