"use client"
import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext()

    const logout = () => {
        if (typeof window !== 'undefined') localStorage.removeItem('user')
        dispatch({ type: 'LOGOUT' })
    }

    return { logout }
}
