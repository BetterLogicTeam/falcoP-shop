'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Shield, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('admin-login', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error, {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
          },
        })
      } else {
        toast.success('Login successful! Welcome to Admin Panel', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
          },
        })
        // Use window.location for full page reload to ensure session is updated
        window.location.href = '/admin'
      }
    } catch (error) {
      toast.error('Login failed. Please try again.', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-falco-accent/5 via-transparent to-falco-gold/5"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-falco-accent to-falco-gold rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-300">Access the Falco Peak Admin Panel</p>
        </div>

        {/* Login Form */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-falco-accent focus:border-transparent transition-all duration-300"
                  placeholder="admin@falcop.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-200 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-falco-accent focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-falco-accent to-falco-gold text-black py-3 rounded-xl font-bold text-lg hover:from-falco-gold hover:to-falco-accent transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
            <h3 className="text-blue-300 font-semibold mb-2">Demo Credentials:</h3>
            <div className="text-sm text-blue-200 space-y-1">
              <p><strong>Email:</strong> admin@falcop.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Website</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
