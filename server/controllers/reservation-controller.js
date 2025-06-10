require('dotenv').config();

const auth = require('../middleware/auth');
const db = require('../db');
const schedule = require('node-schedule');
const fs = require('fs').promises;

// const twilio = require("../external/twilio");
const telegram = require('../external/telegram');
const stripe = require('../external/stripe');

const Mutex = require('async-mutex').Mutex;

const globalMutex = new Mutex();

const MILLIS_PER_MIN = 60 * 1000;
const MILLIS_PER_HOUR = 60 * 60 * 1000;
const _MILLIS_PER_DAY = 24 * 60 * 60 * 1000;

const CHARGE_AMOUNT = 100;

const reservationAccessCodes = {};
const reservations = {};
const tempReservationHold = {};

let TELEGRAM_TODAY_MESSAGE_ID = null;

schedule.scheduleJob('0 0 * * *', () => {
  sendDailyTimedMessage();
});

setInterval(() => {
  for (const [key, value] of Object.entries(reservationAccessCodes)) {
    if (value.expiration < Date.now()) {
      delete reservationAccessCodes[key];
    }
  }

  for (const [key, value] of Object.entries(reservations)) {
    if (value.expiration < Date.now()) {
      delete reservations[key];
      delete tempReservationHold[key];
    }
  }
}, MILLIS_PER_HOUR);

function formatDateTime(datetime) {
  const dateObj = new Date(datetime);

  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');

  return {
    date: `${month}/${day}/${year}`,
    time: dateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
  };
}

function formatTelegramAllMessage(phoneNumber, datetime, numGuests, occasion, notes) {
  date_time = formatDateTime(datetime);
  telegram_all_message = `===================\nNEW RESERVATION\n===================\nPhone Number: ${phoneNumber}\nDate: ${date_time.date}\nTime: ${date_time.time}\nGuests: ${numGuests}\nOccasion: ${occasion}\nNotes: ${notes}\n===================`;
  return telegram_all_message;
}

function formatTelegramTodayMessage(reservations) {
  // Datetime as YYYY-MM-DD HH:MM:SS
  telegram_today_message = `===================\nTODAY'S RESERVATIONS\n===================`;

  reservations.forEach(reservation => {
    date_time = formatDateTime(reservation.timestamp);
    telegram_today_message += `\nPhone Number: ${reservation.phoneNumber}\nDate: ${date_time.date}\nTime: ${date_time.time}\nGuests: ${reservation.numGuests}\nOccasion: ${reservation.occasion}\nNotes: ${reservation.notes}\n===================`;
  });

  return telegram_today_message;
}

async function sendDailyTimedMessage() {
  query_response = await db.getTodayReservations();
  if (query_response === false) {
    return false;
  }
  message_response = await telegram.sendMessage(
    process.env.TELEGRAM_TODAY_CHANNEL,
    formatTelegramTodayMessage(query_response)
  );
  if (message_response === false) {
    return false;
  }
  TELEGRAM_TODAY_MESSAGE_ID = message_response;
  let today_date = new Date();
  today_date.setHours(0, 0, 0, 0);
  await telegram.saveLastMessage(TELEGRAM_TODAY_MESSAGE_ID, today_date);
}

