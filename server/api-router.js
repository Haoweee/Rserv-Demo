const express = require('express');
const auth = require('./middleware/auth');
const rateLimiter = require('./middleware/rate-limiter');
const userController = require('./controllers/user-controller');
const reservationController = require('./controllers/reservation-controller');

const router = express.Router();

// Register/Login
router.post(
  '/register',
  rateLimiter.registerLimiter,
  auth.verifyUserToken,
  userController.registerUser
);
router.post('/login', rateLimiter.loginLimiter, userController.loginUser);
router.post('/logout', auth.verifyUserToken, userController.logoutUser);

// Token Auth
router.get('/auth/verifyReservationToken', auth.verifyReservationToken, auth.ping);
router.get('/auth/verifyUserToken', auth.verifyUserToken, auth.ping);

// Reservation functions
router.post('/send2FA', rateLimiter.twoFALimiter, reservationController.send2FA);
router.post('/validate2FA', rateLimiter.twoFALimiter, reservationController.validate2FA);
router.get('/getTodayStatus', auth.verifyReservationToken, reservationController.getTodayStatus);
router.get('/getAvailability', auth.verifyReservationToken, reservationController.getAvailability);
router.post(
  '/selectReservation',
  auth.verifyReservationToken,
  reservationController.selectReservation
);
router.post(
  '/placeReservationHold',
  rateLimiter.reservationHoldLimiter,
  auth.verifyReservationToken,
  reservationController.placeReservationHold
);
router.post(
  '/processReservation',
  rateLimiter.processReservationLimiter,
  auth.verifyReservationToken,
  reservationController.processReservation
);
router.post('/clearResToken', auth.verifyReservationToken, reservationController.clearResToken);

// User functions
router.get(
  '/getReservationSetttings',
  auth.verifyUserToken,
  userController.getReservationSetttings
);
router.post(
  '/setReservationSetttings',
  auth.verifyUserToken,
  userController.setReservationSetttings
);

// router.post("/tester", reservationController.tester)

module.exports = router;
