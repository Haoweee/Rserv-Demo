require('dotenv').config();

const fs = require('fs').promises;
const lastSavePath = './external/last_message_id.json';

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });

async function sendMessage(id, message) {
  try {
    message = await bot.sendMessage(id, message);
    return message.message_id;
  } catch (error) {
    console.log('An error occured at telegram.SendMessage');
    return false;
  }
}

async function editMessage(message_id, chat_id, message) {
  try {
    message = await bot.editMessageText(message, { chat_id, message_id });
    return true;
  } catch (error) {
    // console.log(error)
    console.log('An error occured at telegram.editMessage');
    return false;
  }
}

async function getLastMessage() {
  return fs
    .readFile(lastSavePath, 'utf8')
    .then(data => JSON.parse(data))
    .catch(err => {
      throw err;
    });
}

async function saveLastMessage(chatID, timestamp) {
  try {
    new_json = { chatID, timestamp };

    const jsonString = JSON.stringify(new_json, null, 2); // Pretty-print JSON with 2-space indentation
    fs.writeFile(lastSavePath, jsonString, 'utf8', err => {
      if (err) {
        console.error('Error writing file:', err);
        return false;
      } else {
        console.log('JSON file has been saved.');
        return true;
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  sendMessage,
  editMessage,
  getLastMessage,
  saveLastMessage,
};
