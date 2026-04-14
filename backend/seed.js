import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar usuário de teste
  const hashedPassword = await bcrypt.hash('123456', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@khaiju.com' },
    update: {},
    create: {
      name: 'Admin Khaiju',
      email: 'admin@khaiju.com',
      password: hashedPassword,
    },
  })

  console.log('✅ Usuário criado:', user.email)
  console.log('📧 Email: admin@khaiju.com')
  console.log('🔐 Senha: 123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
