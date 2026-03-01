import { saveSettingsDebounced } from "../../../../script.js";
import { extension_settings } from "../../../extensions.js";

const extensionName = "bb-regex-pack";

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
    const statusEl = $("#bb-rp-status");
    statusEl.text("Впрыск...").css("opacity", "1");

    // Инициализируем массив регексов, если его нет (как в рабочем примере)
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
                extension_settings.regex[existingIndex] = regexObj; // Обновляем
            } else {
                extension_settings.regex.push(regexObj); // Добавляем новый
            }
            added++;
        } catch (error) {
            console.error(`Ошибка установки ${file}:`, error);
        }
    }

    if (added > 0) {
        saveSettingsDebounced(); // Нативное сохранение ST
        
        if (typeof window.populateRegex === 'function') {
            window.populateRegex(); // Обновляем список на экране
        }
        
        statusEl.text(`Успех! Вшито: ${added}`).css("color", "#10b981");
        setTimeout(() => statusEl.css("opacity", "0"), 3000);
    }
}