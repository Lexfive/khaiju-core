import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../index.js'
import ApiError from '../utils/ApiError.js'

// ═══════════════════════════════════════════════════════════════
// 🔐 Auth Controller - Login e Registro com httpOnly Cookies
// ═══════════════════════════════════════════════════════════════

const JWT_COOKIE_NAME = 'khaiju_token'
const JWT_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
}

/**
 * Login - Autenticação de usuário
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validação básica
    if (!email || !password) {
      throw new ApiError(400, 'Email e senha são obrigatórios', 'MISSING_CREDENTIALS')
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({ where: { email } })
    
    if (!user) {
      throw new ApiError(401, 'Credenciais inválidas', 'INVALID_CREDENTIALS')
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      throw new ApiError(401, 'Credenciais inválidas', 'INVALID_CREDENTIALS')
    }

    // Gerar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Setar cookie httpOnly
    res.cookie(JWT_COOKIE_NAME, token, JWT_OPTIONS)

    // Retornar dados do usuário (sem senha)
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Register - Registro de novo usuário
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Validação básica
    if (!name || !email || !password) {
      throw new ApiError(400, 'Nome, email e senha são obrigatórios', 'MISSING_FIELDS')
    }

    if (password.length < 6) {
      throw new ApiError(400, 'Senha deve ter no mínimo 6 caracteres', 'PASSWORD_TOO_SHORT')
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } })
    
    if (existingUser) {
      throw new ApiError(409, 'Email já cadastrado', 'EMAIL_ALREADY_EXISTS')
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Gerar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Setar cookie httpOnly
    res.cookie(JWT_COOKIE_NAME, token, JWT_OPTIONS)

    // Retornar dados do usuário
    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Me - Retorna usuário autenticado atual
 * GET /api/auth/me
 */
export const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new ApiError(404, 'Usuário não encontrado', 'USER_NOT_FOUND')
    }

    res.json({ user })
  } catch (error) {
    next(error)
  }
}

/**
 * Logout - Remove cookie de autenticação
 * POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    res.clearCookie(JWT_COOKIE_NAME, JWT_OPTIONS)
    res.json({ success: true, message: 'Logout realizado com sucesso' })
  } catch (error) {
    next(error)
  }
}