async function _sendDailyMessage(today_date) {
  res = {
    status: 200,
    message: '',
  };
  // Check for today's last message id in save file
  if (!TELEGRAM_TODAY_MESSAGE_ID) {
    const last_message = await telegram.getLastMessage();
    if (last_message.timestamp && last_message.chatID) {
      let last_message_date = new Date(last_message.timestamp);
      last_message_date.setHours(0, 0, 0, 0);

      if (last_message_date.getTime() === today_date.getTime()) {
        TELEGRAM_TODAY_MESSAGE_ID = last_message.chatID;
      }
    }
  }

  // Ping saved message id to check if exists
  if (
    (await telegram.editMessage(
      TELEGRAM_TODAY_MESSAGE_ID,
      process.env.TELEGRAM_TODAY_CHANNEL,
      'ping'
    )) === false
  ) {
    TELEGRAM_TODAY_MESSAGE_ID = null;
    console.warn('Ping failed');
  }

  // Get today's reservations
  query_response = await db.getTodayReservations();
  if (query_response === false) {
    res.status = 500;
    res.message = "Could not get today's reservations. Today channel not updated";
  }
  // Send new today message
  if (!TELEGRAM_TODAY_MESSAGE_ID) {
    message_response = await telegram.sendMessage(
      process.env.TELEGRAM_TODAY_CHANNEL,
      formatTelegramTodayMessage(query_response)
    );
    if (message_response === false) {
      res.status = 500;
      res.message =
        'Reservation has been completed and stored in database, however, today channel has not been updated. All channel has been updated successfully';
    }

    TELEGRAM_TODAY_MESSAGE_ID = message_response;
    await telegram.saveLastMessage(TELEGRAM_TODAY_MESSAGE_ID, today_date);
  }
  // Edit existing today message
  else {
    if (
      (await telegram.editMessage(
        TELEGRAM_TODAY_MESSAGE_ID,
        process.env.TELEGRAM_TODAY_CHANNEL,
        formatTelegramTodayMessage(query_response)
      )) === false
    ) {
      res.status = 500;
      res.message =
        'Reservation has been completed and stored in database, however, today channel has not been updated. All channel has been updated successfully';
    }
  }

  res.telegram_id = TELEGRAM_TODAY_MESSAGE_ID;
  return res;
}

async function logPossiblePayment(phoneNumber, paymentIntentID) {
  try {
    message =
      phoneNumber +
      ' has possibly paid. Please verify with Stripe if something went wrong. Payment Intent ID: ' +
      paymentIntentID +
      '\n';

    fs.appendFile('./log.txt', message, 'utf8', err => {
      if (err) {
        console.error('Error writing file:', err);
        return false;
      } else {
        return true;
      }
    });
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

const send2FA = async (req, res) => {
  try {
    const TEST_PHONE_NUMBER = process.env.TEST_PHONE_NUMBER;
    let { phoneNumber } = req.body;

    if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
      return res.status(400).json({
        errorMessage: 'Invalid phone number.',
      });
    }

    // DEMO CODE //
    if (phoneNumber !== TEST_PHONE_NUMBER) {
      return res.status(400).json({
        errorMessage: 'Invalid testing phone number.',
      });
    }

    // DEMO CODE //
    const accessCode = '$haowee';

    // const accessCode = Math.random().toString(36).slice(2).substring(0,6);

    // sms_res = await twilio.sendText(phoneNumber, process.env.TWILIO_PHONE_NUMBER, accessCode);

    // if(sms_res == false){
    //     return res.status(500).json({
    //         errorMessage: "Could not send SMS"
    //     });
    // }

    reservationAccessCodes[phoneNumber] = {
      accessCode,
      expiration: Date.now() + 10 * MILLIS_PER_MIN,
      verified: false,
    };

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.warn(error);
    return res.status(400).json({
      errorMessage: '2FA code could not be sent',
    });
  }
};

const validate2FA = async (req, res) => {
  try {
    const { accessCode } = req.body;
    let { phoneNumber } = req.body;

    if (!phoneNumber || !/^\d+$/.test(phoneNumber || !accessCode)) {
      return res.status(400).json({
        errorMessage: 'No valid phone number or access code provided.',
      });
    }

    if (!reservationAccessCodes[phoneNumber]) {
      return res.status(400).json({
        errorMessage: 'No 2FA code was sent for this user.',
      });
    }

    if (reservationAccessCodes[phoneNumber].accessCode !== accessCode) {
      return res.status(400).json({
        errorMessage: 'Incorrect 2FA code.',
      });
    }

    if (reservationAccessCodes[phoneNumber].expiration < Date.now()) {
      delete reservationAccessCodes[phoneNumber];
      return res.status(401).json({
        errorMessage: '2FA code has expried.',
      });
    }

    reservationAccessCodes[phoneNumber].verified = true;
    reservationAccessCodes[phoneNumber].expiration = Date.now() + 15 * MILLIS_PER_MIN;

    const token = auth.signReservationToken(
      phoneNumber,
      reservationAccessCodes[phoneNumber].expiration
    );

    return res
      .cookie('resToken', token, {
        httpOnly: true,
        secure: false, // ❗ Must be false for local HTTP
        sameSite: 'Lax', // "Lax" or "Strict" work for local dev
        expires: new Date(reservationAccessCodes[phoneNumber].expiration),
      })
      .status(200)
      .json({
        success: true,
      });
  } catch (error) {
    console.warn(error);
    return res.status(401).json({
      errorMessage: '2FA code could not be verified',
    });
  }
};

const selectReservation = async (req, res) => {
  try {
    const { numGuests, datetime, phoneNumber } = req.body;

    let { occasion, notes } = req.body;

    if (!numGuests || !datetime || !phoneNumber) {
      return res.status(400).json({
        errorMessage: 'Time, date and number of guests must be filed',
      });
    }

    if (!/^\d+$/.test(phoneNumber)) {
      return res.status(400).json({
        errorMessage: 'No valid phone number provided.',
      });
    }

    if (!occasion) {
      occasion = '';
    }
    if (!notes) {
      notes = '';
    }

    if (!reservationAccessCodes[phoneNumber]) {
      return res.status(400).json({
        errorMessage: 'Phone number has not passed 2FA.',
      });
    }

    const availability = await getOpenTables(numGuests, datetime);

    if (!availability[datetime] || availability[datetime].length === 0) {
      return res.status(400).json({
        errorMessage: 'Reservation date and time not available',
      });
    }

    const paymentIntent = await stripe.createPaymentIntent(CHARGE_AMOUNT, 'usd');
    if (paymentIntent === false) {
      return res.status(500).json({
        errorMessage: 'Could not initalize payment intent',
      });
    }

    reservations[phoneNumber] = {
      numGuests,
      datetime,
      occasion,
      notes,
      expiration: Date.now() + 15 * MILLIS_PER_MIN,
      paymentIntentID: paymentIntent.id,
    };
    reservationAccessCodes[phoneNumber].expiration = Date.now() + 15 * MILLIS_PER_MIN;

    const token = auth.signReservationToken(
      phoneNumber,
      reservationAccessCodes[phoneNumber].expiration
    );

    return res
      .cookie('resToken', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        expires: new Date(reservationAccessCodes[phoneNumber].expiration),
      })
      .status(200)
      .json({
        client_secret: paymentIntent.client_secret,
        success: true,
      });
  } catch (error) {
    console.warn(error);
    return res.status(500).json({
      errorMessage: 'Reservation could not be made',
    });
  }
};

