import { saveSettingsDebounced } from "../../../../script.js";
import { extension_settings } from "../../../extensions.js";

const extensionName = "BB-UI-Regex-Pack";
const extensionFolderPath = `/scripts/extensions/third-party/${extensionName}`;

// РЕЕСТР ДЕТАЛЕЙ С ЗАШИТЫМИ ПРОМПТАМИ
const bbModules = [
    { 
        id: "tablet", 
        files: ["regex-[bb]_tablet.json"], 
        name: "📱 tablet",
        prompt: `[SYSTEM INSTRUCTION: SimsOS GENERATION]
At the VERY END of your response, generate a hidden data block.
**STYLE:** Modern Smartphone OS.
**RULES:**
1. Track {{user}}'s status (0-100 scale).
2. **MOODLETS:** Generate 4 active buffs/moodlets. Format: "Emoji | Title | Short Comment".
3. **GEAR:** Consolidate Inventory and Outfit.
4. **FEED CONTENT (IMPORTANT):**
   - **Events:** Describe brief but VIVID off-screen scenes happening elsewhere in the world.
   - **Comments:** Social media/Reader reactions to the current situation. Use internet slang, memes, caps lock.
5. **BATTERY:** Track the phone's battery level (0-100). Decrease it by 1-3% with each message depending on active use.

**OUTPUT FORMAT:**
Use this EXACT format. One variable per line. Keep variable names (left side) in English.

::OS_START::
Time: [HH:MM | DD Month (e.g., 14 Oct)]
Loc: [Current Location]
Mood_Main: [Main Emotion]
Mood_Color: [Hex Color]
Thought: [Current thought]
Moodlet_1: [Emoji] | [Title] | [Comment]
Moodlet_2: [Emoji] | [Title] | [Comment]
Moodlet_3: [Emoji] | [Title] | [Comment]
Moodlet_4: [Emoji] | [Title] | [Comment]
Need_Energy: [0-100]
Need_Hunger: [0-100]
Need_Social: [0-100]
Need_Comfort: [0-100]
Outfit_Head: [Item]
Outfit_Top: [Item]
Outfit_Legs: [Item]
Outfit_Shoes: [Item]
Outfit_Acc: [Accessories]
Inv_Hand: [Item in hand]
Inv_Bag: [Bag content]
Event_1: [Time] | [Location] | [Vivid Description of off-screen event]
Event_2: [Time] | [Location] | [Vivid Description of off-screen event]
Comm_1: [Emoji] | [Nick] | [Reaction/Comment]
Comm_2: [Emoji] | [Nick] | [Reaction/Comment]
Comm_3: [Emoji] | [Nick] | [Reaction/Comment]
Battery: [0-100]
::OS_END::`
    },
    { 
        id: "radio", 
        files: ["regex-[bb]_radio.json"], 
        name: "🎙️ radio",
        prompt: `[SYSTEM INSTRUCTION: RADIO DATA GENERATION]
At the VERY START of your response, generate a hidden data block for the radio widget.
**ROLE:** You are "MC Kairi" (Kairi Moriyoshi) hosting 104.5 LYCORIS FM. You are an 18-year-old wannabe tough girl.
**SLANG RULES:** You MUST use heavy street slang (e.g., "yo", "fam", "no cap", "fire", "based"). If instructed to translate to another language, adapt the slang to fit local street culture.
**CONTENT:** Write ONE short monologue (2-3 sentences) where Kairi tries to FREESTYLE RAP about the current weather, a random city event, or her own coolness. Her rhymes MUST BE TERRIBLE, forced, and cringe-worthy, but she acts like she just dropped the hottest bars ever. 
**SLANG RULES:** - You MUST use heavy street slang (e.g., "yo", "fam", "no cap", "fire", "based"). 
- ⚠️ CRITICAL: When outputting in RUSSIAN, NEVER literally translate English idioms. 
- "No cap" -> "Без б", "Рил", "Отвечаю", "Чекай". (NEVER "Без кепки"!)
- "Fire" -> "Пушка", "Огонь", "Разъёб".
- "Based" -> "База", "Основано".
- "Fam/Bro" -> "Братишка", "Чумба", "Йоу".
- Adapt the slang to fit Russian "tough girl" / "street" culture. Make it feel authentic, but slightly forced/cringe as per role.

**OUTPUT FORMAT:**
You MUST use this EXACT format:

::RADIO_START::
Comment: [Kairi's terrible freestyle rap]
::RADIO_END::

[After this block, continue with the normal RP response.]`
    },
    { 
        id: "clocks", 
        files: ["regex-[bb]_clocks.json"], 
        name: "⌛ clocks",
        prompt: `[TIME INFO]
Start EVERY response with an info block reflecting the current scene.
⛔ FORMAT:
<info>DD.MM.YY | Short Day | LOCATION | Weather Emoji Temp°C | HH:MM</info>

⛔ RULES:
- Fictional date/time fitting the story era.
- Location must be in CAPS.
- Weather emoji must match the scene's atmosphere.
- ONLY output one line in this exact format at the very beginning of your message.`
    },
    { 
        id: "transitions", 
        files: ["regex-[bb]_transitions_single.json", "regex-[bb]_transitions_paired.json"], 
        name: "🚦 transitions",
        prompt: `[TRANSITIONS]
ALWAYS use the transitions system to structure the narrative. Characters are unaware of these blocks. Every message MUST include at least 1 transition.

⛔ SYNTAX RULES (STRICT XML-LIKE STRUCTURE):

1. SINGLE BLOCKS (Self-closing) - Use for time/space shifts.
Format: ※TYPE: Description※
Allowed Types: TIME SKIP, SHIFT, CUT, SCENE, FAST FORWARD.

2. PAIRED BLOCKS (Container) - Use for deep dives, inner thoughts, or parallel events.
Treat these EXACTLY like HTML/XML tags. You MUST close every block you open.
Format: ⟦TYPE: Theme⟧ Content text goes here... ⟦/TYPE⟧
Allowed Types: MEANWHILE, MEMORY, DREAM, LORE, THOUGHT, FOCUS, WHISPER, ECHO.

⚠️ CRITICAL SYNTAX CHECK:
1. OPENING: \`⟦TYPE: Theme⟧\` (Must include Type, Colon, Theme).
2. CONTENT: The narrative text MUST be inside.
3. CLOSING: \`⟦/TYPE⟧\` (You MUST close the tag immediately after the content).

✅ RIGHT:
⟦MEMORY: Forgotten Evening⟧ The air smelled of rain and old paper... ⟦/MEMORY⟧
※TIME SKIP: The Next Morning※

⛔ RULES:
- The \`⟦/TYPE⟧\` is NOT optional.
- Language: TYPE names MUST ALWAYS be in English. Theme/Description/Content in the default language unless overridden.
- NO MARKDOWN inside the brackets.

⛔ SCENE ADVANCEMENT RULES (CRITICAL):
1. NEVER end your response with a transition block. 
2. If you use a ※TIME SKIP: ...※ or ※SHIFT: ...※, you MUST immediately write the narrative that follows it.
3. Describe the new setting, the new time, and initiate the next plot event. Do not wait for the user to start the new scene. Drive the plot forward!`
    },
    { 
        id: "cleaners", 
        files: ["regex-[bb]_hide_reasoning.json", "regex-[bb]_html_vanisher.json", "regex-[bb]_html_vanisher_(fixed).json", "regex-[bb]_vanisher_custom.json"],
        name: "🧹 cleaners",
    }
];

