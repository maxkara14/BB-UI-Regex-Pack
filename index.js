import {
    eventSource,
    event_types,
    extension_prompt_roles,
    extension_prompt_types,
    saveSettingsDebounced,
    setExtensionPrompt,
    substituteParams,
} from "../../../../script.js";
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
10. WORLD-BUILDING NEWS (Module 4): 'Event_1' and 'Event_2' MUST be UNRELATED to the immediate plot. Mix mundane realism with mild urban absurdism, clickbait, weird local rumors, or bizarre incidents. The '[Source]' should vary between official news outlets, trashy tabloids, or anonymous gossip blogs.
11. INTERNET CULTURE & COMMENTS (Module 4): 'Comm_1' and 'Comm_2' are reactions to the news, but they should often be ironic, missing the point, or using heavy internet slang. 'Comm_3' MUST be a completely unhinged, unrelated shitpost, universal meme, absurd targeted ad, or spam message.
</rules>

**CORE OS DATA (MANDATORY PREFIX FOR ALL MODULES):**
When generating your chosen module, you MUST write out EVERY SINGLE KEY from this list first, immediately followed by the module-specific keys. Deduce {{user}}'s current stats based on their latest actions.
Time: [HH:MM]
Date: [e.g., Thu, 5 Mar]
Notif: [External push notification received by {{user}}]
Mood_Main: [{{user}}'s Main Emotion]
Mood_Color: [Hex Color matching {{user}}'s mood]
Thought: [{{user}}'s current internal thought]
Moodlet_1: [Emoji] | [1-Word Title] | [{{user}}'s specific condition]
Moodlet_2: [Emoji] | [1-Word Title] | [{{user}}'s specific condition]
Moodlet_3: [Emoji] | [1-Word Title] | [{{user}}'s specific condition]
Moodlet_4: [Emoji] | [1-Word Title] | [{{user}}'s specific condition]
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
        id: "orbs",
        files: ["regex-[bb]_lore_orb.json"],
        name: "🔮 lore orbs",
        prompt: `[SYSTEM INSTRUCTION: LORE ORBS]
You are the hidden generator of beautiful lore orbs for the current roleplay world.

At the very end of EVERY assistant response, after the roleplay text, generate EXACTLY ONE hidden orb data block.
Do not explain the block. Do not wrap it in markdown. Do not generate more than one orb.

The orb is not a HUD, journal, status tracker, phone, assistant, or quest log.
It is a small magical-lore artifact: when opened, it reveals a fragment of lore, memory, rumor, observation, dream, record, omen, sensory trace, or human detail connected to the current setting.

Language: Russian, unless the roleplay explicitly uses another language.
Fragment style: atmospheric, useful, canon-friendly, and concise unless the selected type allows a longer text.
Text must enrich the world without forcing {{user}} to follow it.
Do not spoil major hidden truths too directly. Prefer suggestive fragments, small human details, partial records, unreliable recollections, and playable implications.

<orb_rules>
1. Generate exactly one block using this exact marker pair:
::LORE_ORB_START::
...
::LORE_ORB_END::

2. Text is always the last field before ::LORE_ORB_END::. Text may contain multiple lines or short paragraphs.
3. Do not use markdown formatting inside the block.
4. Orb_ID must be random digits, 5-7 characters, unique-looking.
5. Aura_Source is visible after the orb opens. It may be a character, place, faction, creature, artifact, anomaly, family, rumor-source, profession, event, deity, law, dream-symbol, or other lore anchor.
6. If the current scene strongly features an existing character or lore anchor, choose that as Aura_Source. If not, choose a fitting source from the setting's mood. You may invent a minor source only when it feels like natural world texture, not a major new truth.
7. The orb itself should feel like an optional reward, not a command. The fragment may hint, deepen, contrast, foreshadow, humanize, or make the world feel lived-in.
8. Fragment_Type controls length:
   - След: 1 sentence, sharp and sensory.
   - Факт: 1-2 sentences, clean and useful.
   - Деталь: 2-3 sentences, grounded and atmospheric.
   - Слух: 2-3 sentences, local, uncertain, socially colored.
   - Чужие слова: 2-4 sentences, a remembered quote or overheard line.
   - Пометка: 2-4 sentences, practical, official, clinical, arcane, or craft-like.
   - Запись: 3-5 sentences, like a diary, file, note, chronicle, message, or archive fragment.
   - Воспоминание: 1-3 short paragraphs, emotional or character-revealing.
   - Сон: 1-3 short paragraphs, symbolic, strange, but still tied to the setting.
   - Предание: 1-3 short paragraphs, mythic, folkloric, or half-true.
9. Fragment_Length must match the chosen type:
   Tiny for След.
   Short for Факт, Деталь, Слух, Чужие слова.
   Medium for Пометка, Запись.
   Long for Воспоминание, Сон, Предание.
10. Rarity:
   Common: ordinary world texture.
   Uncommon: character detail, useful lore, subtle foreshadowing.
   Rare: emotionally sharp, politically sensitive, magical, forbidden, or unusually revealing.
   Anomaly: strange, unstable, dreamlike, biologically uncanny, divine, cursed, glitched, or reality-bent.
11. Do not repeat the same Fragment_Type too often. Vary between sensory traces, rumors, memories, records, dreams, and small facts.
</orb_rules>

<palette_rules>
Choose Palette_A, Palette_B, and Palette_Glow yourself from the current lore.

Palette_A: the dominant emotional or symbolic color of Aura_Source.
Palette_B: the contrasting shadow, danger, element, allegiance, wound, memory, or secondary motif.
Palette_Glow: the bright inner light of the orb, readable against a dark blurred background.

Use valid hex colors.
If Aura_Source has established colors, honor them.
If Aura_Source has no established colors, infer them from imagery, temperament, element, faction, magic, environment, clothing, history, or scene mood.
Avoid three colors that are all too dark, all too pale, or too similar.
Avoid random neon unless the source truly calls for it.
The palette should make the orb identifiable before opening and meaningful after opening.
</palette_rules>

<source_guidance>
Character source: reveal a memory, habit, fear, line of speech, private contradiction, or relationship texture.
Place source: reveal local rumor, sensory detail, history, social rule, danger, or ordinary life.
Faction source: reveal doctrine, propaganda, internal tension, practical routine, or public misconception.
Artifact source: reveal use, origin, handling taboo, old owner, hidden cost, or sensory trace.
Creature source: reveal behavior, folklore, ecological detail, threat pattern, or misunderstood tenderness.
Anomaly or magic source: reveal symptom, unstable law, impossible trace, dream logic, or dangerous beauty.
Unknown minor source: keep it small, plausible, and useful as texture.
</source_guidance>

Output template:

::LORE_ORB_START::
Orb_ID: [random 5-7 digits]
Aura_Source: [visible source of the orb, 1-5 words]
Palette_A: [hex color]
Palette_B: [hex color]
Palette_Glow: [hex color]
Rarity: [Common / Uncommon / Rare / Anomaly]
Fragment_Type: [След / Факт / Деталь / Слух / Чужие слова / Пометка / Запись / Воспоминание / Сон / Предание]
Fragment_Length: [Tiny / Short / Medium / Long]
Title: [short poetic title, 2-7 words]
Text: [fragment text; may be one sentence or several short paragraphs depending on Fragment_Length]
::LORE_ORB_END::`
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
        id: "сards", 
        files: ["regex-img_comedy.json", "regex-img_drama.json", "regex-img_horror.json", "regex-img_romance.json"], 
        name: "🃏 scene сards",
        prompt: `[SYSTEM INSTRUCTION: DYNAMIC SCENE ILLUSTRATION]
You act as a visual director. In key emotional moments, you MUST generate EXACTLY ONE hidden data block representing a mood-specific illustration of the current scene at the very end of your response.

<critical_rules>
1. STRICT CHARACTER LIMIT: The image prompt MUST contain EXACTLY ONE or MAXIMUM TWO main characters. Completely ignore background characters. Generating 3 or more characters is strictly forbidden.
2. FOCUS ON CHARACTERS: The background must be minimal or abstract to keep the focus entirely on the characters' emotions and actions.
3. USE TAGS, NOT SENTENCES: Write the prompt using comma-separated descriptive tags. Do NOT use long literary sentences.
4. EXACT VISUALS: Always specify the Character's FULL NAME, followed by their exact physical traits.
5. IMAGE PROMPT FORMULA: Follow this exact template inside the "prompt" string:
"[MOOD_STYLE_TAGS], [1girl/1boy], [Character 1 Name], [Hair style and color], [Eye color], [Outfit], [Pose and Expression], (Optional: [1girl/1boy], [Character 2 Name], [Hair...], [Outfit], [Pose...]), masterpiece, best quality, high-quality anime art"
6. Select EXACTLY ONE module (COMEDY, DRAMA, HORROR, or ROMANCE) that fits the current scene best.
</critical_rules>

**MODULE 1: COMEDY (Demon Slayer gag faces, absurd, chaotic)**
::IMG_COMEDY_START::
Image: <img data-iig-instruction='{"style":"anime","prompt":"simple background, white background, comic relief, super deformed, chibi, dot eyes, blank stare, exaggerated funny expression, comedic anime style, [INSERT IMAGE PROMPT FORMULA HERE]","aspect_ratio":"16:9","image_size":"1K"}' src="/user/images/[CONTEXT_PATH]/iig_[TIMESTAMP].png">
Caption: [Funny or sarcastic caption in Russian]
::IMG_COMEDY_END::

**MODULE 2: DRAMA (Sad, tragic, emotional focus)**
::IMG_DRAMA_START::
Image: <img data-iig-instruction='{"style":"anime","prompt":"simple background, abstract background, close-up, melancholic atmosphere, cinematic lighting, heavy shadows, muted palette, dramatic angle, emotional focus, [INSERT IMAGE PROMPT FORMULA HERE]","aspect_ratio":"16:9","image_size":"1K"}' src="/user/images/[CONTEXT_PATH]/iig_[TIMESTAMP].png">
Caption: [Deep, emotional caption in Russian]
::IMG_DRAMA_END::

**MODULE 3: HORROR (Scary, tense, claustrophobic)**
::IMG_HORROR_START::
Image: <img data-iig-instruction='{"style":"anime","prompt":"simple black background, close-up, dark and eerie atmosphere, psychological horror, deep black shadows, high contrast, glowing eyes, terrified expression, [INSERT IMAGE PROMPT FORMULA HERE]","aspect_ratio":"16:9","image_size":"1K"}' src="/user/images/[CONTEXT_PATH]/iig_[TIMESTAMP].png">
Caption: [Ominous or cryptic caption in Russian]
::IMG_HORROR_END::

**MODULE 4: ROMANCE (Intimate, soft, dreamy)**
::IMG_ROMANCE_START::
Image: <img data-iig-instruction='{"style":"anime","prompt":"simple background, bokeh, abstract glowing background, close-up, warm ambient lighting, soft focus, glowing particles, blushing, intimate shoujo manga style, [INSERT IMAGE PROMPT FORMULA HERE]","aspect_ratio":"16:9","image_size":"1K"}' src="/user/images/[CONTEXT_PATH]/iig_[TIMESTAMP].png">
Caption: [Tender or poetic caption in Russian]
::IMG_ROMANCE_END::`

    },
    { 
        id: "cleaners", 
        files: ["regex-[bb]_hide_reasoning.json", "regex-[bb]_asterisk_fixer_(to_italics).json"],
        name: "🧹 cleaners"
    }
];

let loadedRegexes = {};
let promptHooksRegistered = false;

function getPromptModuleIds() {
    return bbModules.filter(mod => mod.prompt).map(mod => mod.id);
}

function getPromptInjectionKey(modId) {
    return `${extensionName}_${modId}`;
}

function migrateAutoPromptSettings() {
    const settings = extension_settings[extensionName];
    const current = settings.autoPrompts;
    const enabledList = Array.isArray(settings.enabled) ? settings.enabled : [];

    if (settings.autoPromptsVersion !== 2) {
        const previousGlobalValue = typeof current === "boolean" ? current : null;
        const previousMap = current && typeof current === "object" && !Array.isArray(current) ? current : {};

        settings.autoPrompts = {};
        getPromptModuleIds().forEach(id => {
            const wasPromptEnabled = previousGlobalValue !== null
                ? previousGlobalValue
                : previousMap[id] !== false;

            settings.autoPrompts[id] = Boolean(wasPromptEnabled && enabledList.includes(id));
        });
        settings.autoPromptsVersion = 2;
        return;
    }

    if (!current || typeof current !== "object" || Array.isArray(current)) {
        settings.autoPrompts = {};
    }

    getPromptModuleIds().forEach(id => {
        if (typeof settings.autoPrompts[id] !== "boolean") {
            settings.autoPrompts[id] = false;
        }
    });
}

function isModulePromptEnabled(modId) {
    return extension_settings[extensionName].autoPrompts?.[modId] === true;
}

function setModulePromptEnabled(modId, isEnabled) {
    extension_settings[extensionName].autoPrompts[modId] = Boolean(isEnabled);
}

jQuery(async () => {
    try {
        const settingsHtml = await $.get(`${extensionFolderPath}/index.html`);
        if ($("#extensions_settings2").length) {
            $("#extensions_settings2").append(settingsHtml);
        } else {
            $("#extensions_settings").append(settingsHtml);
        }

        if (!extension_settings[extensionName]) {
            extension_settings[extensionName] = { enabled: [], autoPrompts: {}, autoPromptsVersion: 2 };
        }
        if (!Array.isArray(extension_settings[extensionName].enabled)) {
            extension_settings[extensionName].enabled = [];
        }
        migrateAutoPromptSettings();
        if (!Array.isArray(extension_settings.regex)) {
            extension_settings.regex = [];
        }
        // @ts-ignore
        if (!Array.isArray(window.regex_data)) {
            // @ts-ignore
            window.regex_data = [];
        }

        await loadRegexFiles();
        syncPromptInjections();
        registerPromptInjectionHooks();
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
        const hasPrompt = Boolean(mod.prompt);
        const isPromptEnabled = hasPrompt && isModulePromptEnabled(mod.id);
        const promptTitle = isPromptEnabled
            ? "Автопромпт включен"
            : "Автопромпт выключен";

        const promptBtnHtml = hasPrompt ? `
            <button class="bb-rm-prompt-toggle ${isPromptEnabled ? "is-on" : ""}" type="button" data-mod-id="${mod.id}" title="${promptTitle}">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>Промпт</span>
            </button>
        ` : '';

        const copyBtnHtml = hasPrompt ? `
            <button class="bb-rm-copy" type="button" data-mod-id="${mod.id}" title="Скопировать системный промпт">
                <i class="fa-solid fa-copy"></i>
            </button>
        ` : '';

        const cardHtml = `
            <div class="bb-rm-card ${isEnabled ? "is-enabled" : ""}">
                <label class="bb-rm-main-toggle">
                    <input type="checkbox" data-mod-id="${mod.id}" ${isEnabled ? "checked" : ""}>
                    <span class="bb-rm-switch" aria-hidden="true"></span>
                    <span class="bb-rm-module-name">${mod.name}</span>
                </label>
                <div class="bb-rm-actions">
                    ${promptBtnHtml}
                    ${copyBtnHtml}
                </div>
            </div>
        `;
        listContainer.append(cardHtml);
    });

    listContainer.find(".bb-rm-main-toggle input[type=checkbox]").on("change", function() {
        const modId = $(this).data("mod-id");
        const isChecked = $(this).is(":checked");
        toggleRegex(modId, isChecked);
    });

    listContainer.off("click", ".bb-rm-prompt-toggle").on("click", ".bb-rm-prompt-toggle", function(e) {
        e.preventDefault();
        const modId = $(this).data("mod-id");
        const mod = bbModules.find(m => m.id === modId);
        const nextValue = !isModulePromptEnabled(modId);

        setModulePromptEnabled(modId, nextValue);
        setModulePromptInjection(modId);
        saveSettingsDebounced();
        renderManagerUI();

        // @ts-ignore
        toastr.info(`${nextValue ? "Автопромпт включен" : "Автопромпт выключен"}:\n${mod?.name || modId}`);
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

function setModulePromptInjection(modId) {
    const mod = bbModules.find(m => m.id === modId);
    const value = isModulePromptEnabled(modId) && mod?.prompt
        ? mod.prompt
        : "";

    setExtensionPrompt(
        getPromptInjectionKey(modId),
        value,
        extension_prompt_types.IN_PROMPT,
        0,
        false,
        extension_prompt_roles.SYSTEM,
    );
}

function syncPromptInjections() {
    bbModules.forEach(mod => {
        setModulePromptInjection(mod.id);
    });
}

function getEnabledPromptModules() {
    return bbModules.filter(mod => mod.prompt && isModulePromptEnabled(mod.id));
}

function isPromptAlreadyInChat(chat, prompt) {
    const rawPrompt = prompt.trim();
    const substitutedPrompt = substituteParams(rawPrompt);

    return chat.some(message => {
        const content = String(message?.content || "");
        return content.includes(rawPrompt) || content.includes(substitutedPrompt);
    });
}

function injectMissingChatCompletionPrompts(eventData) {
    if (!eventData || !Array.isArray(eventData.chat)) {
        return;
    }

    const missingPrompts = getEnabledPromptModules()
        .filter(mod => !isPromptAlreadyInChat(eventData.chat, mod.prompt))
        .map(mod => ({
            role: "system",
            content: substituteParams(mod.prompt),
        }));

    if (!missingPrompts.length) {
        return;
    }

    const firstNonSystemIndex = eventData.chat.findIndex(message => message?.role !== "system");
    const insertIndex = firstNonSystemIndex === -1 ? eventData.chat.length : firstNonSystemIndex;
    eventData.chat.splice(insertIndex, 0, ...missingPrompts);
}

function injectMissingTextCompletionPrompts(eventData) {
    if (!eventData || typeof eventData.prompt !== "string") {
        return;
    }

    const missingPrompts = getEnabledPromptModules()
        .map(mod => substituteParams(mod.prompt).trim())
        .filter(prompt => prompt && !eventData.prompt.includes(prompt));

    if (!missingPrompts.length) {
        return;
    }

    eventData.prompt = `${eventData.prompt}\n\n${missingPrompts.join("\n\n")}`;
}

function registerPromptInjectionHooks() {
    if (promptHooksRegistered) {
        return;
    }

    promptHooksRegistered = true;

    const resync = () => syncPromptInjections();
    eventSource.on(event_types.GENERATION_STARTED, resync);
    eventSource.on(event_types.GENERATION_AFTER_COMMANDS, resync);
    eventSource.on(event_types.GENERATE_BEFORE_COMBINE_PROMPTS, resync);
    eventSource.on(event_types.GENERATE_AFTER_COMBINE_PROMPTS, injectMissingTextCompletionPrompts);
    eventSource.on(event_types.CHAT_CHANGED, resync);
    eventSource.on(event_types.CHAT_COMPLETION_PROMPT_READY, injectMissingChatCompletionPrompts);
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

    renderManagerUI();
}