const placeReservationHold = async (req, res) => {
  let release = undefined;
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        errorMessage: 'Phone number not provided',
      });
    }

    if (!/^\d+$/.test(phoneNumber)) {
      return res.status(400).json({
        errorMessage: 'No valid phone number provided.',
      });
    }
    if (
      !reservationAccessCodes[phoneNumber] ||
      !reservations[phoneNumber] ||
      !reservationAccessCodes[phoneNumber].verified
    ) {
      return res.status(401).json({
        errorMessage: 'Session expired. Please redo 2FA',
      });
    }

    release = await globalMutex.acquire();

    resDate = reservations[phoneNumber].datetime;
    const availability = await getOpenTables(reservations[phoneNumber].numGuests, resDate);

    if (!availability[resDate] || availability[resDate].length === 0) {
      return res.status(400).json({
        errorMessage: 'Reservation date and time not available',
      });
    }

    tempReservationHold[phoneNumber] = {
      datetime: resDate,
      tableID: availability[resDate][0].tableID,
    };

    release();

    reservations[phoneNumber].expiration = Date.now() + 10 * MILLIS_PER_MIN;
    reservationAccessCodes[phoneNumber].expiration = Date.now() + 10 * MILLIS_PER_MIN;

    const token = auth.signReservationToken(
      phoneNumber,
      reservationAccessCodes[phoneNumber].expiration
    );

    return res
      .cookie('resToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        expires: new Date(reservationAccessCodes[phoneNumber].expiration),
      })
      .status(200)
      .json({
        success: true,
      });
  } catch (error) {
    console.warn(error);
    return res.status(500).json({
      errorMessage: 'Could not retrieve table availability',
    });
  } finally {
    if (release) {
      release();
    }
  }
};

