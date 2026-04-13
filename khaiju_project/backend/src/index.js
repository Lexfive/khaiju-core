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

app.use('/auth', authRoutes);
app.use('/kpis', kpiRoutes);
app.use('/transactions', transactionRoutes);
app.use('/categories', categoryRoutes);
app.use('/accounts', accountRoutes);
app.use('/reports', reportRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Khaiju API rodando em http://localhost:${PORT}`));

export { prisma };