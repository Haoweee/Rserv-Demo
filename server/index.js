require('dotenv').config();
const express = require('express');
const cookies = require('cookie-parser');
const routes = require('./api-router');

// DEVELOPMENT ONLY: Enable CORS for all origins
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookies());

// DEVELOPMENT ONLY: Enable CORS for all origins
app.use(cors(corsOptions));

app.use('/api', routes);

module.exports = app;
