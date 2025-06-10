const express = require('express');
const auth = require('./middleware/auth');

const userController = require('./controllers/user-controller');
const reservationController = require('./controllers/reservation-controller');

const router = express.Router();

// Register/Login
router.post('/register', auth.verifyUserToken, userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', auth.verifyUserToken, userController.logoutUser);

// Token Auth
router.get('/auth/verifyReservationToken', auth.verifyReservationToken, auth.ping);
router.get('/auth/verifyUserToken', auth.verifyUserToken, auth.ping);

// Reservation functions
router.post('/send2FA', reservationController.send2FA);
router.post('/validate2FA', reservationController.validate2FA);
router.get('/getTodayStatus', auth.verifyReservationToken, reservationController.getTodayStatus);
router.get('/getAvailability', auth.verifyReservationToken, reservationController.getAvailability);
router.post(
  '/selectReservation',
  auth.verifyReservationToken,
  reservationController.selectReservation
);
router.post(
  '/placeReservationHold',
  auth.verifyReservationToken,
  reservationController.placeReservationHold
);
router.post(
  '/processReservation',
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
