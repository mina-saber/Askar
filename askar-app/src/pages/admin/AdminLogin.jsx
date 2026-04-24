import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-admin-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-[0.2em]">ASKAR</h1>
          <p className="text-gray-400 text-xs tracking-wider mt-2">ADMIN DASHBOARD</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-wider mb-2">EMAIL</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="admin-input" placeholder="admin@askar.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-wider mb-2">PASSWORD</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="admin-input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full admin-btn py-3">{loading ? 'SIGNING IN...' : 'LOGIN'}</button>
        </form>
      </div>
    </div>
  )
}
