# BB UI Regex Manager

Центр управления визуальными regex-модулями для SillyTavern. Включает готовые интерфейсные блоки, стили и технические cleaner-фиксы.

## Модули

- **Phone** - смартфон с feed, post, story, DM, OS/news и push-уведомлениями.
- **Lore Orbs** - интерактивные лор-сферы с короткими фрагментами мира, слухами, воспоминаниями и атмосферными деталями.
- **Radio** - виджеты радио и подкастов с текстовыми блоками эфира.
- **Clocks** - плашка даты, времени, локации и погоды.
- **Transitions** - стилизованные разделители, заголовки эпизодов и переходы между сценами.
- **Scene Cards** - карточки-иллюстрации для комедии, драмы, хоррора и романтики.
- **Cleaners** - скрытие reasoning-блоков, исправления HTML и конвертация некоторых текстовых паттернов.

## Стили

У некоторых модулей есть выбор визуального стиля:

- Phone: классический смартфон и KimetsuPhone.
- Radio: радио Каири, радио Акико, Lo-Fi Podcast Лона.
- Clocks: классическое стекло, красно-золотой, пыльная роза, хроники Сильвера.
- Transitions: классическое стекло, красно-золотой, пыльная роза, хроники Сильвера.

## Промпты и интеграция

- Модули с системным промптом имеют кнопку копирования.
- Промпт можно подключить автоматически через кнопку в карточке модуля.
- Выбранные regex-стили синхронизируются с глобальными regex-скриптами SillyTavern.

## Зависимости

Для модулей, которые генерируют изображения через `<img data-iig-instruction=...>`, требуется расширение `sillyimages`:

https://github.com/0xl0cal/sillyimages

В первую очередь это касается `Phone` и `Scene Cards`.

## Скриншоты

<img width="1498" height="742" alt="BB UI Regex transitions" src="https://github.com/user-attachments/assets/43ef2366-d486-45ae-8db4-a4f65c16d4a3" />

<img width="1131" height="643" alt="BB UI Regex phone" src="https://github.com/user-attachments/assets/74469c82-914c-421d-971c-14ccc39a6af9" />

<img width="432" height="489" alt="BB UI Regex lore orb" src="https://github.com/user-attachments/assets/20a4d361-3bd9-4f3b-bd8a-5535f267fb5a" />

<img width="458" height="594" alt="BB UI Regex Manager" src="https://github.com/user-attachments/assets/d5cc7195-d6af-4f6e-ab46-22f40ee56c11" />

## Установка

1. Откройте SillyTavern.
2. Перейдите в `Расширения -> Установить расширение`.
3. Вставьте ссылку на репозиторий:
   `https://github.com/maxkara14/BB-UI-Regex-Pack`
4. Перезагрузите страницу.
5. Откройте `BB UI Regex Manager` в настройках расширений.

## Автор

- [BruniikBron: Lo-Fi & Mods](https://bblofi.online/)
- [Telegram](https://t.me/Brun11kBr0n)

## Благодарности

Спасибо [Яблочку](https://t.me/YablochnyAI). База [Regex Manager](https://github.com/kykaaj/regex-manager) стала главным источником вдохновения и фундаментом для этого расширения.
