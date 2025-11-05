"use client"
import {useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const {dispatch} = useAuthContext()

    const clearError = () => {
        setError(null)
    }

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        //------- Requires Valid fields + emails (can be alloc to backend if u prefer) --------
        if (!email || !password) {
            setError('All fields are required');
            return;
        }

        const emailPattern = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        //--------------------------------------------------------------------------------------

        // API Call to backend
        const response = await fetch('http://localhost:4000/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email,password})
        })  

        const json = await response.json()

        //Response handling
        setIsLoading(false);
        if (!response.ok) {
            console.log(json.error);
            setError(json.error);
        }

        if (response.ok)
        {
            setError(null);
            console.log('User Logged in');
            setSuccess('Logged In Successfully');

            //save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))
            localStorage.setItem('token', json.token)

            //update authcontext
            dispatch({type: 'LOGIN', payload: json})
        }
    }

    return {login, isLoading, error, success, clearError}
}