const processReservation = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    let _today = false;

    if (!phoneNumber) {
      return res.status(400).json({
        errorMessage: 'Phone number not provided',
      });
    }

    if (!/^\d+$/.test(phoneNumber)) {
      return res.status(400).json({
        errorMessage: 'No valid phone number provided.',
      });
    }

    if (!reservationAccessCodes[phoneNumber] || !reservationAccessCodes[phoneNumber].verified) {
      return res.status(401).json({
        errorMessage: 'Session expired. Please redo 2FA',
      });
    }

    if (!reservations[phoneNumber]) {
      return res.status(401).json({
        errorMessage: 'No reservation selected',
      });
    }

    if (!tempReservationHold[phoneNumber]) {
      return res.status(401).json({
        errorMessage: 'Temporary hold not found',
      });
    }

    await logPossiblePayment(phoneNumber, reservations[phoneNumber].paymentIntentID);

    let res_date = new Date(reservations[phoneNumber].datetime);
    res_date.setHours(0, 0, 0, 0);

    let today_date = new Date();
    today_date.setHours(0, 0, 0, 0);

    if (res_date.getTime() === today_date.getTime()) {
      _today = true;
    }

    // Check Charge
    const charge_response = await stripe.retrievePaymentIntent(
      reservations[phoneNumber].paymentIntentID
    );
    if (charge_response === false || charge_response.status !== 'succeeded') {
      return res.status(402).json({
        errorMessage: 'Charge not proccess. Try again',
      });
    }

    // DATABASE PUSH
    // Store reservation to database
    let query_response = await db.addReservation(
      phoneNumber,
      reservations[phoneNumber].datetime,
      reservations[phoneNumber].numGuests,
      reservations[phoneNumber].occasion,
      reservations[phoneNumber].notes,
      tempReservationHold[phoneNumber].tableID
    );

    telegram_all_message = formatTelegramAllMessage(
      phoneNumber,
      reservations[phoneNumber].datetime,
      reservations[phoneNumber].numGuests,
      reservations[phoneNumber].occasion,
      reservations[phoneNumber].notes
    );

    delete reservationAccessCodes[phoneNumber];
    delete reservations[phoneNumber];
    delete tempReservationHold[phoneNumber];

    if (query_response === false) {
      return res.status(500).json({
        errorMessage: 'Reservation could not be made, but payment went through',
      });
    }

    res.clearCookie('resToken');
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');

    // Send telegram messages
    // if(await telegram.sendMessage(process.env.TELEGRAM_ALL_CHANNEL, telegram_all_message) === false) {
    //     return res.status(500).json({
    //         errorMessage: "Reservation has been completed and stored in database, however, telegram channels have not been updated"
    //     });
    // }

    // Send daily message
    // if(today === true) {
    //     message_res = await sendDailyMessage(today_date)
    //     if(message_res.status !== 200){
    //         return res.status(message_res.status).json({
    //             errorMessage: message_res.message
    //         });
    //     }
    // }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.warn(error);
    return res.status(500).json({
      errorMessage: 'Reservation could not be made',
    });
  }
};

const clearResToken = async (req, res) => {
  res.clearCookie('resToken');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).json({
    success: true,
  });
};

function calculateReservationTimes(startTime, endTime, buffer) {
  {
    const bufferMs = buffer * 60 * 1000; // Convert buffer from minutes to milliseconds
    const timeSlots = [];

    const now = new Date();
    const startTimeDate = new Date(startTime);

    const yesterdayStartDate = new Date(startTime);
    yesterdayStartDate.setDate(yesterdayStartDate.getDate() - 1);

    for (
      let time = startTimeDate;
      time <= new Date(endTime);
      time = new Date(time.getTime() + bufferMs)
    ) {
      let timeSlot = new Date(time);

      if (
        timeSlot.getDate() !== startTime.getDate() ||
        timeSlot.getMonth() !== startTime.getMonth() ||
        timeSlot.getFullYear() !== startTime.getFullYear()
      ) {
        timeSlot.setDate(timeSlot.getDate() - 1);
      }

      if (timeSlot >= startTimeDate || now < yesterdayStartDate) {
        timeSlots.push(timeSlot.toISOString());
      }
    }

    return timeSlots;
  }
}

