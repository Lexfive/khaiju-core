import jwt from 'jsonwebtoken'
import ApiError from '../utils/ApiError.js'

// ═══════════════════════════════════════════════════════════════
// 🔐 Auth Middleware - Proteção de Rotas com httpOnly Cookie
// ═══════════════════════════════════════════════════════════════

const JWT_COOKIE_NAME = 'khaiju_token'

/**
 * Middleware de proteção - Verifica autenticação via httpOnly cookie
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const protect = (req, res, next) => {
  try {
    // Tentar pegar token do cookie
    const token = req.cookies?.[JWT_COOKIE_NAME]

    if (!token) {
      throw new ApiError(401, 'Não autenticado. Faça login para continuar.', 'UNAUTHORIZED')
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Adicionar dados do usuário na requisição
    req.user = {
      id: decoded.id,
      email: decoded.email,
    }

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Token inválido', 'INVALID_TOKEN'))
    }
    
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Sessão expirada. Faça login novamente.', 'TOKEN_EXPIRED'))
    }

    next(error)
  }
}

/**
 * Middleware opcional - Permite acesso mesmo sem autenticação
 * mas adiciona req.user se estiver autenticado
 */
export const optionalAuth = (req, res, next) => {
  const token = req.cookies?.[JWT_COOKIE_NAME]

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = {
        id: decoded.id,
        email: decoded.email,
      }
    } catch (error) {
      // Ignora erros silenciosamente (auth opcional)
    }
  }

  next()
}
