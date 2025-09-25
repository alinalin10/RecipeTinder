import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'

export const useAuthContext = () => 
{
    const context = useContext (AuthContext)

    if (!contest)
    {
        throw Error ('useAuthContext must be used inside a AuthContextProvider')
    }

    return context
}