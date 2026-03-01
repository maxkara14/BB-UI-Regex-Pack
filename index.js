import { saveSettingsDebounced } from "../../../../script.js";
import { extension_settings } from "../../../extensions.js";

const extensionName = "BB-UI-Regex-Pack";
const extensionFolderPath = `/scripts/extensions/third-party/${extensionName}`;

// Реестр твоих деталей
const bbModules = [
    { id: "tablet", file: "regex-[bb]_tablet.json", name: "📱 tablet" },
    { id: "radio", file: "regex-[bb]_radio.json", name: "🎙️ radio" },
    { id: "clocks", file: "regex-[bb]_clocks.json", name: "⌛ clocks" },
    { id: "trans_single", file: "regex-[bb]_transitions_single.json", name: "🚦 transitions (single)" },
    { id: "trans_paired", file: "regex-[bb]_transitions_paired.json", name: "🚦 transitions (paired)" }
];

let loadedRegexes = {};

jQuery(async () => {
    try {
        const settingsHtml = await $.get(`${extensionFolderPath}/index.html`);
        $("#extensions_settings2").append(settingsHtml);

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

function renderManagerUI() {
    const listContainer = $("#bb-rm-list");
    listContainer.empty();

    bbModules.forEach(mod => {
        if (!loadedRegexes[mod.id]) return; 

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
    const regexObj = loadedRegexes[modId];
    if (!regexObj) return;

    let enabledList = extension_settings[extensionName].enabled;

    // Синхронизируем обе коробки передач (память и сейвы)
    if (!Array.isArray(window.regex_data)) window.regex_data = [];
    if (!Array.isArray(extension_settings.regex)) extension_settings.regex = [];

    if (isChecked) {
        // ВКЛЮЧИТЬ
        if (!enabledList.includes(modId)) enabledList.push(modId);
        
        // Вшиваем в настройки
        const exists = extension_settings.regex.findIndex(r => r.id === regexObj.id);
        if (exists === -1) extension_settings.regex.push(regexObj);
        else extension_settings.regex[exists] = regexObj; 

        // Вшиваем в оперативную память ST
        const existsLive = window.regex_data.findIndex(r => r.id === regexObj.id);
        if (existsLive === -1) window.regex_data.push(regexObj);
        else window.regex_data[existsLive] = regexObj;

        toastr.success(`Включено:\n${bbModules.find(m => m.id === modId).name}`);
    } else {
        // ВЫКЛЮЧИТЬ
        extension_settings[extensionName].enabled = enabledList.filter(id => id !== modId);
        
        // Вырезаем отовсюду
        extension_settings.regex = extension_settings.regex.filter(r => r.id !== regexObj.id);
        window.regex_data = window.regex_data.filter(r => r.id !== regexObj.id);
        
        toastr.info(`Выключено:\n${bbModules.find(m => m.id === modId).name}`);
    }

    // 1. Сохраняем настройки
    saveSettingsDebounced();
    
    // 2. Мгновенно обновляем стандартный список регулярок в меню
    if (typeof window.populateRegex === 'function') {
        window.populateRegex();
    }

    // 3. ТУРБО-БУСТ: Мгновенно перезагружаем чат, чтобы интерфейс прямо на глазах поменялся!
    if (typeof window.SillyTavern !== 'undefined' && window.SillyTavern.getContext) {
        const ctx = window.SillyTavern.getContext();
        if (ctx && typeof ctx.reloadCurrentChat === 'function') {
            await ctx.reloadCurrentChat();
        }
    }
}