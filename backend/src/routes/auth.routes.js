import { Router } from 'express'
import { protect } from '../middlewares/auth.middleware.js'
import * as ctrl from '../controllers/auth.controller.js'

const router = Router()

// Rotas públicas
router.post('/login', ctrl.login)
router.post('/register', ctrl.register)
router.post('/logout', ctrl.logout)

// Rotas protegidas
router.get('/me', protect, ctrl.me)

export default router
