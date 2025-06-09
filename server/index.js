require('dotenv').config();
const express = require('express');
const cookies = require('cookie-parser');
const routes = require('./api-router');
const cors = require('cors');

const app = express();

let corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

if (process.env.NODE_ENV === 'production') {
  const allowedOrigins = ['https://rserv.haowee.me', 'https://www.rserv.haowee.me'];
  corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookies());
app.use('/api', routes);

module.exports = app;
