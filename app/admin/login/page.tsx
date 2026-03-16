'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Zap, Shield, Lock } from 'lucide-react'
import { useAdminStore } from '@/store/admin-store'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const login = useAdminStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const success = login(email, password)
    setLoading(false)
    if (success) {
      toast.success('Welcome back, Admin!')
      router.push('/admin')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-slate-900" />
          </div>
          <h1 className="text-white text-2xl font-bold">NovaMobile Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to the dashboard</p>
        </div>

        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@novamobile.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm bg-red-500/10 rounded-xl px-3 py-2 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />{error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-white/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : <Shield className="w-4 h-4" />}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 bg-slate-800/50 rounded-xl p-3 border border-slate-700">
            <p className="text-xs text-slate-400 font-semibold mb-1">Demo Credentials</p>
            <p className="text-xs text-slate-400">Email: <code className="text-slate-300">admin@novamobile.com</code></p>
            <p className="text-xs text-slate-400">Password: <code className="text-slate-300">admin123</code></p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
