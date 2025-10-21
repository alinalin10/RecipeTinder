"use client"
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

interface UseLoginReturn {
    login: (email: string, password: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    success: string | null;
    clearError: () => void;
}

export const useLogin = (): UseLoginReturn => {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { dispatch } = useAuthContext()

    const clearError = (): void => {
        setError(null)
    }

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        //------- Requires Valid fields + emails (can be alloc to backend if u prefer) --------
        if (!email || !password) {
            setError('All fields are required')
            setIsLoading(false)
            return
        }

        const emailPattern = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address')
            setIsLoading(false)
            return
        }
        //--------------------------------------------------------------------------------------

        // API Call to backend
        const response = await fetch('http://localhost:4000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const json = await response.json()

        //Response handling
        setIsLoading(false)
        if (!response.ok) {
            console.log(json.error)
            setError(json.error)
        }

        if (response.ok) {
            setError(null)
            console.log('User Logged in')
            setSuccess('Logged In Successfully')

            //save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            //update authcontext
            dispatch({ type: 'LOGIN', payload: json })
        }
    }

    return { login, isLoading, error, success, clearError }
}
