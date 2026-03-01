import { saveSettingsDebounced } from "../../../../script.js";
import { extension_settings } from "../../../extensions.js";

const extensionName = "BB-UI-Regex-Pack";
const extensionFolderPath = `/scripts/extensions/third-party/${extensionName}`;

// РЕЕСТР ДЕТАЛЕЙ (Теперь используем массив files вместо одного file)
const bbModules = [
    { id: "tablet", files: ["regex-[bb]_tablet.json"], name: "📱 tablet" },
    { id: "radio", files: ["regex-[bb]_radio.json"], name: "🎙️ radio" },
    { id: "clocks", files: ["regex-[bb]_clocks.json"], name: "⌛ clocks" },
    // А вот тут мы объединили оба файла переходов в одну галочку!
    { id: "transitions", files: ["regex-[bb]_transitions_single.json", "regex-[bb]_transitions_paired.json"], name: "🚦 transitions" }
];

let loadedRegexes = {};

jQuery(async () => {
    try {
        const settingsHtml = await $.get(`${extensionFolderPath}/index.html`);
        // Проверяем, куда встраивать. У разных версий ST могут быть разные контейнеры
        if ($("#extensions_settings2").length) {
            $("#extensions_settings2").append(settingsHtml);
        } else {
            $("#extensions_settings").append(settingsHtml);
        }

        if (!extension_settings[extensionName]) {
            extension_settings[extensionName] = { enabled: [] };
        }
        if (!Array.isArray(extension_settings.regex)) {
            extension_settings.regex = [];
        }
        if (!Array.isArray(window.regex_data)) {
            window.regex_data = [];
        }

        await loadRegexFiles();
        renderManagerUI();

    } catch (e) {
        console.error("[BB Regex Manager] Ошибка запуска:", e);
    }
});

// Обновленная функция: загружает сразу ВСЕ файлы из массива для каждого узла
async function loadRegexFiles() {
    for (const mod of bbModules) {
        loadedRegexes[mod.id] = []; // Готовим пустой контейнер под массив
        for (const file of mod.files) {
            try {
                const response = await fetch(`${extensionFolderPath}/regexes/${file}`);
                if (response.ok) {
                    const parsed = await response.json();
                    loadedRegexes[mod.id].push(parsed);
                }
            } catch (e) {
                console.warn(`[BB RM] Не удалось загрузить деталь: ${file}`);
            }
        }
    }
}

function renderManagerUI() {
    const listContainer = $("#bb-rm-list");
    if (!listContainer.length) return; // Защита от ошибок, если HTML еще не прогрузился
    
    listContainer.empty();

    bbModules.forEach(mod => {
        // Если ни один файл из пака не загрузился - не рисуем карточку
        if (!loadedRegexes[mod.id] || loadedRegexes[mod.id].length === 0) return; 

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

    listContainer.find("input[type=checkbox]").on("change", function() {
        const modId = $(this).data("mod-id");
        const isChecked = $(this).is(":checked");
        toggleRegex(modId, isChecked);
    });
}

async function toggleRegex(modId, isChecked) {
    const regexList = loadedRegexes[modId];
    if (!regexList || regexList.length === 0) return;

    let enabledList = extension_settings[extensionName].enabled;

    if (!Array.isArray(window.regex_data)) window.regex_data = [];
    if (!Array.isArray(extension_settings.regex)) extension_settings.regex = [];

    if (isChecked) {
        // ВКЛЮЧИТЬ ПАК
        if (!enabledList.includes(modId)) enabledList.push(modId);
        
        regexList.forEach(regexObj => {
            const exists = extension_settings.regex.findIndex(r => r.id === regexObj.id);
            if (exists === -1) extension_settings.regex.push(regexObj);
            else extension_settings.regex[exists] = regexObj; 

            const existsLive = window.regex_data.findIndex(r => r.id === regexObj.id);
            if (existsLive === -1) window.regex_data.push(regexObj);
            else window.regex_data[existsLive] = regexObj;
        });

        toastr.success(`Включено:\n${bbModules.find(m => m.id === modId).name}`);
    } else {
        // ВЫКЛЮЧИТЬ ПАК
        extension_settings[extensionName].enabled = enabledList.filter(id => id !== modId);
        
        regexList.forEach(regexObj => {
            extension_settings.regex = extension_settings.regex.filter(r => r.id !== regexObj.id);
            window.regex_data = window.regex_data.filter(r => r.id !== regexObj.id);
        });
        
        toastr.info(`Выключено:\n${bbModules.find(m => m.id === modId).name}`);
    }

    saveSettingsDebounced();
    
    if (typeof window.populateRegex === 'function') {
        window.populateRegex();
    }

    if (typeof window.SillyTavern !== 'undefined' && window.SillyTavern.getContext) {
        const ctx = window.SillyTavern.getContext();
        if (ctx && typeof ctx.reloadCurrentChat === 'function') {
            await ctx.reloadCurrentChat();
        }
    }
}