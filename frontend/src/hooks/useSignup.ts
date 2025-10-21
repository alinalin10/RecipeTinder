"use client"
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

interface UseSignupReturn {
    signup: (firstname: string, lastname: string, username: string, email: string, password: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    success: string | null;
    clearError: () => void;
}

export const useSignup = (): UseSignupReturn => {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<string | null>(null)
    const { dispatch } = useAuthContext()

    const clearError = (): void => {
        setError(null)
    }

    const signup = async (
        firstname: string,
        lastname: string,
        username: string,
        email: string,
        password: string
    ): Promise<void> => {
        console.log('Form values:', { firstname, lastname, username, email, password })
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        //------- Requires Valid fields + emails (can be alloc to backend if u prefer) --------
        if (!firstname || !lastname || !username || !email || !password) {
            setError('All fields are required actually')
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
        const response = await fetch('http://localhost:4000/api/user/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstname, lastname, username, email, password })
        })

        const json = await response.json()

        //Response handling
        if (!response.ok) {
            console.log(json.error)
            setError(json.error)
        }

        if (response.ok) {
            setError(null)
            console.log('User Signed Up')
            setSuccess('Signed Up Successfully')

            //save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            //update authcontext
            dispatch({ type: 'LOGIN', payload: json })
        }
        setIsLoading(false)
    }

    return { signup, isLoading, error, success, clearError }
}
