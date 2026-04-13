// ─── API CLIENT ───────────────────────────────────────────────────────
// Cliente HTTP para comunicação com backend Khaiju
// ─────────────────────────────────────────────────────────────────────

const API_BASE_URL = '/api'

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // ✅ Security: Use httpOnly cookies instead of localStorage
      ...options,
    }

    // NOTE: Token authentication now handled via httpOnly cookies
    // This protects against XSS attacks as cookies are not accessible via JavaScript
    // Backend should set: res.cookie('token', jwt, { httpOnly: true, secure: true, sameSite: 'strict' })

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error.message)
      throw error
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
