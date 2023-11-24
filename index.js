import TelegramApi from 'node-telegram-bot-api';
import { gameOptions, againOptions } from './options';
import { againOptions } from './options';
const token = '6039426551:AAHOSpPceCF5611-1OBy3-FLB395gWQDbJE';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Сейчас я загадаю число от 0 до 9`);
  const randomNumber = String(Math.floor(Math.random() * 10));
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, ` Отгадывай`, gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информацию' },
    { command: '/game', description: 'ИГра угадай цифру' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        `https://chpic.su/_data/stickers/r/RageMemes/RageMemes_025.webp?v=1695185101`,
      );
      return bot.sendMessage(chatId, `Добро пожаловать в чат`);
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, `Я тебя не понимаю`);
  });

  bot.on('callback_quary', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляем Ты выбрал цифру ${chats[chatId]}`, againOption);
    } else {
      return bot.sendMessage(chatId, `Не угадал ${chats[chatId]}`, againOption);
    }
  });
};

start();
