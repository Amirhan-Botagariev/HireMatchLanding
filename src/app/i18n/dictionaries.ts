import type { Locale } from "@/app/i18n/config";

export const ru = {
  nav: { how: "Как это работает", why: "Почему мы", access: "Доступ" },
  ctaBtn: "Получить доступ",
  hero: {
    h1a: "Устаёшь тратить часы на отклики, ",
    h1b: "которые никто не читает?",
    p: "Твоё резюме теряется среди сотен других? Доверь рутину ИИ и получай больше интервью.",
    primary: "Получить ранний доступ",
    secondary: "Как это работает",
  },
  process: {
  steps: [
    { title: "Загрузи резюме", text: "Принимаем PDF/DOCX. Дальше всё сделает ИИ." },
    { title: "AI анализирует", text: "Извлекаем опыт, навыки и ключевые метрики." },
    { title: "Подбор вакансий", text: "Сопоставляем с релевантными позициями и фильтруем шум." },
    { title: "Автоматические отклики", text: "Готовим персонализированные отклики под каждую вакансию." },
    { title: "Собеседование и оффер", text: "Помогаем пройти интервью и закрыть оффер." },
  ],
  sourcesTitle: "Все вакансии в одном месте!",
  },
  cta: {
    h2a: "Готов попробовать ",
    h2b: "FastMatch",
    h2c: "?",
    p: "Стань одним из первых, кто получит доступ к платформе, которая ускорит твой поиск работы.",
    submit: "Попробовать",
    sending: "Отправка…",
    done: "Готово!",
    emailPh: "your-email@example.com",
    error: "Вы ввели некорректную почту",
    namePh: "Имя",
    specialtyPh: "Специальность",
    telegramPh: "Telegram (@username)",
    nameError: "Имя должно содержать только буквы",
    telegramError: "Telegram должен начинаться с @ и содержать не менее 5 символов",
    note: "Никакого спама. Только уведомления о запуске и важные обновления.",
  },
  footer: {
    privacy: "Политика конфиденциальности",
    contacts: "Контакты",
    copyright: "© 2025 FastMatch. All rights reserved.",
  },
  switch: { ru: "РУС", en: "EN", kz: "ҚАЗ" },
};
export type Dict = typeof ru;

export const en: Dict = {
  nav: { how: "How it works", why: "Why us", access: "Access" },
  ctaBtn: "Get access",
  hero: {
    h1a: "Tired of spending hours on applications ",
    h1b: "that nobody reads?",
    p: "Your resume gets lost among hundreds of others. Let AI handle the routine and get more interviews.",
    primary: "Get early access",
    secondary: "How it works",
  },
  process: {
  steps: [
    { title: "Upload your resume", text: "PDF/DOCX accepted. AI handles the rest." },
    { title: "AI analyzes", text: "We extract experience, skills and key metrics." },
    { title: "Job matching", text: "We map you to relevant roles and filter noise." },
    { title: "Auto applications", text: "Personalized applications for each job." },
    { title: "Interview & offer", text: "We help you pass interviews and land an offer." },
  ],
  sourcesTitle: "All jobs in one place!",
  },
  cta: {
    h2a: "Ready to try ",
    h2b: "FastMatch",
    h2c: "?",
    p: "Be among the first to access a platform that speeds up your job search.",
    submit: "Try",
    sending: "Sending…",
    done: "Done!",
    emailPh: "your-email@example.com",
    error: "Invalid email",
    namePh: "Name",
    specialtyPh: "Specialty",
    telegramPh: "Telegram (@username)",
    nameError: "Name must contain letters only",
    telegramError: "Telegram must start with @ and be at least 5 characters",
    note: "No spam. Only launch notifications and important updates.",
  },
  footer: {
    privacy: "Privacy Policy",
    contacts: "Contacts",
    copyright: "© 2025 FastMatch. All rights reserved.",
  },
  switch: { ru: "RU", en: "EN", kz: "QAZ" },
};

export const kz: Dict = {
  nav: { how: "Бұл қалай жұмыс істейді", why: "Неге бізді таңдаған дұрыс", access: "Қол жеткізу" },
  ctaBtn: "Қол жеткізу",
  hero: {
    h1a: "Ешкім оқымайтын хаттарды ",
    h1b: "сағаттап жазғаннан шаршадың ба?",
    p: "Сенің түйіндемең басқалардың арасында жоғалып қалады ма? Рутинаны ЖИ-ге тапсыр да, көбірек сұхбат ал.",
    primary: "Ерте қол жеткізу",
    secondary: "Бұл қалай жұмыс істейді",
  },
  process: {
  steps: [
    { title: "Резюмеңізді жүктеңіз", text: "PDF/DOCX қабылдаймыз. Қалғанын AI істейді." },
    { title: "AI талдайды", text: "Тәжірибе, дағдылар мен негізгі метрикаларды шығарамыз." },
    { title: "Вакансияларды іріктеу", text: "Сәйкес позицияларды табамыз, шуды сүземіз." },
    { title: "Авто-жіберілімдер", text: "Әр вакансияға жеке жауап дайындаймыз." },
    { title: "Сұхбат және оффер", text: "Сұхбаттан өтуге және оффер алуға көмектесеміз." },
  ],
  sourcesTitle: "Барлық жұмыс — бір жерде!",
  },
  cta: {
    h2a: "",
    h2b: "FastMatch",
    h2c: " пайдалануға дайынсың ба?",
    p: "Жұмыс іздеуді жылдамдататын платформаға алғашқылардың бірі болып қол жеткіз.",
    submit: "Қатысу",
    sending: "Жіберілуде…",
    done: "Дайын!",
    emailPh: "email@example.com",
    error: "Жарамсыз пошта",
    note: "Спам жоқ. Тек маңызды хабарламалар.",
    namePh: "Аты-жөні",
    specialtyPh: "Мамандығы",
    telegramPh: "Telegram (@username)",
    nameError: "Аты-жөні тек әріптерден тұруы керек",
    telegramError: "Telegram @ таңбасымен басталып, кемінде 5 таңба болуы керек",
  },
  footer: {
    privacy: "Құпиялылық саясаты",
    contacts: "Байланыс",
    copyright: "© 2025 FastMatch. Барлық құқықтар қорғалған.",
  },
  switch: { ru: "РУС", en: "EN", kz: "ҚАЗ" },
};

export function getDictionary(locale: Locale): Dict {
  if (locale === "en") return en;
  if (locale === "kz") return kz;
  return ru;
}