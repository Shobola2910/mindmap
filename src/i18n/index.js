const translations = {
  uz: {
    // Toolbar
    'yop': 'Yop', 'och': 'Och', 'tema': 'Tema', 'yordam': 'Yordam',
    'orqaga': 'Orqaga', 'oldinga': 'Oldinga', 'tarix': 'Tarix',
    'png': 'PNG', 'pdf': 'PDF', 'html': 'HTML', 'import': 'Import',
    'tiklash': 'Tiklash', 'ai': 'AI',
    // Projects
    'loyihalar': 'Loyihalar', 'yangi_loyiha': 'Yangi loyiha',
    'loyiha_nomi': 'Loyiha nomi', 'yaratish': 'Yaratish',
    'ochish': 'Ochish', 'ochirish': 'O\'chirish', 'nusxa': 'Nusxa',
    'nomini_ozgartir': 'Nomini o\'zgartir', 'saqlangan': 'Saqlangan',
    'oxirgi_ozgarish': 'Oxirgi o\'zgarish',
    // Help
    'zoom': 'Zoom', 'surish': 'Xaritani surish', 'tanlash': 'Tanlash',
    'tahrirlash': 'Tahrirlash', 'yopoch': 'Yop/Och', 'node_qosh': 'Node qo\'shish',
    'node_ochir': 'O\'chirish', 'bekor': 'Bekor qilish',
    // History
    'versiyalar': 'Versiyalar tarixi', 'joriy': 'Joriy', 'node_ta': 'ta node',
    'hali_ozgarish': 'Hali o\'zgarish yo\'q',
    // AI
    'ai_title': 'AI Yordamchi', 'ai_empty': 'Node tanlang, keyin AI tahlil qiladi',
    'ai_tahlil': 'AI Tahlil qilsin', 'ai_tahlil_progress': 'Tahlil qilinyapti…',
    'ai_barchasini': 'Barchasini qo\'shish', 'ai_qosh': 'Qo\'sh',
    // Node actions
    'yangi_node': 'Yangi Node', 'node': 'Node', 'edit': 'Edit',
    // Modal
    'matn': 'Matn', 'rang': 'Rang', 'saqlash': 'Saqlash', 'bekor_q': 'Bekor',
    // Confirm
    'reset_confirm': 'Barcha ma\'lumotlarni qayta tiklaysizmi?',
    'ochirish_confirm': 'Bu loyihani o\'chirasizmi?',
    'noto_g_ri_json': 'Noto\'g\'ri JSON fayl',
    // Misc
    'nomsiz': 'Nomsiz loyiha',
  },
  en: {
    'yop': 'Close', 'och': 'Open', 'tema': 'Theme', 'yordam': 'Help',
    'orqaga': 'Undo', 'oldinga': 'Redo', 'tarix': 'History',
    'png': 'PNG', 'pdf': 'PDF', 'html': 'HTML', 'import': 'Import',
    'tiklash': 'Reset', 'ai': 'AI',
    'loyihalar': 'Projects', 'yangi_loyiha': 'New Project',
    'loyiha_nomi': 'Project name', 'yaratish': 'Create',
    'ochish': 'Open', 'ochirish': 'Delete', 'nusxa': 'Duplicate',
    'nomini_ozgartir': 'Rename', 'saqlangan': 'Saved',
    'oxirgi_ozgarish': 'Last modified',
    'zoom': 'Zoom', 'surish': 'Pan map', 'tanlash': 'Select',
    'tahrirlash': 'Edit', 'yopoch': 'Close/Open', 'node_qosh': 'Add node',
    'node_ochir': 'Delete', 'bekor': 'Cancel',
    'versiyalar': 'Version history', 'joriy': 'Current', 'node_ta': 'nodes',
    'hali_ozgarish': 'No changes yet',
    'ai_title': 'AI Assistant', 'ai_empty': 'Select a node to get AI suggestions',
    'ai_tahlil': 'Ask AI', 'ai_tahlil_progress': 'Thinking…',
    'ai_barchasini': 'Add all', 'ai_qosh': 'Add',
    'yangi_node': 'New Node', 'node': 'Node', 'edit': 'Edit',
    'matn': 'Text', 'rang': 'Color', 'saqlash': 'Save', 'bekor_q': 'Cancel',
    'reset_confirm': 'Reset all data?',
    'ochirish_confirm': 'Delete this project?',
    'noto_g_ri_json': 'Invalid JSON file',
    'nomsiz': 'Untitled project',
  },
  ru: {
    'yop': 'Свернуть', 'och': 'Развернуть', 'tema': 'Тема', 'yordam': 'Помощь',
    'orqaga': 'Назад', 'oldinga': 'Вперёд', 'tarix': 'История',
    'png': 'PNG', 'pdf': 'PDF', 'html': 'HTML', 'import': 'Импорт',
    'tiklash': 'Сброс', 'ai': 'ИИ',
    'loyihalar': 'Проекты', 'yangi_loyiha': 'Новый проект',
    'loyiha_nomi': 'Название проекта', 'yaratish': 'Создать',
    'ochish': 'Открыть', 'ochirish': 'Удалить', 'nusxa': 'Дублировать',
    'nomini_ozgartir': 'Переименовать', 'saqlangan': 'Сохранено',
    'oxirgi_ozgarish': 'Изменено',
    'zoom': 'Масштаб', 'surish': 'Панорама', 'tanlash': 'Выбрать',
    'tahrirlash': 'Изменить', 'yopoch': 'Свернуть/Развернуть', 'node_qosh': 'Добавить',
    'node_ochir': 'Удалить', 'bekor': 'Отмена',
    'versiyalar': 'История версий', 'joriy': 'Текущий', 'node_ta': 'узлов',
    'hali_ozgarish': 'Изменений нет',
    'ai_title': 'ИИ-ассистент', 'ai_empty': 'Выберите узел для анализа ИИ',
    'ai_tahlil': 'Спросить ИИ', 'ai_tahlil_progress': 'Анализирую…',
    'ai_barchasini': 'Добавить всё', 'ai_qosh': 'Добавить',
    'yangi_node': 'Новый узел', 'node': 'Узел', 'edit': 'Изменить',
    'matn': 'Текст', 'rang': 'Цвет', 'saqlash': 'Сохранить', 'bekor_q': 'Отмена',
    'reset_confirm': 'Сбросить все данные?',
    'ochirish_confirm': 'Удалить этот проект?',
    'noto_g_ri_json': 'Неверный файл JSON',
    'nomsiz': 'Без названия',
  }
}

let current = localStorage.getItem('algo_lang') || 'uz'

export function getLang() { return current }
export function setLang(l) { current = l; localStorage.setItem('algo_lang', l) }
export function t(key) { return translations[current]?.[key] || translations['uz'][key] || key }
export const LANGS = [
  { code: 'uz', label: "O'Z", flag: '🇺🇿' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
]
