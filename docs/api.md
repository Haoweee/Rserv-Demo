# API Reference

This document outlines the core REST API routes for **Rserv**. All endpoints are prefixed with `/api`.

---

## API Route Overview

> ⚠️ Most endpoints require a valid JWT token via secure cookie.

### Auth Routes

| Method | Endpoint                       | Description                            | Request                                                  | Response                                   | Auth Required         | Rate Limit |
| ------ | ------------------------------ | -------------------------------------- | -------------------------------------------------------- | ------------------------------------------ | --------------------- | ---------- |
| GET    | `/auth/verifyUserToken`        | Checks user session validity           | None                                                     | `{"success": true}`                        | Yes (JWT cookie)      | No         |
| GET    | `/auth/verifyReservationToken` | Checks short-lived reservation token   | None                                                     | `{"success": true}`                        | Yes (resToken cookie) | No         |
| POST   | `/clearResToken`               | Clears reservation token cookie        | None                                                     | `{"success": true}`                        | Yes (resToken cookie) | No         |
| POST   | `/send2FA`                     | Sends 2FA SMS                          | `{"phoneNumber": "1234567890"}`                          | `{"success": true}`                        | No                    | 3 / 10 min |
| POST   | `/validate2FA`                 | Verifies SMS code and issues res token | `{"phoneNumber": "1234567890", "accessCode": "$haowee"}` | `{"success": true}` + sets resToken cookie | No                    | 3 / 10 min |
| POST   | `/register`                    | Registers new user (admin only)        | `{"username": "admin", "password": "pass"}`              | `{"success": true}`                        | Yes (JWT cookie)      | 5 / hour   |
| POST   | `/login`                       | Logs in admin user                     | `{"username": "admin", "password": "pass"}`              | `{"success": true}`                        | No                    | 5 / 15 min |
| POST   | `/logout`                      | Logs out user                          | None                                                     | `{"success": true}`                        | Yes (JWT cookie)      | No         |

---

### Reservation Routes

| Method | Endpoint                | Description                               | Request                                                        | Response                                      | Auth Required         | Rate Limit  |
| ------ | ----------------------- | ----------------------------------------- | -------------------------------------------------------------- | --------------------------------------------- | --------------------- | ----------- |
| GET    | `/getAvailability`      | Fetches available reservation slots       | `/getAvailability?seats=2&date=2025-06-12T19:00:00.000Z`       | `{"2025-06-12T19:00": [{"tableID": 1, ...}]}` | Yes (resToken cookie) | Optional    |
| POST   | `/selectReservation`    | Picks time/table for reservation          | `{"phoneNumber": "123...", "numGuests": 2, "datetime": "..."}` | `{"success": true, "client_secret": "..."}`   | Yes (resToken cookie) | No          |
| POST   | `/placeReservationHold` | Places temporary hold on table            | `{"phoneNumber": "1234567890"}`                                | `{"success": true}`                           | Yes (resToken cookie) | 10 / 15 min |
| POST   | `/processReservation`   | Finalizes reservation and triggers Stripe | `{"phoneNumber": "1234567890"}`                                | `{"success": true}`                           | Yes (resToken cookie) | 5 / 15 min  |

---

### Admin Routes

| Method | Endpoint                   | Description                        | Request                     | Response            | Auth Required    | Rate Limit |
| ------ | -------------------------- | ---------------------------------- | --------------------------- | ------------------- | ---------------- | ---------- |
| GET    | `/getReservationSetttings` | Returns admin reservation settings | None                        | JSON config object  | Yes (JWT cookie) | No         |
| POST   | `/setReservationSetttings` | Updates admin reservation settings | `{"startTime": "...", ...}` | `{"success": true}` | Yes (JWT cookie) | No         |

## Error Format

All errors follow a consistent structure:

`{
"success": false,
"message": "Too many login attempts. Please try again later."
}`

- Rate-limited routes return HTTP status `429`
- Unauthorized access returns `401`
- Validation or token issues return `400` or `403`

---

## Required Headers

Most requests use secure cookies (`HttpOnly`, `SameSite=Lax`), but here’s what you need to know:

- No `Authorization: Bearer` headers required
- JWTs and reservation tokens are stored in:
  - `resToken` cookie (for public reservation routes)
  - `authToken` cookie (for admin routes)
- Cookies must be sent with each request:
  - `credentials: 'include'` for fetch or axios

---

## External Integrations

This app integrates the following third-party services:

| Service  | Purpose                               | Used In                        |
| -------- | ------------------------------------- | ------------------------------ |
| Stripe   | Handles payments                      | `/processReservation`          |
| Twilio   | Sends 2FA SMS codes                   | `/send2FA`, `/validate2FA`     |
| Telegram | Sends admin reservation notifications | Internal cron and admin alerts |

## Notes

- Admin routes are **not visible in the customer interface**
- Reservation tokens are valid for a limited time (typically 10–30 min)
- Telegram and Twilio integrations are **disabled in demo mode**
- Stripe operates in a **sandbox mode** in demo environments
- All time values are in **UTC** unless otherwise specified
