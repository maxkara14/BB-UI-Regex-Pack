// ВАЖНО: Убедись, что имя папки в ST в точности совпадает с этой переменной!
const extensionName = "bb-regex-pack"; 
const extensionFolderPath = `/scripts/extensions/third-party/${extensionName}`;

const myRegexes = [
    "regex-[bb]_tablet.json",
    "regex-[bb]_radio.json",
    "regex-[bb]_clocks.json",
    "regex-[bb]_transitions_single.json",
    "regex-[bb]_transitions_paired.json"
];

jQuery(async () => {
    console.log("[BB Regex Pack] Запуск скрипта...");

    try {
        // Загружаем HTML интерфейс
        const settingsHtml = await $.get(`${extensionFolderPath}/index.html`);
        $("#extensions_settings").append(settingsHtml);
        
        // Подключаем кнопку
        $('#bb-rp-install-btn').on('click', installRegexes);
        
        console.log("[BB Regex Pack] Панель успешно отрисована!");
    } catch (e) {
        console.error("[BB Regex Pack] ОШИБКА: Не удалось загрузить index.html. Скорее всего, имя папки не совпадает с 'bb-regex-pack'.", e);
    }
});

async function installRegexes() {
    const statusEl = document.getElementById("bb-rp-status");
    statusEl.innerText = "Установка...";
    statusEl.className = "bb-status-visible";

    // Инициализируем массив регулярок, если он пуст
    if (!window.extension_settings.regex) {
        window.extension_settings.regex = [];
    }

    let installedCount = 0;

    for (const file of myRegexes) {
        try {
            const response = await fetch(`${extensionFolderPath}/regexes/${file}`);
            if (!response.ok) {
                console.warn(`[BB Regex Pack] Файл не найден: ${file}`);
                continue;
            }
            const regexObj = await response.json();

            const existingIndex = window.extension_settings.regex.findIndex(r => r.id === regexObj.id);

            if (existingIndex !== -1) {
                // Обновляем
                window.extension_settings.regex[existingIndex] = regexObj;
            } else {
                // Добавляем
                window.extension_settings.regex.push(regexObj);
            }
            installedCount++;
        } catch (error) {
            console.error(`[BB Regex Pack] Ошибка при чтении ${file}:`, error);
        }
    }

    // Сохраняем настройки
    if (typeof window.saveSettingsDebounced === 'function') {
        window.saveSettingsDebounced();
    } else if (typeof window.saveSettings === 'function') {
        window.saveSettings();
    }
    
    // Обновляем интерфейс менеджера регулярок
    if (typeof window.populateRegex === 'function') {
        window.populateRegex();
    }

    statusEl.innerText = `Успешно! Добавлено: ${installedCount}`;
    setTimeout(() => { statusEl.className = ""; }, 3000);
}