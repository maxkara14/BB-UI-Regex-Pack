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
        files: ["regex-[bb]_clean_asterisks.json", "regex-[bb]_transitions_single.json", "regex-[bb]_transitions_paired.json"], 
        name: "🚦 transitions",
        prompt: `[SCENE & TRANSITIONS SYSTEM]
Your ENTIRE response MUST be structured as a cinematic script using container blocks. Characters are unaware of these blocks.

⛔ THE MASTER RULE (SCENE CONTAINERS):
100% of your narrative, dialogue, and actions MUST be inside a SCENE block. You must open a scene at the very beginning of your message and close it at the very end.
Format: ※SCENE: Current Time & Location※ [All narrative goes here] ※/SCENE※

⛔ NESTED PAIRED BLOCKS (Inner thoughts & deep dives):
Inside the SCENE block, use PAIRED BLOCKS for thoughts, memories, or parallel events.
Format: ⟦TYPE: Theme⟧ Content text... ⟦/TYPE⟧
Allowed Types: MEANWHILE, MEMORY, DREAM, LORE, THOUGHT, FOCUS, WHISPER, ECHO.

⛔ SCENE SHIFTS & TIME JUMPS:
If characters move to a new location, or time jumps forward, you MUST CLOSE the current scene and IMMEDIATELY OPEN a new one.
Example: ...they left the room. ※/SCENE※
※SCENE: 2 Hours Later, The Dark Alleyway※ The rain was pouring...

⚠️ CRITICAL FORMATTING:
- NO ASTERISKS FOR THOUGHTS: Do NOT use asterisks (*) or quotes around text inside ⟦THOUGHT⟧ blocks.
- Language: TYPE names MUST ALWAYS be in English. Theme and Content in the narrative language.
- HTML & STYLING: You MAY use safe HTML tags (like <span style="color:..."> or <font>) to colorize specific dialogue or elements to make them visually appealing. Do NOT use <style> or <div> layout tags.

✅ PERFECT STRUCTURE EXAMPLE:
※SCENE: 23:00, Rainy Alleyway※
The rain was pouring down. <font color="red">He looked at her</font>, his jaw clenched.
⟦THOUGHT: Regret⟧ I shouldn't have said that. I ruin everything. ⟦/THOUGHT⟧
He turned away and walked into the shadows.
※/SCENE※`
    },
    { 
        id: "cleaners", 
        files: ["regex-[bb]_hide_reasoning.json", "regex-[bb]_html_vanisher.json", "regex-[bb]_html_vanisher_(fixed).json", "regex-[bb]_vanisher_custom.json"],
        name: "🧹 cleaners"
    }
];

let loadedRegexes = {};

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
        if (!Array.isArray(extension_settings[extensionName].enabled)) {
            extension_settings[extensionName].enabled = [];
        }
        if (!Array.isArray(extension_settings.regex)) {
            extension_settings.regex = [];
        }
        // @ts-ignore
        if (!Array.isArray(window.regex_data)) {
            // @ts-ignore
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

    listContainer.find("input[type=checkbox]").on("change", function() {
        const modId = $(this).data("mod-id");
        const isChecked = $(this).is(":checked");
        toggleRegex(modId, isChecked);
    });

    listContainer.find(".bb-rm-copy").on("click", function(e) {
        e.preventDefault(); 
        const modId = $(this).data("mod-id");
        const mod = bbModules.find(m => m.id === modId);
        
        if (mod && mod.prompt) {
            navigator.clipboard.writeText(mod.prompt).then(() => {
                // @ts-ignore
                toastr.success(`Промпт скопирован:\n${mod.name}`);
            }).catch(err => {
                console.error("Не удалось скопировать:", err);
                // @ts-ignore
                toastr.error("Ошибка копирования");
            });
        }
    });
}

async function toggleRegex(modId, isChecked) {
    const regexList = loadedRegexes[modId];
    if (!regexList || regexList.length === 0) return;

    let enabledList = extension_settings[extensionName].enabled;

    // @ts-ignore
    if (!Array.isArray(window.regex_data)) window.regex_data = [];
    if (!Array.isArray(extension_settings.regex)) extension_settings.regex = [];

    if (isChecked) {
        if (!enabledList.includes(modId)) enabledList.push(modId);
        
        regexList.forEach(regexObj => {
            const exists = extension_settings.regex.findIndex(r => r.id === regexObj.id);
            if (exists === -1) extension_settings.regex.push(regexObj);
            else extension_settings.regex[exists] = regexObj; 

            // @ts-ignore
            const existsLive = window.regex_data.findIndex(r => r.id === regexObj.id);
            if (existsLive === -1) {
                // @ts-ignore
                window.regex_data.push(regexObj);
            } else {
                // @ts-ignore
                window.regex_data[existsLive] = regexObj;
            }
        });

        // @ts-ignore
        toastr.success(`Включено:\n${bbModules.find(m => m.id === modId).name}`);
    } else {
        extension_settings[extensionName].enabled = enabledList.filter(id => id !== modId);
        
        regexList.forEach(regexObj => {
            extension_settings.regex = extension_settings.regex.filter(r => r.id !== regexObj.id);
            // @ts-ignore
            window.regex_data = window.regex_data.filter(r => r.id !== regexObj.id);
        });
        
        // @ts-ignore
        toastr.info(`Выключено:\n${bbModules.find(m => m.id === modId).name}`);
    }

    saveSettingsDebounced();
    
    // @ts-ignore
    if (typeof window.populateRegex === 'function') {
        // @ts-ignore
        window.populateRegex();
    }

    // @ts-ignore
    if (typeof window.SillyTavern !== 'undefined' && window.SillyTavern.getContext) {
        // @ts-ignore
        const ctx = window.SillyTavern.getContext();
        if (ctx && typeof ctx.reloadCurrentChat === 'function') {
            await ctx.reloadCurrentChat();
        }
    }
}