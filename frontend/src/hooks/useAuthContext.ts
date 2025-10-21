"use client"
import { AuthContext, AuthContextValue } from '../context/AuthContext'
import { useContext } from 'react'

export const useAuthContext = (): AuthContextValue => {
    const context = useContext(AuthContext)

    if (!context) {
        throw Error('useAuthContext must be used inside a AuthContextProvider')
    }

    return context
}
