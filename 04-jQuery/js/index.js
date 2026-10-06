$(document).ready(function() {
    'use strict';

    // Chave de API da OpenWeatherMap configurada
    const API_KEY = '3200274c4ea37dd29641fa568918cf01'; 
    let lastFetchTimestamp = null;

    // Inicialização da aplicação
    function init() {
        setupToggleListeners();
        setupTemperatureUpdates();
        setupClock();
        setupWeather();
    }

    // Controlo dos interruptores com sintaxe jQuery
    function setupToggleListeners() {
        const switches = [
            { switchId: '#kitchen-light-switch', iconId: '#kitchen-light-icon', activeColor: 'text-warning' },
            { switchId: '#living-ceiling-switch', iconId: '#living-ceiling-icon', activeColor: 'text-warning' },
            { switchId: '#living-ambient-switch', iconId: '#living-ambient-icon', activeColor: 'text-warning' },
            { switchId: '#living-music-switch', iconId: '#living-music-icon', activeColor: 'text-primary' }
        ];

        switches.forEach(item => {
            $(item.switchId).on('change', function() {
                const $icon =$(item.iconId);
                if (this.checked) {
                    $icon.removeClass('text-secondary').addClass(item.activeColor);
                } else {
                    $icon.removeClass(item.activeColor).addClass('text-secondary');
                }
            });
        });
    }

    // Atualização de temperaturas aleatórias a cada 5 segundos
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

    // Relógio e data em tempo real
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

    // Obter Meteorologia via API OpenWeatherMap
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
                alert('Não foi possível obter a meteorologia para essa cidade. A carregar dados de demonstração.');
                loadMockWeatherData(city);
            });
        }

        // Dados simulados de reserva caso ocorra algum erro na rede
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

        // Atualizar os elementos HTML com os dados de meteorologia
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

        // Atualizador dinâmico do tempo decorrido ("Last Update")
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

        // Evento do botão "Get"
        $('#btn-get-weather').on('click', function() {
            const city = $('#city-input').val().trim();
            if (city !== '') {
                fetchWeather(city);
            }
        });

        // Pesquisa inicial automática para a cidade predefinida (Leiria)
        const initialCity = $('#city-input').val();
        if (initialCity) {
            fetchWeather(initialCity);
        }

        // Atualização do texto "Last Update" de segundo a segundo
        setInterval(updateLastUpdateText, 1000);
    }

    // Executar a aplicação
    init();
});