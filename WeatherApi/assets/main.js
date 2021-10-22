$(document).ready(function () {

    var lat;
    var long;

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            lat = position.coords.latitude;
            long = position.coords.longitude;

            var api = 'https://fcc-weather-api.glitch.me/api/current?lat=' + lat + '&lon=' + long + '';
            // var api = 'https://fcc-weather-api.glitch.me/api/current?lat=43.642567&lon=-79.387054';

            $.getJSON(api, function (data) {

                var celsius = data.main.temp;
                var farenheit = (celsius * 1.8) + 32;
                var timezone = data.timezone / 3600;

                $('.weather-location').html(data.name + ", " + data.sys.country);
                $('.temp').html(Math.floor(celsius));
                $('.pressure').html(data.main.pressure + 'hpa');
                $('#timezone').html(timezone + 'hr');
                $('.weather-description').html(data.weather[0].description);
                $('.weatherIcon').attr('src', data.weather[0].icon);
                $('.windSpeed').html(data.wind.speed + 'km/h');
                $('.humidity').html(data.main.humidity + '%');
                $('#unitchange').on('click', function () {
                    if ($('.temp').html() == (Math.floor(celsius))) {
                        $('.temp').html(Math.floor(farenheit));
                        $('.temp-type').html('°F');

                    } else {
                        $('.temp').html(Math.floor(celsius));
                        $('.temp-type').html('°C');
                    }
                });
                var myDate = new Date(data.dt * 1000);
                $('#dateTime').html(myDate.toUTCString() + "<br>" + myDate.toLocaleString());
            });
        });
    }
    
    else {
        alert('geolocation not available?!?');
    }
});
