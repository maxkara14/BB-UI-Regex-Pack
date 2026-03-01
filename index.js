import { saveSettingsDebounced, populateRegex } from "../../../../script.js";
import { extension_settings } from "../../../extensions.js";

// ТВОЯ ПАПКА
const extensionName = "BB-UI-Regex-Pack";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// Реестр твоих деталей
const bbModules = [
    { id: "tablet", file: "regex-[bb]_tablet.json", name: "📱 Планшет (SimsOS)" },
    { id: "radio", file: "regex-[bb]_radio.json", name: "📻 Радио (Lycoris FM)" },
    { id: "clocks", file: "regex-[bb]_clocks.json", name: "🕰️ Часы (Time Info)" },
    { id: "trans_single", file: "regex-[bb]_transitions_single.json", name: "⚡ Переходы (Одиночные)" },
    { id: "trans_paired", file: "regex-[bb]_transitions_paired.json", name: "📖 Переходы (Парные)" }
];

// Оперативная память для загруженных JSON-ов
let loadedRegexes = {};

jQuery(async () => {
    try {
        // 1. Грузим интерфейс
        const settingsHtml = await $.get(`${extensionFolderPath}/index.html`);
        $("#extensions_settings2").append(settingsHtml);

        // 2. Подготавливаем базу данных в настройках
        if (!extension_settings[extensionName]) {
            extension_settings[extensionName] = { enabled: [] };
        }
        if (!Array.isArray(extension_settings.regex)) {
            extension_settings.regex = [];
        }

        // 3. Считываем файлы в память
        await loadRegexFiles();

        // 4. Отрисовываем чекбоксы
        renderManagerUI();

    } catch (e) {
        console.error("[BB Regex Manager] Ошибка запуска:", e);
    }
});

// Функция чтения файлов (работает в фоне)
async function loadRegexFiles() {
    for (const mod of bbModules) {
        try {
            const response = await fetch(`${extensionFolderPath}/regexes/${mod.file}`);
            if (response.ok) {
                loadedRegexes[mod.id] = await response.json();
            }
        } catch (e) {
            console.warn(`[BB RM] Не удалось загрузить деталь: ${mod.file}`);
        }
    }
}

// Отрисовка списка галочек
function renderManagerUI() {
    const listContainer = $("#bb-rm-list");
    listContainer.empty();

    bbModules.forEach(mod => {
        if (!loadedRegexes[mod.id]) return; // Если файла нет в папке, не рисуем

        // Проверяем, была ли галочка включена ранее
        const isEnabled = extension_settings[extensionName].enabled.includes(mod.id);

        const cardHtml = `
            <div class="bb-rm-card">
                <label>
                    <input type="checkbox" data-mod-id="${mod.id}" ${isEnabled ? "checked" : ""}>
                    ${mod.name}
                </label>
            </div>
        `;
        listContainer.append(cardHtml);
    });

    // Вешаем слушатель на клик по галочкам
    listContainer.find("input[type=checkbox]").on("change", function() {
        const modId = $(this).data("mod-id");
        const isChecked = $(this).is(":checked");
        toggleRegex(modId, isChecked);
    });
}

// Магия включения/выключения
function toggleRegex(modId, isChecked) {
    const regexObj = loadedRegexes[modId];
    if (!regexObj) return;

    let enabledList = extension_settings[extensionName].enabled;

    if (isChecked) {
        // ВКЛЮЧИТЬ
        if (!enabledList.includes(modId)) enabledList.push(modId);
        
        // Вшиваем в ядро (если там его еще нет)
        const exists = extension_settings.regex.findIndex(r => r.id === regexObj.id);
        if (exists === -1) {
            extension_settings.regex.push(regexObj);
        } else {
            extension_settings.regex[exists] = regexObj; // Перезапись на свежую версию
        }
        toastr.success(`Включено:\n${bbModules.find(m => m.id === modId).name}`);
    } else {
        // ВЫКЛЮЧИТЬ
        extension_settings[extensionName].enabled = enabledList.filter(id => id !== modId);
        
        // Вырезаем из ядра
        extension_settings.regex = extension_settings.regex.filter(r => r.id !== regexObj.id);
        toastr.info(`Выключено:\n${bbModules.find(m => m.id === modId).name}`);
    }

    // Сохраняем на диск и МГНОВЕННО обновляем интерфейс Таверны
    saveSettingsDebounced();
    if (typeof populateRegex === 'function') {
        populateRegex();
    }
}