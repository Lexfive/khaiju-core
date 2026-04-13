import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes.js';
import kpiRoutes from './routes/kpi.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import categoryRoutes from './routes/category.routes.js';
import accountRoutes from './routes/account.routes.js';
import reportRoutes from './routes/report.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint para Docker
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'Khaiju API', 
    timestamp: new Date().toISOString() 
  });
});

app.use('/auth', authRoutes);
app.use('/kpis', kpiRoutes);
app.use('/transactions', transactionRoutes);
app.use('/categories', categoryRoutes);
app.use('/accounts', accountRoutes);
app.use('/reports', reportRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Khaiju API rodando em http://localhost:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'PostgreSQL conectado' : 'Aguardando configuração'}`);
});

export { prisma };
