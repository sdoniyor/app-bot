
const TelegramBot = require('node-telegram-bot-api');

const token = '7613626026:AAGQgSJWSIL4fqGOdYKh-n4sBxIG7HwfF7U';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  // Устанавливаем кнопку меню слева от скрепки с Web App
  try {
    await bot.setChatMenuButton(chatId, {
      type: 'web_app',
      text: 'Открыть приложение',
      web_app: { url: 'https://sdoniyor.github.io/app-bot/' }
    });

    bot.sendMessage(chatId, 'Кнопка меню обновлена! Нажми кнопку слева от скрепки.');
  } catch (e) {
    console.error('Ошибка установки меню:', e);
    bot.sendMessage(chatId, 'Не удалось установить кнопку меню.');
  }
});
