IMPORTANT: Replace with your actual OpenWeatherMap API key
const API_KEY = 'YOUR_API_KEY'; // <<< GET YOUR API KEY FROM OpenWeatherMap.org

const fetchWeather = async (location) => {
    if (!location) {
        displayError('Please enter a city name.');
        return;
    }

    // Show loading indicator, hide previous info/errors
    loadingIndicator.style.display = 'block';
    weatherInfoDiv.style.display = 'none';
    errorMessage.style.display = 'none';

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=<span class="math-inline">\{location\}&appid\=</span>{API_KEY}&units=metric`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please try again.');
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        displayError(error.message);
    } finally {
        loadingIndicator.style.display = 'none'; // Hide loading indicator
    }
};

const displayWeather = (data) => {
    if (data && data.main && data.weather && data.wind) {
        cityNameElement.textContent = data.name;
        temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
        descriptionElement.textContent = data.weather[0].description;
        humidityElement.textContent = `${data.main.humidity}%`;
        windSpeedElement.textContent = `${data.wind.speed} m/s`;

        const iconCode = data.weather[0].icon;
        weatherIconElement.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIconElement.alt = data.weather[0].main;

        weatherInfoDiv.style.display = 'block'; // Show weather info
    } else {
        displayError('Could not retrieve weather data. Please try again.');
    }
};

const displayError = (message) => {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherInfoDiv.style.display = 'none'; // Hide weather info if there's an error
};

// Event listener for the search button
searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    fetchWeather(location);
});

// Event listener for 'Enter' key in the input field
locationInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const location = locationInput.value.trim();
        fetchWeather(location);
    }
});

// Optional: Fetch weather for a default city on load
// fetchWeather('Nizamabad'); // Example: Fetch weather for Nizamabad on page load
