import { saveSettingsDebounced } from "../../../../script.js";
import { extension_settings } from "../../../extensions.js";

const extensionName = "bb-regex-pack";
const extensionFolderPath = `/scripts/extensions/third-party/${extensionName}`;

// Список твоих файлов (без изменений)
const myRegexes = [
    "regex-[bb]_tablet.json",
    "regex-[bb]_radio.json",
    "regex-[bb]_clocks.json",
    "regex-[bb]_transitions_single.json",
    "regex-[bb]_transitions_paired.json"
];

jQuery(async () => {
    console.log("[BB Regex Pack] Заводим мотор...");

    try {
        // 1. Прикручиваем нашу панель в меню расширений ST
        const settingsHtml = await $.get(`${extensionFolderPath}/index.html`);
        $("#extensions_settings").append(settingsHtml);
        
        // 2. Вешаем слушатель на кнопку
        $('#bb-rp-install-btn').on('click', installRegexes);
        
        console.log("[BB Regex Pack] Приборная панель установлена!");
    } catch (e) {
        console.error("[BB Regex Pack] Ошибка сборки интерфейса:", e);
    }
});

async function installRegexes() {
    const statusEl = document.getElementById("bb-rp-status");
    statusEl.innerText = "Впрыск...";
    statusEl.className = "bb-status-visible";

    // Убедимся, что массив регулярок существует в ядре
    if (!Array.isArray(extension_settings.regex)) {
        extension_settings.regex = [];
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

            // Проверяем по ID, чтобы не плодить дубликаты
            const existingIndex = extension_settings.regex.findIndex(r => r.id === regexObj.id);

            if (existingIndex !== -1) {
                // Обновляем старую регулярку
                extension_settings.regex[existingIndex] = regexObj;
                console.log(`[BB Regex Pack] Обновлено: ${regexObj.scriptName}`);
            } else {
                // Вшиваем новую
                extension_settings.regex.push(regexObj);
                console.log(`[BB Regex Pack] Установлено: ${regexObj.scriptName}`);
            }
            installedCount++;
        } catch (error) {
            console.error(`[BB Regex Pack] Сбой при установке ${file}:`, error);
        }
    }

    // Сохраняем в базу данных таверны по-современному
    saveSettingsDebounced();
    
    // Обновляем UI списка регулярок
    if (typeof window.populateRegex === 'function') {
        window.populateRegex();
    }

    statusEl.innerText = `Успех! Вшито: ${installedCount}`;
    setTimeout(() => { statusEl.className = ""; }, 3000);
}