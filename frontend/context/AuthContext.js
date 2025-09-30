"use client"
import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null })

    useEffect(() => {
        // guard for SSR: only access localStorage on the client
        if (typeof window === 'undefined') return
        try {
            const json = localStorage.getItem('user')
            const user = json ? JSON.parse(json) : null
            if (user) dispatch({ type: 'LOGIN', payload: user })
        } catch (e) {
            // ignore parse errors
        }
    }, [])

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}