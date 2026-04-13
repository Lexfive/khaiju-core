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

// ═══════════════════════════════════════════════════════════
// 🔧 VPS Configuration - Trust Proxy
// ═══════════════════════════════════════════════════════════
// Necessário quando rodando atrás de NGINX/Traefik
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
  console.log('🔐 Trust proxy enabled (VPS mode)');
}

// ═══════════════════════════════════════════════════════════
// 🌐 CORS Configuration
// ═══════════════════════════════════════════════════════════
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['*'];

    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);

    // Modo desenvolvimento ou wildcard
    if (allowedOrigins.includes('*')) {
      return callback(null, true);
    }

    // Verificar se origin está na lista permitida
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(express.json());

// ═══════════════════════════════════════════════════════════
// 🏥 Health Check Endpoint
// ═══════════════════════════════════════════════════════════
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'Khaiju API', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ═══════════════════════════════════════════════════════════
// 📡 API Routes
// ═══════════════════════════════════════════════════════════
app.use('/auth', authRoutes);
app.use('/kpis', kpiRoutes);
app.use('/transactions', transactionRoutes);
app.use('/categories', categoryRoutes);
app.use('/accounts', accountRoutes);
app.use('/reports', reportRoutes);

// ═══════════════════════════════════════════════════════════
// ⚠️ Error Handler
// ═══════════════════════════════════════════════════════════
app.use(errorMiddleware);

// ═══════════════════════════════════════════════════════════
// 🚀 Server Start
// ═══════════════════════════════════════════════════════════
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 Khaiju API Server');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📍 Port:        ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database:    ${process.env.DATABASE_URL ? 'PostgreSQL ✅' : 'Not configured ❌'}`);
  console.log(`🔐 CORS Origin: ${process.env.CORS_ORIGIN || 'Not configured (allowing all)'}`);
  console.log(`🔒 Trust Proxy: ${process.env.TRUST_PROXY === 'true' ? 'Enabled ✅' : 'Disabled'}`);
  console.log('═══════════════════════════════════════════════════════════');
});

export { prisma };
