import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useRegister = () => {
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState('')
    const {dispatch} = useAuthContext()

    const register = async (email, password) => {

        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        const json = await response.json()
        
        if (!response.ok) {
            console.log(json.error)
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok){
            localStorage.setItem('user', JSON.stringify(json))

            dispatch({type: 'LOGIN',payload: json})
            setIsLoading(false)
        }
        
    }
    return {register, isLoading, error}
}