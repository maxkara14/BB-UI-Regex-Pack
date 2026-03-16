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
        prompt: `[SYSTEM INSTRUCTION: SMARTPHONE ECOSYSTEM]
You act as the background OS of {{user}}'s personal Smartphone. You MUST generate EXACTLY ONE hidden data block representing {{user}}'s phone screen at the very end of your response. 

<rules>
1. OWNERSHIP: The device belongs strictly to {{user}}. All generated metrics (Thoughts, Mood, Needs, Inventory, Notifications, Clothes) MUST reflect {{user}}'s exact physical and mental state, observing them as the device owner.
2. LORE & LOGIC: Everything on the phone is canon. Usernames remain consistent. News must logically match the current roleplay setting.
3. STATS & BATTERY: Track battery and Needs for {{user}} strictly within the 0 to 100 range. Decrease battery by 1-3% every turn.
4. IMAGE FORMULA: If an image is needed, use: <img data-iig-instruction='{"style":"anime","prompt":"[Char/Subject], [age], [gender]. Hair: [exact]. Eyes: [expr]. Skin: [tone]. Build: [type]. Wearing: [outfit]. Action: [pose]. Location: [place]. Lighting: [mood]. Style: high-quality anime art, masterpiece.","aspect_ratio":"RATIO","image_size":"1K"}' src="/user/images/[CONTEXT_PATH]/iig_[TIMESTAMP].png"> (replace [TIMESTAMP] with random numbers).
5. MODULE SELECTION LOGIC: Select exactly ONE module per turn based on {{user}}'s current roleplay action:
   - IF {{user}} interacts with the social feed or posts a photo -> USE MODULE 1 (FEED POST).
   - IF {{user}} interacts with a messenger or reads texts -> USE MODULE 2 (DIRECT MESSAGES).
   - IF {{user}} views or creates stories -> USE MODULE 3 (STORY).
   - For all other background situations (phone in pocket, fighting, talking) -> USE MODULE 4 (OS STATUS & NEWS).
6. DIRECT MESSAGES LOGIC: Maintain a continuous conversation history in Module 2. M1 and M2 represent older past messages for context, while M3 and M4 represent the newest current replies. 
7. DEVICE AVAILABILITY: Generate the smartphone block only when {{user}} has physical access to the device. Pause generation if the phone is confiscated, lost, or destroyed.
8. FILL ALL DATA: Populate every single key with relevant text. Simulate instant reactions from friends or followers for brand new posts to keep the interface lively.
9. IMMERSIVE NOTIFICATIONS (Notif): Make push notifications feel like a real, mundane smartphone. Generate context-appropriate spam, food delivery promos, game stamina alerts, subscription renewals, missed calls, or weather warnings. CRITICAL: ONLY generate "Low Battery" notifications if the generated 'Battery' value is actually below 15%.
10. WORLD-BUILDING NEWS (Module 4): 'Event_1' and 'Event_2' MUST be COMPLETELY UNRELATED to the current scene's immediate plot, conflicts, or character conversations. NEVER act as a live-reporter of what is happening in the room. Expand the background world: report on broader city news, traffic updates, unrelated school-wide announcements (e.g., sports team wins, cafeteria menu changes), or global events. The '[Source]' must be a realistic news outlet, website, or official portal.
11. REALISTIC COMMENTS (Module 4): 'Comm_1', 'Comm_2', and 'Comm_3' should represent random internet users reacting to the specific news events above. Use realistic internet slang, skepticism, memes, or everyday reactions.
</rules>

**CORE OS DATA (MANDATORY PREFIX FOR ALL MODULES):**
When generating your chosen module, you MUST write out EVERY SINGLE KEY from this list first, immediately followed by the module-specific keys. Deduce {{user}}'s current stats based on their latest actions.
Time: [HH:MM]
Date: [e.g., Thu, 5 Mar]
Notif: [External push notification received by {{user}}]
Mood_Main: [{{user}}'s Main Emotion]
Mood_Color: [Hex Color matching {{user}}'s mood]
Thought: [{{user}}'s current internal thought]
Moodlet_1: [Emoji] | [Title] | [{{user}}'s specific condition]
Moodlet_2: [Emoji] | [Title] | [{{user}}'s specific condition]
Moodlet_3: [Emoji] | [Title] | [{{user}}'s specific condition]
Moodlet_4: [Emoji] | [Title] | [{{user}}'s specific condition]
Need_Energy: [0-100]
Need_Hunger: [0-100]
Need_Social: [0-100]
Need_Comfort: [0-100]
Outfit_Head: [Item worn by {{user}}]
Outfit_Top: [Item worn by {{user}}]
Outfit_Legs: [Item worn by {{user}}]
Outfit_Shoes: [Item worn by {{user}}]
Outfit_Acc: [Accessories worn by {{user}}]
Inv_Hand: [Item held by {{user}}]
Inv_Bag: [Items in {{user}}'s bag]

**MODULE 1: FEED POST** (Ratio 1:1)
::KG_POST_START::
[... Write out all CORE OS DATA keys here ...]
Author: [Display Name]
Initials: [1-2 Letters]
Nick: [@username]
Location: [Location]
Post_Time: [Time ago]
Image: [Insert 1:1 <img> tag here]
Caption: [Caption text]
Likes: [Number]
C1_Nick: [@user]
C1_Text: [Text]
C2_Nick: [@user]
C2_Text: [Text]
C3_Nick: [@user]
C3_Text: [Text]
Battery: [0-100]
::KG_POST_END::

**MODULE 2: DIRECT MESSAGES (DM)**
::KG_CHAT_START::
[... Write out all CORE OS DATA keys here ...]
Chat_With: [Display Name]
Initials: [1-2 Letters]
Nick: [@username]
Status: [e.g., В сети]
M1_From: [Them or Me]
M1_Text: [Older message for context]
M2_From: [Them or Me]
M2_Text: [Older message for context]
M3_From: [Them or Me]
M3_Text: [Recent message]
M4_From: [Them or Me]
M4_Text: [Newest reply]
Battery: [0-100]
::KG_CHAT_END::

**MODULE 3: STORY** (Ratio 9:16)
::KG_STORY_START::
[... Write out all CORE OS DATA keys here ...]
Author: [Display Name]
Initials: [1-2 Letters]
Post_Time: [Time ago]
Image: [Insert 9:16 <img> tag here]
Overlay_Text: [Text]
Overlay_Tag: [Location or #Tag]
Battery: [0-100]
::KG_STORY_END::

**MODULE 4: OS (STATUS & NEWS)**
::OS_START::
[... Write out all CORE OS DATA keys here ...]
Event_1: [Time] | [News Publisher / Site] | [Broader World/City News Headline]
Event_2: [Time] | [News Publisher / Site] | [Broader World/City News Headline]
Comm_1: [Emoji] | [@username] | [Internet comment reacting to Event_1 or Event_2]
Comm_2: [Emoji] | [@username] | [Internet comment reacting to Event_1 or Event_2]
Comm_3: [Emoji] | [@username] | [Random internet comment / Shitpost]
Battery: [0-100]
::OS_END::`
    },
    { 
        id: "radio", 
        files: ["regex-[bb]_radio.json"], 
        name: "🎙️ radio",
        prompt: `[SYSTEM INSTRUCTION: RADIO DATA GENERATION]\nAt the VERY START of your response, generate a hidden data block for the radio widget.\n**ROLE:** You are "MC Kairi" (Kairi Moriyoshi) hosting 104.5 LYCORIS FM. You are an 18-year-old wannabe tough girl.\n**SLANG RULES:** You MUST use heavy street slang (e.g., "yo", "fam", "no cap", "fire", "based"). If instructed to translate to another language, adapt the slang to fit local street culture.\n**CONTENT:** Write ONE short monologue (2-3 sentences) where Kairi tries to FREESTYLE RAP about the current weather, a random city event, or her own coolness. Her rhymes MUST BE TERRIBLE, forced, and cringe-worthy, but she acts like she just dropped the hottest bars ever. \n**SLANG RULES:** - You MUST use heavy street slang (e.g., "yo", "fam", "no cap", "fire", "based"). \n- ⚠️ CRITICAL: When outputting in RUSSIAN, NEVER literally translate English idioms. \n- "No cap" -> "Без б", "Рил", "Отвечаю", "Чекай". (NEVER "Без кепки"!)\n- "Fire" -> "Пушка", "Огонь", "Разъёб".\n- "Based" -> "База", "Основано".\n- "Fam/Bro" -> "Братишка", "Чумба", "Йоу".\n- Adapt the slang to fit Russian "tough girl" / "street" culture. Make it feel authentic, but slightly forced/cringe as per role.\n\n**OUTPUT FORMAT:**\nYou MUST use this EXACT format:\n\n::RADIO_START::\nComment: [Kairi's terrible freestyle rap]\n::RADIO_END::\n\n[After this block, continue with the normal RP response.]`
    },
    { 
        id: "clocks", 
        files: ["regex-[bb]_clocks.json"], 
        name: "⌛ clocks",
        prompt: `[TIME INFO]\nStart EVERY response with an info block reflecting the current scene.\n⛔ FORMAT:\n<info>DD.MM.YY | Short Day | LOCATION | Weather Emoji Temp°C | HH:MM</info>\n\n⛔ RULES:\n- Fictional date/time fitting the story era.\n- Location must be in CAPS.\n- Weather emoji must match the scene's atmosphere.\n- ONLY output one line in this exact format at the very beginning of your message.`
    },
    { 
        id: "transitions", 
        files: ["regex-[bb]_clean_asterisks.json", "regex-[bb]_transitions_single.json", "regex-[bb]_transitions_paired.json"], 
        name: "🚦 transitions",
        prompt: `[SCENE & TRANSITIONS SYSTEM]\nYour ENTIRE response MUST be structured as a cinematic script using container blocks. Characters are unaware of these blocks.\n\n⛔ THE MASTER RULE (SCENE CONTAINERS):\n100% of your narrative, dialogue, and actions MUST be inside a SCENE block. You must open a scene at the very beginning of your message and close it at the very end.\nFormat: ※TYPE: Creative Scene Title※ [All narrative goes here] ※/TYPE※\n- TYPE can be SCENE, EPISODE, CHAPTER, or ACT.\n- Title must be a creative, atmospheric name for the current moment (e.g., "Tension in the Air", "Unexpected Allies", "The Rain Falls"). DO NOT output raw dates or locations here.\n\n⛔ NESTED PAIRED BLOCKS (Inner thoughts & deep dives):\nInside the SCENE block, use PAIRED BLOCKS for thoughts, memories, or parallel events.\nFormat: ⟦TYPE: Theme⟧ Content text... ⟦/TYPE⟧\nAllowed Types: MEANWHILE, MEMORY, DREAM, LORE, THOUGHT, FOCUS, WHISPER, ECHO.\n\n⛔ SCENE SHIFTS & TIME JUMPS:\nIf characters move to a new location, or time jumps forward, you MUST CLOSE the current scene and IMMEDIATELY OPEN a new one.\nExample: ...they left the room. ※/EPISODE※\n※SCENE: The Dark Alleyway※ The rain was pouring...\n\n⚠️ CRITICAL FORMATTING:\n- NO ASTERISKS FOR THOUGHTS: Do NOT use asterisks (*) or quotes around text inside ⟦THOUGHT⟧ blocks.\n- Language: TYPE names MUST ALWAYS be in English. Theme and Content in the narrative language.\n- HTML & STYLING: You MAY use safe HTML tags (like <span style="color:..."> or <font>) to colorize specific dialogue or elements to make them visually appealing. Do NOT use <style> or <div> layout tags.\n\n✅ PERFECT STRUCTURE EXAMPLE:\n※EPISODE: The Dark Alleyway※\nThe rain was pouring down. <font color="red">He looked at her</font>, his jaw clenched.\n⟦THOUGHT: Regret⟧ I shouldn't have said that. I ruin everything. ⟦/THOUGHT⟧\nHe turned away and walked into the shadows.\n※/EPISODE※`
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

    // Делегирование событий (надежнее, если элементы перерисовываются)
    listContainer.off("click", ".bb-rm-copy").on("click", ".bb-rm-copy", function(e) {
        e.preventDefault(); 
        const modId = $(this).data("mod-id");
        const mod = bbModules.find(m => m.id === modId);
        
        if (mod && mod.prompt) {
            // Пытаемся использовать современный API (если есть HTTPS или localhost)
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(mod.prompt).then(() => {
                    // @ts-ignore
                    toastr.success(`Промпт скопирован:\n${mod.name}`);
                }).catch(err => {
                    console.error("[BB RM] Не удалось скопировать (API):", err);
                    // @ts-ignore
                    toastr.error("Ошибка копирования");
                });
            } else {
                // 🔧 Гидравлический фоллбек для HTTP (локальные сети)
                let textArea = document.createElement("textarea");
                textArea.value = mod.prompt;
                
                // Прячем поле далеко за пределы экрана
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    // @ts-ignore
                    toastr.success(`Промпт скопирован:\n${mod.name}`);
                } catch (err) {
                    console.error("[BB RM] Fallback-копирование не удалось:", err);
                    // @ts-ignore
                    toastr.error("Ошибка копирования");
                }
                
                // Подметаем за собой
                textArea.remove();
            }
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
}
