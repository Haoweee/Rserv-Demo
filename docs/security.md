# Security Practices

This document outlines the key security mechanisms implemented in **Rserv**, a monolithic reservation system, to protect user data, prevent abuse, and ensure secure communication.

---

## Authentication & Sessions

- Authentication is handled using **JWTs**, stored in **HTTP-only, secure cookies**.
- JWT cookies are configured with:
  - `HttpOnly: true` – inaccessible to JavaScript
  - `Secure: true` – only transmitted over HTTPS
  - `SameSite: 'Lax'` – protects against CSRF while preserving usability
  - `expires` – explicitly defined based on token type and purpose
- JWTs are used for both:
  - **Customer reservation flows**
  - **Admin portal access**

---

## Rate Limiting

Sensitive endpoints are protected from abuse using [`express-rate-limit`](https://www.npmjs.com/package/express-rate-limit).

### Rate Limiter Configuration

```js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
  },
});
```

### Rate Limits Applied

| Endpoint                        | Limit             | Purpose                       |
| ------------------------------- | ----------------- | ----------------------------- |
| `POST /register`                | 5 per hour        | Prevent spam account creation |
| `POST /login`                   | 5 per 15 minutes  | Block brute-force attacks     |
| `POST /send2FA` / `validate2FA` | 3 per 10 minutes  | Throttle verification abuse   |
| `POST /placeReservationHold`    | 10 per 15 minutes | Prevent reservation spam      |
| `POST /processReservation`      | 5 per 15 minutes  | Prevent repeated submissions  |

- All rate limiter logic is centralized in `middleware/rate-limiter.js`
- Middleware is applied per-route in the main router file for clarity and flexibility

---

## Transport Layer Security (HTTPS)

- All HTTP traffic is redirected to **HTTPS** using **NGINX**.
- SSL certificates are managed by **Certbot (Let's Encrypt)** and renew automatically every 90 days.
- NGINX is configured as a reverse proxy that forwards HTTPS requests to the backend Node.js server.

---

## Admin Route Protection

- Admin interface lives under a protected namespace: `/adm/login`
- Admin routes are accessible only to users with valid JWTs
- All admin functionality is separated from the public user interface

---

## Environment Variable Security

- All credentials and API keys (JWT secret, Stripe key, Twilio token, Telegram bot token) are stored in `.env` files.
- `.env` files are listed in `.gitignore` and **never committed to version control**.
- Secrets are injected securely into the runtime environment during deployment.

---

## External Services & Token Handling

| Service          | Use Case                       | Security Notes                              |
| ---------------- | ------------------------------ | ------------------------------------------- |
| **Twilio**       | Sends SMS for 2FA              | API keys stored in `.env`; disabled in demo |
| **Stripe**       | Processes reservation deposits | Webhook verification planned in future      |
| **Telegram Bot** | Sends reservation updates      | Token scoped to bot only; no inbound data   |

All tokens are securely scoped and are only used server-side. No credentials are exposed to the client.

---

## Disabled in Demo

For safety and cost control, the following features are disabled in the public demo:

- Real SMS delivery via Twilio
- Telegram bot notifications
- Stripe live payments

All features are mocked or bypassed where possible to simulate full flows.

---

## Security Testing

- All auth-guarded routes were tested manually for:
  - Unauthorized access attempts
  - Expired or invalid JWTs
  - Cookie misconfigurations
- Rate-limited endpoints were tested for appropriate response codes after threshold breach
