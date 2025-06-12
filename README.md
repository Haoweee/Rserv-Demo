# Rserv

![Rserv Homepage](./assets/rserv_homepage.png)

A full-stack reservation system demo built with modern web technologies. This project simulates a restaurant booking flow with operational settings, table management, and optional payment integration using Stripe.

> ⚠️ **Disclaimer**  
> This demo has been stripped of all proprietary business logic, client-specific features, data, and branding. It is intended purely for educational and portfolio purposes.

---

## Live Demo

- **Customer Interface**: [rserv.haowee.me](https://rserv.haowee.me/)
- **Admin Portal**: [rserv.haowee.me/adm/login](https://rserv.haowee.me/adm/login)

| Demo Credentials | Phone Number/Email | Password |
| ---------------- | ------------------ | -------- |
| Customer Login   | +1 (123) 456-7890  | $haowee  |
| Admin Portal     | test@example.com   | 12345678 |

> See below for full reservation flow (with Stripe's sandbox mode's credit card details)

## Reservation Flow Overview

1. **Phone Number Verification**  
   Users enter their phone number to receive a 2FA code.  
   _(Note: Twilio SMS is mocked/disabled in demo mode)_

2. **2FA Code Validation**  
   The access code grants a short-lived session token (`resToken`) stored as a secure, HTTP-only cookie.

3. **Select Reservation Details**  
   Users choose:

   - Date and time
   - Number of guests
   - Occasion or special notes  
     Availability is calculated based on live table configuration and capacity.

4. **Stripe Payment (Test Mode)**  
    A $100 hold is simulated using Stripe’s sandbox environment.  
    Use the following test card credentials:

   ```
   Card Number: 4242 4242 4242 4242
   Expiry: 12/34 (or any future date)
   CVC: 123 (any 3 numbers)
   ```

5. **Table Hold & Confirmation**
   A temporary hold is placed on the selected table.
   Once payment is confirmed, the reservation is finalized and stored in the database.

6. **Admin & Staff Notifications**
   In production, Telegram would notify staff of new reservations.
   _(Disabled in demo mode)_

---

## Features

- React + TypeScript frontend
- Node.js backend (JavaScript)
- Modular architecture for client and server
- Date/time selection and availability checks
- RESTful API (`/api/reservations`, `/api/settings`, etc.)
- Rate limiting for login, registration, and reservation actions
- Twilio integration for phone number verification during login & reservation flow
- Stripe integration for reservation deposits (test mode)
- Telegram integration for daily reservation notifications to staff
- Basic validation and error handling

---

## Notifications & Verification

The system integrates with:

- **Telegram Bot API**
  Sends real-time notifications to restaurant staff about:

  - New reservations
  - Daily reservation summaries

- **Twilio API**
  Sends SMS verification codes to customers to:
  - Confirm phone numbers before completing a reservation
  - Reduce spam or invalid bookings

Both services are securely configured using environment variables (e.g., API keys, chat IDs).
_**However for this demo it is not available**_

---

## Tech Stack

| Layer         | Technologies                                 |
| ------------- | -------------------------------------------- |
| Frontend      | React, TypeScript, TailwindCSS               |
| Backend       | Node.js, Express                             |
| Database      | MySQL                                        |
| Payments      | Stripe API (test mode only)                  |
| Notifications | Telegram Bot API                             |
| Dev Tools     | ESLint, Prettier, GitHub Actions (CI), PM2   |
| Deployment    | SSH-accessible Linux Droplet (manual deploy) |

---

## Local Development

```bash
# 1. Clone the repo
git clone https://github.com/Haoweee/Rserv-Demo.git && cd Rserv-Demo

# 2. Install dependencies
npm install
npm run install-all  # Installs dependencies for both /client and /server

# 3. Create .env files using the .env.template in both client/ and server/

# 4. Initialize the database
# (Make sure MySQL is running and import the schema)
mysql -u your_user -p your_password < server/restaurant.sql

# 5. Start the dev environment
npm run dev  # Starts both frontend and backend concurrently
```

## Additional Documentation

- [System Architecture](./docs/architecture.md)
- [API Reference](./docs/api.md)
- [Security Practices](./docs/security.md)
- [Infrastructure & Deployment Guide](./docs/infra.md)
