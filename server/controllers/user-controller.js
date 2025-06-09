require('dotenv').config();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const auth = require('../middleware/auth');
const db = require('../db');

const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, password, passwordVerify } = req.body;
    let { admin, emailAddress } = req.body;

    if (!admin) {
      admin = 0;
    } else if (admin !== 1) {
      admin = 0;
    }

    if (!firstName || !lastName || !emailAddress || !password || !passwordVerify) {
      return res.status(400).json({
        errorMessage: 'Please enter all required fields.',
      });
    }

    emailAddress = emailAddress.toLowerCase();

    if (1 > firstName.length || firstName.length > 20) {
      return res.status(400).json({
        errorMessage: 'First name must be between 1-20 characters',
      });
    }

    if (1 > lastName.length || lastName.length > 20) {
      return res.status(400).json({
        errorMessage: 'Last name must be between 1-20 characters',
      });
    }

    if (5 > emailAddress.length || emailAddress.length > 60) {
      return res.status(400).json({
        errorMessage: 'Email address must be between 5-60 characters',
      });
    }

    if (!emailAddress.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({
        errorMessage: 'Please enter a valid email address.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        errorMessage: 'Please enter a password of at least 8 characters.',
      });
    }

    if (password !== passwordVerify) {
      return res.status(400).json({
        errorMessage: 'Passwords dont match.',
      });
    }

    const existingUser = await db.getUserFromEmail(emailAddress);
    if (existingUser) {
      return res.status(400).json({
        errorMessage: 'An account with this email already exists.',
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    let response = await db.createUser(emailAddress, passwordHash, firstName, lastName, admin);
    if (!response.affectedRows) throw new Error('SQL query failed');

    const registeredUser = await db.getUserFromEmail(emailAddress);
    if (!registeredUser) throw new Error('SQL query failed');

    // LOGIN THE USER
    const token = auth.signUserToken(registeredUser['email'], registeredUser['user_id']);

    res
      .cookie('userToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: MILLIS_PER_DAY * 30,
      })
      .status(200)
      .json({
        success: true,
        user: {
          emailAddress: registeredUser['email'],
        },
      });
  } catch (error) {
    console.warn(error);
    return res.status(201).json({
      errorMessage: 'Unable to register.',
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let emailAddress = req.body.emailAddress;
    const password = req.body.password;

    if (!emailAddress || !password) {
      return res.status(400).json({
        errorMessage: 'Please enter all required fields.',
      });
    } else {
      emailAddress = req.body.emailAddress.toLowerCase();
    }

    const existingUser = await db.getUserFromEmail(emailAddress);
    if (!existingUser) throw new Error('User does not exist');

    const correctPass = await bcrypt.compare(password, existingUser['password']);

    if (!correctPass) throw new Error('Incorrect password');

    const token = auth.signUserToken(existingUser['email'], existingUser['user_id']);

    return res
      .cookie('userToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: MILLIS_PER_DAY * 30,
      })
      .status(200)
      .json({
        success: true,
      });
  } catch (error) {
    console.warn(error);
    return res.status(400).json({
      errorMessage: 'Invalid email address or password',
    });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie('userToken');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).json({
    success: true,
  });
};

const getReservationSetttings = async (req, res) => {
  try {
    let table = await db.getTableConfig();
    let reservation = await db.getReservationConfig();

    if (!table || !reservation) {
      return res.status(500).json({
        errorMessage: 'Could not fetch settings',
      });
    }

    reservation['tables'] = table;
    return res.status(200).json(reservation);
  } catch (error) {
    console.warn(error);
    return res.status(500).json({
      errorMessage: 'Could not fetch settings',
    });
  }
};

const setReservationSetttings = async (req, res) => {
  try {
    const { startTime, endTime, buffer, tables } = req.body;

    let reservation = false;
    let table = false;

    if (startTime && endTime && buffer) {
      const startTimeObj = new Date(startTime);
      const endTimeObj = new Date(endTime);
      reservation = await db.setReservationConfig(startTimeObj, endTimeObj, buffer);
    } else {
      reservation = true;
    }
    if (tables) {
      table = await db.setTableConfig(tables);
    } else {
      table = true;
    }

    if (!table || !reservation) {
      return res.status(500).json({
        errorMessage: 'Settings were not properly saved',
      });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.warn(error);
    return res.status(500).json({
      errorMessage: 'Settings were not properly saved',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getReservationSetttings,
  setReservationSetttings,
};
