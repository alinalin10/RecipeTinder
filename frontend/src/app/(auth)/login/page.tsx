"use client";

import { useState, FormEvent, useEffect } from 'react'
import { useLogin } from '../../../hooks/useLogin'
import { useRouter } from 'next/navigation'
import Link from "next/link";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, isLoading, success, clearError } = useLogin()
    const router = useRouter()

    // Navigate only when success is true
    useEffect(() => {
        if (success && !error) {
            router.push('/')
        }
    }, [success, error, router])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await login(email, password)
    }

    // Redirect to main page after successful login
    useEffect(() => {
        if (success) {
            setTimeout(() => {
                router.push('/')
            }, 1000) // Small delay to show success message
        }
    }, [success, router])

    return (
        <div className="min-h-screen h-screen flex bg-white overflow-hidden -mt-4">
            {/* Left: Form */}
            <div className="flex-1 flex items-center justify-center p-8 pt-4 -mt-8">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        Get Started Now
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2.5 border border-gray-800 hover:border-red-500 rounded-lg outline-none transition-all placeholder-gray-400 text-gray-800"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    clearError();
                                }}
                                value={email}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-2.5 border border-gray-800 hover:border-red-500 rounded-lg outline-none transition-all placeholder-gray-400 text-gray-800"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearError();
                                }}
                                value={password}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] disabled:bg-[#fca5a5] disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
                        >
                            {isLoading ? 'Authorizing...' : 'Login'}
                        </button>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                                {success}
                            </div>
                        )}
                    </form>

                    {/* Sign up link */}
                    <div className="text-center mt-5">
                        <span className="text-gray-600">Don&apos;t have an account? </span>
                        <Link href="/signup" className="text-[#ff6b6b] hover:text-[#ff5252] font-medium transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right: Image */}
            <div className="flex-1 hidden md:flex justify-center items-center p-8 pt-4 -mt-8">
                <img 
                    src="/Dish.png"
                    className="h-[76.5vh] w-auto rounded-l-[36px] shadow-lg object-cover"
                    alt="Portal"
                />
            </div>
        </div>
    )
}

export default Login