// ─── KHAIJU FORMAT UTILITIES ──────────────────────────────────────────

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

const BRL_COMPACT = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const DATE_SHORT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const DATE_LONG = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const DATE_MONTH_YEAR = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: 'numeric',
})

const PERCENT = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export const currency = (value) => BRL.format(value ?? 0)
export const currencyCompact = (value) => BRL_COMPACT.format(value ?? 0)
export const dateShort = (date) => DATE_SHORT.format(new Date(date))
export const dateLong = (date) => DATE_LONG.format(new Date(date))
export const dateMonthYear = (date) => DATE_MONTH_YEAR.format(new Date(date))
export const percent = (value) => PERCENT.format((value ?? 0) / 100)
export const percentRaw = (value) => PERCENT.format(value ?? 0)

export const delta = (value) => {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value?.toFixed(1)}%`
}

export const truncate = (str, len = 32) =>
  str?.length > len ? str.slice(0, len) + '…' : str
