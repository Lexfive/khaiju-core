-- ════════════════════════════════════════════════════════════
-- Khaiju Database - Initialization Script
-- ════════════════════════════════════════════════════════════

-- Garantir que o banco existe
SELECT 'CREATE DATABASE khaiju_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'khaiju_db')\gexec

-- Conectar ao banco
\c khaiju_db

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Log de inicialização
DO $$
BEGIN
    RAISE NOTICE '✅ Khaiju Database initialized successfully!';
END $$;
