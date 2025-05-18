// Укажи здесь имя бота
const TELEGRAM_BOT_USERNAME = 'app bot'; // 👈 Сюда имя бота (без @)
const TELEGRAM_WEB_APP_URL = `tg://resolve?domain=${TELEGRAM_BOT_USERNAME}&start=webapp`;

function openTelegramBot() {
    window.location.href = TELEGRAM_WEB_APP_URL;
}