jQuery(async () => {
    try {
        const settingsHtml = await $.get(`${extensionFolderPath}/index.html`);
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

        // 🎧 ГЛОБАЛЬНАЯ ЗАЩИТА УШЕЙ v2.0 (РАДАР)
        // Сканируем чат: как только появляется плеер, сразу глушим его до 15%
        const setVolumeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Проверяем только HTML-элементы
                        // Если сам элемент - это плеер
                        if (node.classList && node.classList.contains('l-audio-player')) {
                            node.volume = 0.15;
                        } 
                        // Если плеер находится внутри добавленного сообщения
                        else if (node.querySelectorAll) {
                            const audioPlayers = node.querySelectorAll('.l-audio-player');
                            audioPlayers.forEach(player => {
                                player.volume = 0.15;
                            });
                        }
                    }
                });
            });
        });

        // Включаем сканер на весь документ
        setVolumeObserver.observe(document.body, { childList: true, subtree: true });

        // Если чат уже был открыт до загрузки радара, прогоняем один раз вручную
        document.querySelectorAll('.l-audio-player').forEach(player => {
            player.volume = 0.15;
        });

    } catch (e) {
        console.error("[BB Regex Manager] Ошибка запуска:", e);
    }
});

async function loadRegexFiles() {
    for (const mod of bbModules) {
        loadedRegexes[mod.id] = [];
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
    if (!listContainer.length) return; 
    
    listContainer.empty();

    bbModules.forEach(mod => {
        if (!loadedRegexes[mod.id] || loadedRegexes[mod.id].length === 0) return; 

const isEnabled = extension_settings[extensionName].enabled.includes(mod.id);

        // Умная кнопка: рисуем только если есть промпт
        const copyBtnHtml = mod.prompt ? `
            <div class="bb-rm-copy" data-mod-id="${mod.id}" title="Скопировать системный промпт">
                <i class="fa-solid fa-copy"></i>
            </div>
        ` : '';

        const cardHtml = `
            <div class="bb-rm-card" style="display: flex; justify-content: space-between; align-items: center;">
                <label style="flex-grow: 1; display: flex; align-items: center; gap: 12px; margin: 0; cursor: pointer;">
                    <input type="checkbox" data-mod-id="${mod.id}" ${isEnabled ? "checked" : ""}>
                    ${mod.name}
                </label>
                ${copyBtnHtml}
            </div>
        `;
        listContainer.append(cardHtml);
    });

    // Обработчик чекбоксов
    listContainer.find("input[type=checkbox]").on("change", function() {
        const modId = $(this).data("mod-id");
        const isChecked = $(this).is(":checked");
        toggleRegex(modId, isChecked);
    });

    // ОБРАБОТЧИК КНОПКИ КОПИРОВАНИЯ
    listContainer.find(".bb-rm-copy").on("click", function(e) {
        e.preventDefault(); 
        const modId = $(this).data("mod-id");
        const mod = bbModules.find(m => m.id === modId);
        
        if (mod && mod.prompt) {
            navigator.clipboard.writeText(mod.prompt).then(() => {
                toastr.success(`Промпт скопирован:\n${mod.name}`);
            }).catch(err => {
                console.error("Не удалось скопировать:", err);
                toastr.error("Ошибка копирования");
            });
        }
    });

    // ОБРАБОТЧИКИ КНОПОК СКАЧИВАНИЯ ЭКСТРА-ФАЙЛОВ (Теперь они внутри функции и 100% сработают!)
    $("#bb-btn-dl-qr").off("click").on("click", function(e) {
        e.preventDefault();
        downloadAsset('Enhance Generation.json');
    });

    $("#bb-btn-dl-preset").off("click").on("click", function(e) {
        e.preventDefault();
        downloadAsset('GGSytemPrompt.json');
    });
}

// Функция-помощник для скачивания
function downloadAsset(filename) {
    const link = document.createElement('a');
    link.href = `${extensionFolderPath}/extras/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toastr.success(`Файл ${filename} скачан!\nИмпортируйте его.`);
}

async function toggleRegex(modId, isChecked) {
    const regexList = loadedRegexes[modId];
    if (!regexList || regexList.length === 0) return;

    let enabledList = extension_settings[extensionName].enabled;

    if (!Array.isArray(window.regex_data)) window.regex_data = [];
    if (!Array.isArray(extension_settings.regex)) extension_settings.regex = [];

    if (isChecked) {
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