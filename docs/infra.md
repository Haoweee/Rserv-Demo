# Infrastructure & Deployment

This document describes how the **Rserv** project is deployed and maintained in a production environment.

---

## Hosting Environment

| Layer         | Provider     | Details                         |
| ------------- | ------------ | ------------------------------- |
| App Server    | DigitalOcean | Ubuntu 22.04 Droplet            |
| Reverse Proxy | NGINX        | SSL via Let's Encrypt (Certbot) |
| DB            | MySQL        | Local to Droplet                |
| SSL           | Certbot      | Auto-renewed every 90 days      |
| Process Mgmt  | PM2          | Keeps Node.js backend running   |

---

## Domain & SSL

- Domain registered and managed via DigitalOcean DNS
- NGINX is used as a reverse proxy to forward HTTPS traffic to the Node.js backend
- SSL certs managed by Certbot (Let's Encrypt), renewed automatically

---

## CI/CD Pipeline (GitHub Actions)

Rserv uses **GitHub Actions** for continuous integration and deployment.

### Triggers

- Runs on:
  - Push to `main`
  - Pull requests targeting `main`

### Steps

| Step                  | Description                                |
| --------------------- | ------------------------------------------ |
| `checkout`            | Clones the latest code                     |
| `setup-node`          | Sets up Node.js 18 with dependency caching |
| `npm ci`              | Installs root, client, and server deps     |
| `eslint` / `prettier` | Enforces linting and code style            |
| `type-check`          | Validates types in the client              |
| `npm audit`           | Runs a non-blocking audit                  |
| `npm run build`       | Builds the frontend app                    |
| `ssh-action`          | SSH into droplet to deploy changes         |

### SSH Deployment Details

```yaml
- name: Deploy to Production Server
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USER }}
    key: ${{ secrets.SSH_KEY }}
    script: |
      cd /var/www/your-app
      git pull origin main
      npm install
      npm install --prefix server
      npm install --prefix client
      npm run build --prefix client
      pm2 restart all
```
