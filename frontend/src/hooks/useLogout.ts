"use client"
import { useAuthContext } from "./useAuthContext"

interface UseLogoutReturn {
    logout: () => void;
}

export const useLogout = (): UseLogoutReturn => {
    const { dispatch } = useAuthContext()

    const logout = (): void => {
        if (typeof window !== 'undefined') localStorage.removeItem('user')
        dispatch({ type: 'LOGOUT' })
    }

    return { logout }
}
