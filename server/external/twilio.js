require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendText(to, from, body) {
  try {
    await client.messages.create({
      body,
      from,
      to,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  sendText,
};
