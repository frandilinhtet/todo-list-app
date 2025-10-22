// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const client = require('prom-client');
const todosRouter = require('./routes/todos');
const healthRouter = require('./routes/health');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();

collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests made',
  labelNames: ['method', 'route', 'status']
});
register.registerMetric(httpRequestCounter);

// Middleware to count every request
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});


// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ Could not connect to MongoDB:', err));

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Main Routes
app.use('/api/todos', todosRouter);
app.use('/health', healthRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});