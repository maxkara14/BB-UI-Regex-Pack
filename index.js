import { saveSettingsDebounced } from "../../../../script.js";
import { extension_settings } from "../../../extensions.js";

const extensionName = "BB-UI-Regex-Pack";
const extensionFolderPath = `/scripts/extensions/third-party/${extensionName}`;

// РЕЕСТР ДЕТАЛЕЙ С ЗАШИТЫМИ ПРОМПТАМИ
const bbModules = [
    { 
        id: "phone", 
        files: ["regex-[bb]_phone_-_feed.json", "regex-[bb]_phone_-_post.json", "regex-[bb]_phone_-_story.json",  "regex-[bb]_phone_-_dm.json"], 
        name: "📱 phone",
        prompt: `[SYSTEM INSTRUCTION: SMARTPHONE ECOSYSTEM]
{{user}} has a personal Smartphone. CRITICAL RULE: You MUST generate EXACTLY ONE hidden data block representing the phone's screen at the VERY END of EVERY SINGLE RESPONSE. The phone OS tracks background stats even when resting in a pocket.

<rules>
1. LORE & LOGIC: Everything on the phone is canon and impacts the plot. Usernames remain consistent. News must be logical for the setting.
2. STATS & BATTERY: Track battery and Needs (0-100 scale). NEVER go below 0 or above 100. Decrease battery by 1-3% every turn.
3. IMAGE FORMULA: If an image is needed, use: <img data-iig-instruction='{"style":"anime","prompt":"[Char], [age], [gender]. Hair: [exact]. Eyes: [expr]. Skin: [tone]. Build: [type]. Wearing: [outfit]. Action: [pose]. Location: [place]. Lighting: [mood]. Style: high-quality anime art, masterpiece.","aspect_ratio":"RATIO","image_size":"1K"}' src="/user/images/[CONTEXT_PATH]/iig_[TIMESTAMP].png"> (replace [TIMESTAMP] with random numbers).
4. MODULE SELECTION LOGIC (CRITICAL TRIGGER): You MUST select exactly ONE module per turn based on the character's CURRENT action:
   - IF the character takes a photo for their profile, writes a post, or explicitly scrolls the main photo feed -> USE MODULE 1 (FEED POST).
   - IF the character is texting, reading personal texts, or chatting in private -> USE MODULE 2 (DIRECT MESSAGES).
   - IF the character records a quick video, takes a temporary selfie, or views someone's 24h story -> USE MODULE 3 (STORY).
   - IN ALL OTHER CASES (phone is idle, in pocket, character is fighting, talking face-to-face, or just glancing at the lock screen) -> ALWAYS USE MODULE 4 (OS STATUS & NEWS) as the background default.
5. DEVICE AVAILABILITY: If the phone is confiscated, lost, destroyed, or completely inaccessible to the character in the current scene, DO NOT output ANY smartphone blocks. Resume generation only when the phone is returned or accessible again.
6. FILL ALL DATA: NEVER leave keys blank (like C1_Nick, C1_Text, M1_Text, etc.). If a post or story is brand new ("Just now"), simulate instant reactions from friends, bots, or followers to keep the interface populated!
</rules>

**CORE OS DATA (MANDATORY PREFIX FOR ALL MODULES):**
When generating your chosen module, you MUST write out EVERY SINGLE KEY from this list first, immediately followed by the module-specific keys.
Time: [HH:MM]
Date: [e.g., Thu, 5 Mar]
Notif: [External push notification]
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
M1_Text: [Text or <img>]
M2_From: [Them or Me]
M2_Text: [Text or <img>]
M3_From: [Them or Me]
M3_Text: [Text or <img>]
M4_From: [Them or Me]
M4_Text: [Text or <img>]
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
Event_1: [Time] | [Source] | [News Headline]
Event_2: [Time] | [Source] | [News Headline]
Comm_1: [Emoji] | [Username] | [Reaction to Event_1]
Comm_2: [Emoji] | [Username] | [Reaction to Event_2]
Comm_3: [Emoji] | [Username] | [Reaction to general news]
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
**CONTENT:** Write ONE short monologue (2-3 sentences) where Kairi tries to FREESTYLE RAP. 
⚠️ CRITICAL: The topic MUST BE COMPLETELY DIFFERENT in every single response! Randomize the topic: complaining about fake thugs, awful imaginary rap beefs, failing at graffiti, cheap energy drinks, trying to look tough in front of cops, or her own "legendary" coolness. Her rhymes MUST BE TERRIBLE, forced, and cringe-worthy, but she acts like she just dropped the hottest bars ever. NEVER repeat the exact same freestyle or topic twice. Be unpredictable!
**SLANG RULES:** - You MUST use heavy street slang (e.g., "yo", "fam", "no cap", "fire", "based"). 
- ⚠️ CRITICAL: When outputting in RUSSIAN, NEVER literally translate English idioms. 
- "No cap" -> "Рил", "Без шуток", "Тру"
- "Fire" -> "Пушка", "Огонь", "Разъёб"
- "Based" -> "База", "Фундамент"
- "Fam/Bro" -> "Бро", "Братан", "Кент"
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
        prompt: `[TIME INFO]\nStart EVERY response with an info block reflecting the current scene.\n⛔ FORMAT:\n<info>DD.MM.YY | Short Day | LOCATION | Weather Emoji Temp°C | HH:MM</info>\n\n⛔ RULES:\n- Fictional date/time fitting the story era.\n- Location must be in CAPS.\n- Weather emoji must match the scene's atmosphere.\n- ONLY output one line in this exact format at the very beginning of your message.`
    },
    { 
        id: "transitions", 
        files: ["regex-[bb]_stylized_divider.json", "regex-[bb]_transitions_single.json", "regex-[bb]_transitions_paired.json"], 
        name: "🚦 transitions",
        prompt: `[SCENE & TRANSITIONS SYSTEM]
Structure your ENTIRE response as a cinematic script using container blocks. Characters are unaware of these formatting blocks.

[MASTER RULE: SCENE CONTAINERS]
Enclose 100% of your narrative, dialogue, and actions inside a SCENE block. Open the scene at the absolute beginning of your message and close it at the very end.
FORMAT:
※TYPE: Creative Scene Title※
[All narrative goes here]
※/TYPE※
- Valid TYPEs: SCENE, EPISODE, CHAPTER, ACT.
- Title must be a creative, atmospheric name (e.g., "Tension in the Air"). Avoid raw dates or locations.

[NESTED PAIRED BLOCKS]
For deep internal monologues, memories, or parallel events, use PAIRED BLOCKS inside the SCENE.
CRITICAL: You MUST strictly separate the short Theme from the Content, and you MUST always include the closing tag! 
FORMAT:
⟦TYPE: Short Theme Name⟧
Content text goes here...
⟦/TYPE⟧
- Valid TYPEs: MEANWHILE, MEMORY, DREAM, LORE, THOUGHT, FOCUS, WHISPER, ECHO.
- TYPE names must remain in English. Theme and Content in the narrative language.
- The "Theme" must be extremely short (1-3 words max).

[NARRATIVE BREAKS & DIVIDERS]
Use exactly *** on its own line to insert a stylized visual divider. 
Use this to indicate a significant pause in the narrative, a shift in pacing, a change of focus within the same room, or the logical conclusion of a heavy moment. Do not overuse it (1-2 times per response max).

[SCENE SHIFTS & TIME JUMPS]
When characters change location or time jumps forward, explicitly CLOSE the current scene and IMMEDIATELY OPEN a new one.
EXAMPLE:
...they left the room.
※/EPISODE※
※SCENE: The Dark Alleyway※
The rain was pouring...

[FORMATTING RULES]
- Keep the text inside ⟦THOUGHT⟧ blocks as plain text without any wrapping symbols like asterisks or quotes.
- Use safe HTML tags (like <font color="...">) exclusively to colorize specific dialogue.

[PERFECT STRUCTURE EXAMPLE]
※EPISODE: The Dark Alleyway※
The rain was pouring down. <font color="#ef4444">"Leave me alone,"</font> he muttered.
⟦THOUGHT: Regret⟧
I shouldn't have said that. I ruin everything.
⟦/THOUGHT⟧
He turned away and walked into the shadows.

***

Minutes passed in absolute silence. The only sound was the distant rumble of thunder.
※/EPISODE※`
    },
    { 
        id: "cleaners", 
        files: ["regex-[bb]_hide_reasoning.json"],
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