async function getOpenTables(seats, datetime) {
  try {
    filteredTables = await db.getFilteredTableInfo(seats);

    reservedTables = await db.getReservedTables(datetime, seats);

    reservationConfig = await db.getReservationConfig();

    if (!filteredTables || !reservedTables || !reservationConfig) {
      return false;
    }

    datetime = new Date(datetime);

    let startTime = new Date(reservationConfig.startTime);
    startTime.setFullYear(datetime.getFullYear());
    startTime.setMonth(datetime.getMonth());
    startTime.setDate(datetime.getDate());

    let endTime = new Date(reservationConfig.endTime);
    endTime.setFullYear(datetime.getFullYear());
    endTime.setMonth(datetime.getMonth());
    endTime.setDate(datetime.getDate());

    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    let lastCall = new Date(startTime);
    lastCall.setHours(startTime.getHours() - 4);

    // Same day res check 4 hours before
    const currDate = new Date();
    if (currDate > lastCall) {
      return {};
    }

    // Check for past dates
    if (datetime < currDate) {
      return {};
    }

    // Update reservedTables with tempReserved
    Object.values(tempReservationHold).forEach(tempRes => {
      tempResDate = new Date(tempRes.datetime);

      if (!reservedTables[tempResDate]) {
        reservedTables[tempResDate] = [{ tableID: tempRes.tableID, reservedCount: 1 }];
      } else {
        reservedTables[tempResDate].forEach(table => {
          if (table.tableID === tempRes.tableID) {
            table.reservedCount++;
          }
        });
      }
    });

    reservationTimes = calculateReservationTimes(startTime, endTime, reservationConfig.buffer);
    const availability = {};

    reservationTimes.forEach(resTime => {
      availability[resTime] = JSON.parse(JSON.stringify(Object.values(filteredTables)));

      if (reservedTables[resTime]) {
        const updatesMap = new Map(
          reservedTables[resTime].map(update => [update.tableID, update.reservedCount])
        );
        availability[resTime].forEach(table => {
          if (updatesMap.has(table.tableID)) {
            table.reservedCount = updatesMap.get(table.tableID);
          }
        });
        availability[resTime] = availability[resTime].filter(
          table => table.reservedCount < table.tableCount
        );
      }
      availability[resTime].sort((a, b) => a.maxSeats - b.maxSeats);
    });
    return availability;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

const getAvailability = async (req, res) => {
  try {
    const { seats, date } = req.query;

    if (!seats || !date) {
      return res.status(400).json({
        errorMessage: 'Both seats and date must be provided',
      });
    }

    availableTables = await getOpenTables(seats, date);

    if (availableTables == false) {
      return res.status(400).json({
        errorMessage: 'Could not retrieve table availability',
      });
    }

    return res.status(200).json(availableTables);
  } catch (error) {
    console.warn(error);
    return res.status(500).json({
      errorMessage: 'Could not retrieve table availability',
    });
  }
};

const getTodayStatus = async (req, res) => {
  try {
    const reservationConfig = await db.getReservationConfig();

    if (!reservationConfig) {
      return res.status(500).json({
        errorMessage: 'Could not retrieve table availability',
      });
    }
    const currDate = new Date();

    let startTime = new Date(reservationConfig.startTime);
    startTime.setFullYear(currDate.getFullYear());
    startTime.setMonth(currDate.getMonth());
    startTime.setDate(currDate.getDate());

    let lastCall = new Date(startTime);
    lastCall.setHours(startTime.getHours() - 4);

    // Same day res check 4 hours before
    if (currDate > lastCall) {
      return res.status(200).json({
        today: false,
      });
    } else {
      return res.status(200).json({
        today: true,
      });
    }
  } catch (error) {
    console.warn(error);
    return res.status(500).json({
      errorMessage: 'Could not retrieve table availability',
    });
  }
};

module.exports = {
  send2FA,
  validate2FA,
  processReservation,
  selectReservation,
  clearResToken,
  getAvailability,
  placeReservationHold,
  getTodayStatus,
};
