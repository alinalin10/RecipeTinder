"use client"
import { createContext, useReducer, useEffect, ReactNode, Dispatch } from 'react'

// Define the shape of the user object
export interface User {
    email: string;
    token: string;
    // Add other user properties as needed
}

// Define the shape of the auth state
export interface AuthState {
    user: User | null;
}

// Define the shape of auth actions
export type AuthAction =
    | { type: 'LOGIN'; payload: User }
    | { type: 'LOGOUT' }

// Define the context value type
export interface AuthContextValue extends AuthState {
    dispatch: Dispatch<AuthAction>;
}

// Create context with proper typing
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Reducer with proper typing
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null }
        default:
            return state
    }
}

// Provider props interface
interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
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
