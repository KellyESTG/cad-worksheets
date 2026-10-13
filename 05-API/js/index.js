$(document).ready(function() {
    'use strict';

    const API_KEY = '3200274c4ea37dd29641fa568918cf01'; 
    let lastFetchTimestamp = null;

    function init() {
        setupToggleListeners();
        setupTemperatureUpdates();
        setupClock();
        setupWeather();
    }

    // Guardar e Restaurar o estado dos interruptores (Exercício 1.b e 1.d)
    function setupToggleListeners() {
        const switches = [
            { key: 'kitchen-light-switch', iconId: '#kitchen-light-icon', timeId: '#kitchen-light-time', activeColor: 'text-warning' },
            { key: 'living-ceiling-switch', iconId: '#living-ceiling-icon', timeId: '#living-ceiling-time', activeColor: 'text-warning' },
            { key: 'living-ambient-switch', iconId: '#living-ambient-icon', timeId: '#living-ambient-time', activeColor: 'text-warning' },
            { key: 'living-music-switch', iconId: '#living-music-icon', timeId: '#living-music-time', activeColor: 'text-primary' }
        ];

        switches.forEach(item => {
            const $switch =$('#' + item.key);
            const $icon =$(item.iconId);
            const $time =$(item.timeId);

            // 1. Carregar estado anterior do localStorage ao abrir/recarregar a página
            const savedDataStr = localStorage.getItem(item.key);
            if (savedDataStr) {
                try {
                    const savedData = JSON.parse(savedDataStr);
                    const isChecked = (savedData.action === 'On');
                    
                    // Forçar estado checked e atributo
                    $switch.prop('checked', isChecked);

                    if (isChecked) {
                        $icon.removeClass('text-secondary').addClass(item.activeColor);
                    } else {
                        $icon.removeClass(item.activeColor).addClass('text-secondary');
                    }

                    if (savedData.date) {
                        $time.text(savedData.date);
                    }
                } catch (e) {
                    console.error('Erro ao ler do localStorage para ' + item.key, e);
                }
            }

            // 2. Guardar no localStorage ao clicar no interruptor
            $switch.on('change', function() {
                const isChecked = $(this).is(':checked');
                const actionStr = isChecked ? 'On' : 'Off';
                const isoDateStr = new Date().toISOString();

                if (isChecked) {
                    $icon.removeClass('text-secondary').addClass(item.activeColor);
                } else {
                    $icon.removeClass(item.activeColor).addClass('text-secondary');
                }

                $time.text(isoDateStr);

                const dataObj = {
                    action: actionStr,
                    date: isoDateStr
                };

                // Gravação do objeto em JSON no localStorage (Exercício 1.b/1.d)
                localStorage.setItem(item.key, JSON.stringify(dataObj));
            });
        });
    }

    // Atualização automática de temperatura
    function setupTemperatureUpdates() {
        function updateTemps() {
            const randomKitchen = (Math.random() * (30 - 10) + 10).toFixed(1);
            const randomLiving = (Math.random() * (30 - 10) + 10).toFixed(1);

            $('#kitchen-temp').text(randomKitchen + ' °C');
            $('#living-temp').text(randomLiving + ' °C');
        }

        updateTemps();
        setInterval(updateTemps, 5000);
    }

    // Relógio em tempo real
    function setupClock() {
        function updateClock() {
            const now = new Date();

            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');

            $('#clock-time').text(`${hours}:${minutes}:${seconds}`);
            $('#clock-date').text(`${year}-${month}-${day}`);
        }

        updateClock();
        setInterval(updateClock, 1000);
    }

    // API OpenWeatherMap
    function setupWeather() {
        function fetchWeather(city) {
            const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${encodeURIComponent(city)}&appid=${API_KEY}`;

            $.getJSON(url, function(data) {
                displayWeatherData(
                    data.main.temp,
                    data.main.temp_max,
                    data.main.temp_min,
                    data.main.humidity,
                    new Date(data.sys.sunrise * 1000),
                    new Date(data.sys.sunset * 1000)
                );
            }).fail(function() {
                loadMockWeatherData(city);
            });
        }

        function loadMockWeatherData(city) {
            const mockTemp = 21.09;
            const mockTempMax = 21.20;
            const mockTempMin = 19.94;
            const mockHumidity = 93;
            
            const now = new Date();
            const sunrise = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 46);
            const sunset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 54);

            displayWeatherData(mockTemp, mockTempMax, mockTempMin, mockHumidity, sunrise, sunset);
        }

        function displayWeatherData(temp, tempMax, tempMin, humidity, sunriseDate, sunsetDate) {
            $('#weather-temp').text(Number(temp).toFixed(2) + ' °C');
            $('#weather-temp-max').text(Number(tempMax).toFixed(2) + ' °C');
            $('#weather-temp-min').text(Number(tempMin).toFixed(2) + ' °C');
            $('#weather-humidity').text(humidity + '%');

            const sunriseStr = sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const sunsetStr = sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            $('#weather-sunrise').text(sunriseStr);
            $('#weather-sunset').text(sunsetStr);

            lastFetchTimestamp = new Date();
            updateLastUpdateText();
        }

        function updateLastUpdateText() {
            if (!lastFetchTimestamp) return;

            const now = new Date();
            const diffInSeconds = Math.floor((now - lastFetchTimestamp) / 1000);

            let text = '';
            if (diffInSeconds < 60) {
                text = `${diffInSeconds} seconds ago`;
            } else if (diffInSeconds < 3600) {
                const mins = Math.floor(diffInSeconds / 60);
                text = `${mins} minute${mins > 1 ? 's' : ''} ago`;
            } else {
                const hours = Math.floor(diffInSeconds / 3600);
                text = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            }

            $('#weather-last-update').text(text);
        }

        $('#btn-get-weather').on('click', function() {
            const city = $('#city-input').val().trim();
            if (city !== '') {
                fetchWeather(city);
            }
        });

        const initialCity = $('#city-input').val();
        if (initialCity) {
            fetchWeather(initialCity);
        }

        setInterval(updateLastUpdateText, 1000);
    }

    init();
});