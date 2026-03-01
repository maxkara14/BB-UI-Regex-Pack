// bb-regex-pack/index.js
const extensionName = "bb-regex-pack";

// ВАЖНО: Никакого ведущего слэша! Это решает проблему путей на любых сборках.
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

const myRegexes = [
    "regex-[bb]_tablet.json",
    "regex-[bb]_radio.json",
    "regex-[bb]_clocks.json",
    "regex-[bb]_transitions_single.json",
    "regex-[bb]_transitions_paired.json"
];

// Загружаемся только когда ядро ST готово
jQuery(async () => {
    console.log("[BB Regex Pack] Пробуем отрисовать панель...");

    try {
        // Подтягиваем HTML по относительному пути
        const settingsHtml = await $.get(`${extensionFolderPath}/index.html`);
        
        // Встраиваем в меню расширений
        $("#extensions_settings").append(settingsHtml);
        
        // Оживляем кнопку
        $('#bb-rp-install-btn').on('click', installRegexes);
        
        console.log("[BB Regex Pack] Панель успешно добавлена в #extensions_settings!");
    } catch (e) {
        console.error("[BB Regex Pack] Критическая ошибка сборки интерфейса:", e);
    }
});

async function installRegexes() {
    const statusEl = document.getElementById("bb-rp-status");
    if (!statusEl) return;
    
    statusEl.innerText = "Впрыск...";
    statusEl.className = "bb-status-visible";

    // Ищем, где хранятся регулярки в текущей версии ST (совместимость со всеми версиями)
    let targetArray = null;
    if (window.extension_settings && Array.isArray(window.extension_settings.regex)) {
        targetArray = window.extension_settings.regex;
    } else if (Array.isArray(window.regex_data)) {
        targetArray = window.regex_data;
    } else {
        if (window.extension_settings) {
            window.extension_settings.regex = [];
            targetArray = window.extension_settings.regex;
        } else {
            console.error("[BB Regex Pack] Ядро регулярок не найдено.");
            statusEl.innerText = "Ошибка ядра";
            return;
        }
    }

    let installedCount = 0;

    for (const file of myRegexes) {
        try {
            const response = await fetch(`${extensionFolderPath}/regexes/${file}`);
            if (!response.ok) {
                console.warn(`[BB Regex Pack] Деталь не найдена: ${file}`);
                continue;
            }
            const regexObj = await response.json();

            // Проверяем дубликаты
            const existingIndex = targetArray.findIndex(r => r.id === regexObj.id || r.scriptName === regexObj.scriptName);

            if (existingIndex !== -1) {
                targetArray[existingIndex] = regexObj; // Обновляем
            } else {
                targetArray.push(regexObj); // Добавляем новые
            }
            installedCount++;
        } catch (error) {
            console.error(`[BB Regex Pack] Сбой установки ${file}:`, error);
        }
    }

    // Сохраняем на диск безопасным методом (универсальный фоллбэк)
    if (typeof window.saveSettingsDebounced === 'function') {
        window.saveSettingsDebounced();
    } else if (typeof window.saveSettings === 'function') {
        window.saveSettings();
    }

    // Обновляем визуальный список в меню
    if (typeof window.populateRegex === 'function') {
        window.populateRegex();
    }

    statusEl.innerText = `Успех! Вшито: ${installedCount}`;
    setTimeout(() => { statusEl.className = ""; }, 3000);
}