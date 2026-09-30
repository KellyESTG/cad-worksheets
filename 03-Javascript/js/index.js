var app = (function() {
    'use strict';

    // Função principal de inicialização
    function init() {
        setupToggleListeners();
        setupTemperatureUpdates();
        setupClock();
    }

    // 2.a, 2.b, 2.c, 2.d: Controlo dos interruptores e alteração de cores dos ícones
    function setupToggleListeners() {
        const switches = [
            { switchId: 'kitchen-light-switch', iconId: 'kitchen-light-icon', activeColor: 'text-warning' },
            { switchId: 'living-ceiling-switch', iconId: 'living-ceiling-icon', activeColor: 'text-warning' },
            { switchId: 'living-ambient-switch', iconId: 'living-ambient-icon', activeColor: 'text-warning' },
            { switchId: 'living-music-switch', iconId: 'living-music-icon', activeColor: 'text-primary' }
        ];

        switches.forEach(item => {
            const switchEl = document.getElementById(item.switchId);
            const iconEl = document.getElementById(item.iconId);

            if (switchEl && iconEl) {
                switchEl.addEventListener('change', function() {
                    if (this.checked) {
                        iconEl.classList.remove('text-secondary');
                        iconEl.classList.add(item.activeColor);
                    } else {
                        iconEl.classList.remove(item.activeColor);
                        iconEl.classList.add('text-secondary');
                    }
                });
            }
        });
    }

    // 2.e: Atualizar a temperatura a cada 5 segundos com valor aleatório entre 10 e 30 °C
    function setupTemperatureUpdates() {
        function updateTemps() {
            const kitchenTempEl = document.getElementById('kitchen-temp');
            const livingTempEl = document.getElementById('living-temp');

            if (kitchenTempEl && livingTempEl) {
                const randomKitchenTemp = (Math.random() * (30 - 10) + 10).toFixed(1);
                const randomLivingTemp = (Math.random() * (30 - 10) + 10).toFixed(1);

                kitchenTempEl.textContent = randomKitchenTemp + ' °C';
                livingTempEl.textContent = randomLivingTemp + ' °C';
            }
        }

        updateTemps();
        setInterval(updateTemps, 5000);
    }

    // 2.f: Atualizar data e relógio automaticamente (tempo real a cada segundo)
    function setupClock() {
        const timeEl = document.getElementById('clock-time');
        const dateEl = document.getElementById('clock-date');

        function updateClock() {
            const now = new Date();

            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');

            if (timeEl) {
                timeEl.textContent = `${hours}:${minutes}:${seconds}`;
            }
            if (dateEl) {
                dateEl.textContent = `${year}-${month}-${day}`;
            }
        }

        updateClock();
        setInterval(updateClock, 1000);
    }

    // Executa a inicialização
    init();

})();