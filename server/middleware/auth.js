require('dotenv').config();

const jwt = require('jsonwebtoken');

const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;

// AUTH MIDDLEWARE

const signUserToken = (emailAddress, userId) => {
  return jwt.sign(
    {
      emailAddress,
      userId,
      expiration: Date.now() + MILLIS_PER_DAY * 30,
    },
    process.env.JWT_SECRET
  );
};

const verifyUserToken = (req, res, next) => {
  try {
    console.log('Cookies:', req.cookies); // Log cookies
    const token = req.cookies.userToken;

    if (!token) {
      console.error('No token found in cookies.');
      throw new Error();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Verified Token:', verified);

    if (!verified.expiration || verified.expiration < Date.now()) {
      console.error('Token is expired.');
      throw new Error();
    }

    req.emailAddress = verified.emailAddress;
    req.userId = verified.userId;

    next();
  } catch (error) {
    console.error('Authorization error:', error.message);
    return res.status(401).json({
      errorMessage: 'Unauthorized',
    });
  }
};

const signReservationToken = (phoneNumber, expiration) => {
  return jwt.sign(
    {
      phoneNumber,
      expiration,
    },
    process.env.JWT_SECRET
  );
};

const verifyReservationToken = (req, res, next) => {
  try {
    console.log('cookie: ', req.cookies);
    const token = req.cookies.resToken;

    // console.log(token)
    if (!token) throw new Error();

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified.expiration || verified.expiration < Date.now()) throw new Error();

    req.body.phoneNumber = verified.phoneNumber;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      errorMessage: 'Unauthorized',
    });
  }
};

const ping = async (req, res) => {
  return res.status(200).json({
    success: true,
  });
};

module.exports = {
  signUserToken,
  signReservationToken,
  verifyUserToken,
  verifyReservationToken,
  ping,
};
