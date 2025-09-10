// routes/health.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState;

  if (dbStatus === 1) {
    res.status(200).json({
      status: 'OK',
      database: 'Connected',
    });
  } else {
    res.status(503).json({
      status: 'Service Unavailable',
      database: 'Disconnected',
    });
  }
});

module.exports = router;