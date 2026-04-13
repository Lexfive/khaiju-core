// ═══════════════════════════════════════════════════════════════
// 🛡️ Safe Data Helpers - Proteção contra null/undefined
// ═══════════════════════════════════════════════════════════════

/**
 * Converte qualquer valor para número seguro
 * @param {*} value - Valor a ser convertido
 * @param {number} fallback - Valor padrão se inválido
 * @returns {number} Número seguro
 */
export const safeNumber = (value, fallback = 0) => {
  const num = Number(value ?? fallback)
  return isNaN(num) ? fallback : num
}

/**
 * Garante que o valor é um array seguro
 * @param {*} value - Valor a ser validado
 * @returns {Array} Array seguro (vazio se inválido)
 */
export const safeArray = (value) => {
  return Array.isArray(value) ? value.filter(Boolean) : []
}

/**
 * Acessa propriedade de objeto com segurança
 * @param {Object} obj - Objeto fonte
 * @param {string} path - Caminho da propriedade (ex: 'user.name')
 * @param {*} fallback - Valor padrão
 * @returns {*} Valor ou fallback
 */
export const safeGet = (obj, path, fallback = null) => {
  try {
    return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? fallback
  } catch {
    return fallback
  }
}

/**
 * Converte para string segura
 * @param {*} value - Valor a ser convertido
 * @param {string} fallback - Valor padrão
 * @returns {string} String segura
 */
export const safeString = (value, fallback = '') => {
  return value?.toString() ?? fallback
}

/**
 * Extrai dados financeiros com segurança
 * @param {Object} kpis - Objeto de KPIs
 * @returns {Object} KPIs seguros
 */
export const safeKpis = (kpis) => {
  if (!kpis || typeof kpis !== 'object') {
    return {
      saldo: 0,
      receitas: 0,
      despesas: 0,
      taxaPoupanca: 0,
    }
  }

  return {
    saldo: safeNumber(kpis.saldo),
    receitas: safeNumber(kpis.receitas),
    despesas: safeNumber(kpis.despesas),
    taxaPoupanca: safeNumber(kpis.taxaPoupanca),
  }
}
