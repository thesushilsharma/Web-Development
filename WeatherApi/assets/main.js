class WeatherApp {
    constructor() {
        this.apiKey = ''; // We'll use OpenWeatherMap API
        this.currentData = null;
        this.isMetric = true;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentDate();
        this.getCurrentLocationWeather();

        // Update time every minute
        setInterval(() => this.updateCurrentDate(), 60000);
    }

    setupEventListeners() {
        // Temperature unit toggle
        $('#unitchange').on('click', () => this.toggleTemperatureUnit());

        // City search
        $('#citySearch').on('keypress', (e) => {
            if (e.which === 13) {
                const city = e.target.value.trim();
                if (city) {
                    this.getWeatherByCity(city);
                }
            }
        });

        // Quick city buttons
        $('.city-btn').on('click', (e) => {
            const city = $(e.target).data('city');
            this.getWeatherByCity(city);
        });
    }

    updateCurrentDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        $('#currentDate').text(now.toLocaleDateString('en-US', options));

        // Also update the time in weather card if it exists
        if ($('#dateTime').length) {
            const timeString = this.formatTime(now);
            const dateString = this.formatDate(now);
            $('#dateTime').html(`${timeString}<br><span class="text-sm text-white/70">${dateString}</span>`);
        }
    }

    getCurrentLocationWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    this.getWeatherByCoords(lat, lon);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.hideLoading();
                    this.showError('Unable to get your location. Please search for a city manually.');
                    // Default to London if geolocation fails
                    this.getWeatherByCity('Kathmandu');
                }
            );
        } else {
            this.hideLoading();
            this.showError('Geolocation is not supported by this browser.');
            this.getWeatherByCity('Kathmandu');
        }
    }

    async getWeatherByCoords(lat, lon) {
        try {
            // Using wttr.in API (no API key required)
            const response = await fetch(
                `https://wttr.in/?lat=${lat}&lon=${lon}&format=j1`
            );

            if (!response.ok) {
                throw new Error('Weather data not available');
            }

            const data = await response.json();
            this.displayWeatherDataWttr(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
            // Fallback to Open-Meteo API
            this.getWeatherByCoordsFallback(lat, lon);
        } finally {
            this.hideLoading();
        }
    }

    async getWeatherByCoordsFallback(lat, lon) {
        try {
            // Using Open-Meteo API (no API key required)
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
            );

            if (!response.ok) {
                throw new Error('Weather data not available');
            }

            const data = await response.json();
            this.displayWeatherDataOpenMeteo(data, lat, lon);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError('Unable to fetch weather data. Please try again.');
        }
    }

    async getWeatherByCity(city) {
        this.showLoading();
        try {
            // Using wttr.in API with city name directly (much simpler!)
            const response = await fetch(
                `https://wttr.in/${encodeURIComponent(city)}?format=j1`
            );

            if (!response.ok) {
                throw new Error('City not found');
            }

            const data = await response.json();
            this.displayWeatherDataWttr(data, city);
            $('#citySearch').val('');
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError(`Unable to find weather data for "${city}". Please check the city name and try again.`);
        } finally {
            this.hideLoading();
        }
    }

    displayWeatherDataWttr(data, cityName = null) {
        const current = data.current_condition[0];
        const nearest = data.nearest_area[0];

        this.currentData = {
            main: {
                temp: parseInt(current.temp_C),
                pressure: parseInt(current.pressure),
                humidity: parseInt(current.humidity)
            },
            wind: {
                speed: parseInt(current.windspeedKmph) / 3.6 // Convert km/h to m/s
            },
            weather: [{
                main: current.weatherDesc[0].value,
                description: current.weatherDesc[0].value.toLowerCase()
            }],
            dt: Math.floor(new Date().getTime() / 1000),
            timezone: 0
        };

        // Location
        const locationName = cityName || `${nearest.areaName[0].value}, ${nearest.country[0].value}`;
        $('.weather-location').text(locationName);

        // Temperature
        const temp = parseInt(current.temp_C);
        $('.temp').text(temp);
        $('.temp-type').text('°C');

        // Weather description and icon
        $('.weather-description').text(current.weatherDesc[0].value);

        // Use wttr.in weather icons or fallback to emoji
        const iconUrl = this.createWeatherIconFromDescription(current.weatherDesc[0].value);
        $('.weatherIcon').attr('src', iconUrl);

        // Weather details
        $('.pressure').text(`${current.pressure} hPa`);
        $('.humidity').text(`${current.humidity}%`);
        $('.windSpeed').text(`${current.windspeedKmph} km/h`);

        // Date and timezone - better formatting
        const now = new Date();
        const timeString = this.formatTime(now);
        const dateString = this.formatDate(now);

        $('#dateTime').html(`${timeString}<br><span class="text-sm text-white/70">${dateString}</span>`);

        // Get timezone info
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneOffset = now.getTimezoneOffset();
        const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
        const offsetMinutes = Math.abs(timezoneOffset % 60);
        const offsetSign = timezoneOffset <= 0 ? '+' : '-';
        const offsetString = `UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;

        $('#timezone').html(`${timezone}<br><span class="text-sm text-white/70">${offsetString}</span>`);

        // Add weather-based background effects
        this.updateBackgroundEffect(current.weatherDesc[0].value);

        // Show success state
        $('.weather-card').removeClass('error-state').addClass('success-state');
        setTimeout(() => $('.weather-card').removeClass('success-state'), 2000);
    }

    displayWeatherDataOpenMeteo(data, lat, lon, locationName = null) {
        this.currentData = {
            main: {
                temp: data.current_weather.temperature,
                pressure: data.hourly.surface_pressure ? data.hourly.surface_pressure[0] : 1013,
                humidity: data.hourly.relative_humidity_2m ? data.hourly.relative_humidity_2m[0] : 50
            },
            wind: {
                speed: data.current_weather.windspeed / 3.6 // Convert km/h to m/s for consistency
            },
            weather: [{
                main: this.getWeatherCondition(data.current_weather.weathercode),
                description: this.getWeatherDescription(data.current_weather.weathercode)
            }],
            dt: Math.floor(new Date().getTime() / 1000),
            timezone: 0
        };

        // Location - use provided name or get from reverse geocoding
        if (locationName) {
            $('.weather-location').text(locationName);
        } else {
            this.getLocationName(lat, lon);
        }

        // Temperature
        const temp = Math.round(data.current_weather.temperature);
        $('.temp').text(temp);
        $('.temp-type').text('°C');

        // Weather description and icon
        const weatherDesc = this.getWeatherDescription(data.current_weather.weathercode);
        $('.weather-description').text(weatherDesc);

        // Set weather icon based on weather code
        const iconUrl = this.getWeatherIcon(data.current_weather.weathercode, data.current_weather.is_day);
        $('.weatherIcon').attr('src', iconUrl);

        // Weather details
        const pressure = data.hourly.surface_pressure ? Math.round(data.hourly.surface_pressure[0]) : 1013;
        const humidity = data.hourly.relative_humidity_2m ? Math.round(data.hourly.relative_humidity_2m[0]) : 50;

        $('.pressure').text(`${pressure} hPa`);
        $('.humidity').text(`${humidity}%`);
        $('.windSpeed').text(`${Math.round(data.current_weather.windspeed)} km/h`);

        // Date and timezone - better formatting
        const now = new Date();
        const timeString = this.formatTime(now);
        const dateString = this.formatDate(now);

        $('#dateTime').html(`${timeString}<br><span class="text-sm text-white/70">${dateString}</span>`);

        // Get timezone info
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneOffset = now.getTimezoneOffset();
        const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
        const offsetMinutes = Math.abs(timezoneOffset % 60);
        const offsetSign = timezoneOffset <= 0 ? '+' : '-';
        const offsetString = `UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;

        $('#timezone').html(`${timezone}<br><span class="text-sm text-white/70">${offsetString}</span>`);

        // Add weather-based background effects
        this.updateBackgroundEffect(this.getWeatherCondition(data.current_weather.weathercode));

        // Show success state
        $('.weather-card').removeClass('error-state').addClass('success-state');
        setTimeout(() => $('.weather-card').removeClass('success-state'), 2000);
    }

    async getLocationName(lat, lon) {
        try {
            // Simple location name based on coordinates (you could use a reverse geocoding API)
            $('.weather-location').text(`${lat.toFixed(2)}°, ${lon.toFixed(2)}°`);
        } catch (error) {
            $('.weather-location').text('Current Location');
        }
    }

    getWeatherCondition(weatherCode) {
        // WMO Weather interpretation codes
        if (weatherCode === 0) return 'Clear';
        if (weatherCode <= 3) return 'Clouds';
        if (weatherCode <= 67) return 'Rain';
        if (weatherCode <= 77) return 'Snow';
        if (weatherCode <= 82) return 'Rain';
        if (weatherCode <= 86) return 'Snow';
        if (weatherCode <= 99) return 'Thunderstorm';
        return 'Clear';
    }

    getWeatherDescription(weatherCode) {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            95: 'Thunderstorm',
            96: 'Thunderstorm with hail',
            99: 'Thunderstorm with heavy hail'
        };
        return descriptions[weatherCode] || 'Unknown';
    }

    createWeatherIconFromDescription(weatherDesc) {
        // Map weather descriptions to emojis with comprehensive coverage
        const desc = weatherDesc.toLowerCase();
        let emoji = '☀️'; // default

        // Comprehensive weather condition mapping
        if (desc.includes('sunny') || desc.includes('clear')) {
            emoji = '☀️';
        } else if (desc.includes('partly cloudy') || desc.includes('partly')) {
            emoji = '⛅';
        } else if (desc.includes('cloudy') || desc.includes('overcast')) {
            emoji = '☁️';
        } else if (desc.includes('light rain') || desc.includes('patchy rain')) {
            emoji = '🌦️';
        } else if (desc.includes('moderate rain') || desc.includes('heavy rain')) {
            emoji = '🌧️';
        } else if (desc.includes('rain') || desc.includes('shower') || desc.includes('precipitation')) {
            emoji = '🌧️';
        } else if (desc.includes('drizzle') || desc.includes('light drizzle')) {
            emoji = '🌦️';
        } else if (desc.includes('snow') || desc.includes('blizzard')) {
            emoji = '❄️';
        } else if (desc.includes('thunder') || desc.includes('storm')) {
            emoji = '⛈️';
        } else if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) {
            emoji = '🌫️';
        } else if (desc.includes('wind')) {
            emoji = '💨';
        }

        // Create a high-quality emoji icon with better visibility
        return this.createVisibleEmojiIcon(emoji);
    }

    createVisibleEmojiIcon(emoji) {
        // Create a high-quality emoji icon without background
        const canvas = document.createElement('canvas');
        const size = 128;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Set up high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw the emoji with better font support and larger size
        ctx.font = '80px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Twemoji Mozilla", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add a subtle shadow for better visibility against colored backgrounds
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillText(emoji, size / 2, size / 2);

        return canvas.toDataURL('image/png');
    }

    getWttrIcon(weatherCode, weatherDesc) {
        // Map weather descriptions to emojis
        const desc = weatherDesc.toLowerCase();
        let emoji = '☀️'; // default

        if (desc.includes('sunny') || desc.includes('clear')) {
            emoji = '☀️';
        } else if (desc.includes('partly cloudy') || desc.includes('partly')) {
            emoji = '⛅';
        } else if (desc.includes('cloudy') || desc.includes('overcast')) {
            emoji = '☁️';
        } else if (desc.includes('rain') || desc.includes('shower')) {
            emoji = '�️';
        } else if (desc.includes('drizzle')) {
            emoji = '🌦️';
        } else if (desc.includes('snow') || desc.includes('blizzard')) {
            emoji = '❄️';
        } else if (desc.includes('thunder') || desc.includes('storm')) {
            emoji = '⛈️';
        } else if (desc.includes('fog') || desc.includes('mist')) {
            emoji = '🌫️';
        } else if (desc.includes('wind')) {
            emoji = '💨';
        }

        // Create a data URL for the emoji as an image
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.font = '100px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 64, 64);

        return canvas.toDataURL();
    }

    getWeatherIcon(weatherCode, isDay) {
        // Map weather codes to emojis
        let emoji = '☀️';

        if (weatherCode === 0) {
            emoji = isDay ? '☀️' : '🌙';
        } else if (weatherCode <= 3) {
            emoji = weatherCode === 1 ? '⛅' : '☁️';
        } else if (weatherCode <= 67) {
            emoji = weatherCode <= 55 ? '🌦️' : '🌧️';
        } else if (weatherCode <= 77) {
            emoji = '❄️';
        } else if (weatherCode <= 82) {
            emoji = '🌧️';
        } else if (weatherCode <= 86) {
            emoji = '❄️';
        } else if (weatherCode <= 99) {
            emoji = '⛈️';
        }

        return this.createVisibleEmojiIcon(emoji);
    }

    formatTime(date) {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-US', options);
    }

    formatDate(date) {
        const options = {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        };
        return date.toLocaleString('en-US', options);
    }

    formatDateTime(date) {
        const options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-US', options);
    }

    toggleTemperatureUnit() {
        if (!this.currentData) return;

        const tempElement = $('.temp');
        const typeElement = $('.temp-type');

        if (this.isMetric) {
            // Convert to Fahrenheit
            const fahrenheit = Math.round((this.currentData.main.temp * 9 / 5) + 32);
            tempElement.text(fahrenheit);
            typeElement.text('°F');
            this.isMetric = false;
        } else {
            // Convert to Celsius
            const celsius = Math.round(this.currentData.main.temp);
            tempElement.text(celsius);
            typeElement.text('°C');
            this.isMetric = true;
        }

        // Add animation effect
        $('#unitchange').addClass('animate-pulse-glow');
        setTimeout(() => $('#unitchange').removeClass('animate-pulse-glow'), 1000);
    }

    updateBackgroundEffect(weatherMain) {
        const body = $('body');
        body.removeClass('weather-clear weather-clouds weather-rain weather-snow weather-thunderstorm');

        const weather = weatherMain.toLowerCase();

        if (weather.includes('clear') || weather.includes('sunny')) {
            body.addClass('weather-clear');
        } else if (weather.includes('cloud') || weather.includes('overcast')) {
            body.addClass('weather-clouds');
        } else if (weather.includes('rain') || weather.includes('drizzle') || weather.includes('shower')) {
            body.addClass('weather-rain');
        } else if (weather.includes('snow') || weather.includes('blizzard')) {
            body.addClass('weather-snow');
        } else if (weather.includes('thunder') || weather.includes('storm')) {
            body.addClass('weather-thunderstorm');
        } else {
            // Default to clear for unknown conditions
            body.addClass('weather-clear');
        }
    }

    showLoading() {
        $('#loading').removeClass('hidden').addClass('flex');
    }

    hideLoading() {
        $('#loading').addClass('hidden').removeClass('flex');
    }

    showError(message) {
        $('.weather-card').addClass('error-state');

        // Create error notification
        const errorDiv = $(`
            <div class="fixed top-4 right-4 bg-red-500/90 backdrop-blur-md text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-up">
                <div class="flex items-center">
                    <span class="material-symbols-outlined mr-3">warning</span>
                    <span>${message}</span>
                </div>
            </div>
        `);

        $('body').append(errorDiv);

        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.fadeOut(() => errorDiv.remove());
            $('.weather-card').removeClass('error-state');
        }, 5000);
    }
}

// Initialize the weather app when document is ready
$(document).ready(() => {
    new WeatherApp();
});
