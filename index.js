import { saveSettingsDebounced } from "../../../../script.js";
import { extension_settings } from "../../../extensions.js";

const extensionName = "BB-UI-Regex-Pack";

// Твой список файлов
const myRegexes = [
    "regex-[bb]_tablet.json",
    "regex-[bb]_radio.json",
    "regex-[bb]_clocks.json",
    "regex-[bb]_transitions_single.json",
    "regex-[bb]_transitions_paired.json"
];

jQuery(async () => {
    try {
        // Точная копия метода загрузки HTML как у Kukachzh
        const settingsHtml = await $.get(`/scripts/extensions/third-party/${extensionName}/index.html`);
        
        // ВОТ ГЛАВНЫЙ ФИКС: Встраиваем во 2-й контейнер
        $("#extensions_settings2").append(settingsHtml);
        
        $('#bb-rp-install-btn').on('click', installRegexes);
    } catch (e) {
        console.error("[BB Regex Pack] Ошибка загрузки HTML:", e);
    }
});

async function installRegexes() {
    toastr.info("Впрыск регулярок запущен..."); // Желтое уведомление о начале

    if (!Array.isArray(extension_settings.regex)) {
        extension_settings.regex = [];
    }

    let added = 0;

    for (const file of myRegexes) {
        try {
            const response = await fetch(`/scripts/extensions/third-party/${extensionName}/regexes/${file}`);
            if (!response.ok) continue;
            
            const regexObj = await response.json();
            const existingIndex = extension_settings.regex.findIndex(r => r.id === regexObj.id);

            if (existingIndex !== -1) {
                extension_settings.regex[existingIndex] = regexObj; 
            } else {
                extension_settings.regex.push(regexObj); 
            }
            added++;
        } catch (error) {
            console.error(`Ошибка установки ${file}:`, error);
        }
    }

    if (added > 0) {
        saveSettingsDebounced(); // Сохраняем
        
        // Зеленое уведомление об успехе
        toastr.success(`Успех! Вшито деталей: ${added}.<br>Нажмите F5, чтобы обновить список.`);
    } else {
        toastr.warning("Не удалось найти файлы регулярок.");
    }
}