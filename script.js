const searchInput = document.getElementById('input-city');
const buttonTrigger = document.getElementById('getWeatherBtn');
const cardDisplay = document.getElementById('weather-summary-info');
const locationDisplay = document.getElementById('location');
const darkMode = document.getElementById('dark-button');
const message = document.querySelector('#message');
const apiKey = '09fe8af0360f4d3e2873b3d6543f144e';

cardDisplay.classList.add('cardDisplay');

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try{    
        const response = await fetch(apiUrl);
        if(!response.ok){
            throw new Error('City not found');
        }
            const data = await response.json();
            return data;
    } catch (error) {
        return null; 
    }
}
function displayWeather(data){
    if(!data){
        message.innerHTML = "NOT FOUND!";
        return;
    }

    const {name: city, 
           main: {temp, humidity}, 
           weather: [{description, id}],
        timezone} = data;

        const localTime = new Date(Date.now() + timezone * 1000);
        const hrs = localTime.getUTCHours().toString().padStart(2, '0');
        const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
        const formattedTime = `${hrs}:${minutes}`;

           cardDisplay.textContent = "";

           const timeDisplay = document.createElement('p');
           const cityDisplay = document.createElement('h1');
           const tempDisplay = document.createElement('p');
           const humidityDisplay = document.createElement('p');
           const descriptionDisplay = document.createElement('p');
           const iconDisplay = document.createElement('p');

        timeDisplay.textContent = `${formattedTime}`;
        locationDisplay.textContent = `${city}, ${data.sys.country}`;  
        cityDisplay.textContent = `${city}`;
        tempDisplay.textContent = `Temp: ${temp}°C`;
        humidityDisplay.textContent = `Humidity: ${humidity}`;
        descriptionDisplay.textContent = `${description}`;
        
        iconDisplay.innerHTML = getWeatherDisplay(id);

        cardDisplay.appendChild(timeDisplay);
        cardDisplay.appendChild(locationDisplay);
        cardDisplay.appendChild(cityDisplay);
        cardDisplay.appendChild(tempDisplay);
        cardDisplay.appendChild(humidityDisplay);
        cardDisplay.appendChild(descriptionDisplay);
        cardDisplay.appendChild(iconDisplay);

        cityDisplay.classList.add("cityDisplay");
        tempDisplay.classList.add("tempDisplay");
        humidityDisplay.classList.add("humidityDisplay");
        descriptionDisplay.classList.add("descriptionDisplay");
        iconDisplay.classList.add("iconDisplay");  

        display(data);
}

function getWeatherDisplay(weatherId){

        let iconFile = "unknown.svg";
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            iconFile = "thunderstorm-one-svgrepo-com.svg";
            break;
        case (weatherId >= 300 && weatherId < 400):
            iconFile = "cloud-drizzle-svgrepo-com.svg";
            break;
        case (weatherId >= 500 && weatherId < 600):
            iconFile = "rain-svgrepo-com.svg";
            break;
        case (weatherId >= 600 && weatherId < 700):
            iconFile = "snow-svgrepo-com.svg";
            break;
        case (weatherId >= 700 && weatherId < 800):
            iconFile = "mist-svgrepo-com.svg";
            break;
        case (weatherId === 800):
            iconFile = "sunny-day-svgrepo-com.svg";
            break;
        case (weatherId >= 801 && weatherId < 810):
            iconFile = "clouds-svgrepo-com.svg";
            break;
    }
        return `<img src="assets/${iconFile}" alt="Weather" class="weather-icon">`;
}

function display(data){
    const localTime = new Date((data.dt || Date.now()) * 1000 + data.timezone * 1000);

    const optionsDate = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };

    const formattedDate = localTime.toLocaleDateString('en-PH', optionsDate);

    const displayText = document.createElement('h1');
    const displayCountryName = document.createElement('h4');
    const displayDate = document.createElement('h4');

    locationDisplay.textContent = "";

    displayText.textContent = "SEARCH CITY";
    displayCountryName.textContent = `${data.name}, ${data.sys.country}`;
    displayDate.textContent = formattedDate;

    locationDisplay.appendChild(displayText);
    locationDisplay.appendChild(displayCountryName);
    locationDisplay.appendChild(displayDate);

    displayDate.classList.add('displayDate');
    locationDisplay.classList.add('location-display');

}
    
    window.addEventListener('load', async () => {
    message.innerHTML = "Loading Manila weather...";
    const data = await getWeatherData("Manila");
    message.innerHTML = "";
    display(data);
});

searchInput.addEventListener('keyup', async (e) => {
    const cityInput = searchInput.value.trim();
    if(e.key === 'Enter'){
    if(cityInput === '') {
        message.innerHTML = "Please enter a city";
        setTimeout(() => {
        message.innerHTML = "";
        }, 3000);
        return;
    }
        message.innerHTML = "Loading...";
        const data = await getWeatherData(cityInput);
        message.innerHTML = "";
        displayWeather(data);
        searchInput.value = "";  
    }
});

buttonTrigger.addEventListener('click', async () => {
    const cityInput = searchInput.value.trim();

    if (cityInput === '') {
        message.innerHTML = "Please enter a city";
        setTimeout(() => {
            message.innerHTML = "";
        }, 3000);
        return;
    }
    message.innerHTML = "Loading...";
    const data = await getWeatherData(cityInput);
    message.innerHTML = "";
    displayWeather(data);
    searchInput.value = "";
});


let isDark = false;  

darkMode.addEventListener('click', () => {
    if (isDark) {
        document.body.style.background = "linear-gradient(60deg, rgba(189, 189, 189, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(189, 189, 189, 1) 100%)";
        darkMode.textContent = "Dark Mode";
    } else {
        document.body.style.background = "linear-gradient(60deg, rgba(189, 189, 189, 1) 0%, rgba(0, 0, 0, 1) 50%, rgba(189, 189, 189, 1) 100%)";
        darkMode.textContent = "Red Mode";
    }
    isDark = !isDark;  
});
