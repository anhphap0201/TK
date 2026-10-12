import express from 'express';
import cors from 'cors';
import { initDatabase } from './db.js';
import { authRouter } from './routes/auth.js';
import { customersRouter } from './routes/customers.js';
import { readingsRouter } from './routes/readings.js';
import { paymentRouter } from './routes/payment.js';
import { tariffsRouter } from './routes/tariffs.js';
import { backupRouter } from './routes/backup.js';

initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Tra Cứu Tiền Điện EVN', time: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/customers', customersRouter);
app.use('/api/readings', readingsRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/tariffs', tariffsRouter);
app.use('/api/backup', backupRouter);

app.listen(PORT, () => {
  console.log(`Backend Tra Cứu Tiền Điện running on http://localhost:${PORT}`);
});
