import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';
import ApiError from '../utils/ApiError.js';

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'Credenciais inválidas', 'INVALID_CREDENTIALS');
  }
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
};

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { name, email, password: hashed } });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
};