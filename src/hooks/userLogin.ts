// src/hooks/useLogin.ts
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth.api'
import { useAuthStore } from '../stores/auth.store'
import type { LoginForm } from '../types/api.types'

export function useLogin() {
  const navigate = useNavigate()
  const loginUser = useAuthStore((s) => s.login)

  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  async function onSubmit(form : LoginForm) {
    setIsLoading(true)
    setServerError(null)

    try {

      const payload = {
        email : form.email,
        password : form.password
      }

      const res = await login(payload)
      
      loginUser(res)

      // RememberMe handle
      if (form.rememberMe) {
        localStorage.setItem('rememberedEmail', form.email)
      }

      navigate('/')

    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return { onSubmit, isLoading, serverError }
}