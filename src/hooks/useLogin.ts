import { useState } from 'react'

interface LoginPayload {
  email: string
  password: string
}

interface AuthData {
  accessToken: string
  refreshToken: string
  tokenType: string
  roleName: string
  managerId: string
  orgnizationId: string
}

interface LoginResponse {
  code: string
  status: string
  description: string
  data: AuthData
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (payload: LoginPayload): Promise<LoginResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        'https://peakily-idioplasmatic-kimbra.ngrok-free.dev/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true', // ← required for ngrok URLs
          },
          body: JSON.stringify({
            usernameOrEmail: payload.email, // adjust key if backend expects 'username'
            password: payload.password,
          }),
        }
      )

      const data: LoginResponse = await response.json()

      if (!response.ok || data.status !== 'Success') {
        throw new Error(data.description ?? 'Login failed')
      }

      // ─── Store in localStorage ───────────────────────────────
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      localStorage.setItem('tokenType', data.data.tokenType)
      localStorage.setItem('roleName', data.data.roleName)
      localStorage.setItem('managerId', data.data.managerId)
      localStorage.setItem('orgnizationId', data.data.orgnizationId)
      // or store the whole auth object at once:
      localStorage.setItem('auth', JSON.stringify(data.data))
      // ─────────────────────────────────────────────────────────

      return data

    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { onSubmit, isLoading, error }
}