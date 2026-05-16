import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue } from 'motion/react'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Interaction state
  const [isOn, setIsOn] = useState(false)

  const handleDragEnd = (event, info) => {
    // If pulled down far enough, toggle the light on/off
    if (info.offset.y > 30) {
      setIsOn(prev => !prev)
    }
  }

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
    <div className="min-h-screen bg-[#111111] flex items-center justify-center overflow-hidden relative">
      {/* Background ambient light when ON */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: isOn 
            ? 'radial-gradient(circle at 35% 40%, rgba(255, 230, 150, 0.08) 0%, rgba(17, 17, 17, 0) 60%)' 
            : 'radial-gradient(circle at 35% 40%, rgba(255, 230, 150, 0) 0%, rgba(17, 17, 17, 0) 60%)'
        }}
        transition={{ duration: 1 }}
      />

      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center px-4 gap-8 relative z-10">
        
        {/* Left Side: Interactive Lamp */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center h-[500px] relative">
          
          {/* Light Cone */}
          <motion.div 
            className="absolute top-[160px] w-[350px] h-[340px] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isOn ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 240, 200, 0.4) 0%, rgba(255, 240, 200, 0) 100%)',
              clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0% 100%)',
              filter: 'blur(15px)'
            }}
          />

          <div className="relative z-10 flex flex-col items-center translate-y-[-50px]">
            {/* Lamp Shade */}
            <motion.div 
              className="w-56 h-24 rounded-t-full relative z-20"
              style={{ backgroundColor: '#F9F9F5' }}
              animate={{
                boxShadow: isOn 
                  ? '0 10px 40px rgba(255, 240, 180, 0.9), inset 0 -5px 15px rgba(255, 255, 255, 0.9)' 
                  : '0 10px 20px rgba(0,0,0,0.5), inset 0 -5px 15px rgba(0,0,0,0.1)'
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Inner glow under the shade */}
              <motion.div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-4 bg-white rounded-full"
                animate={{ opacity: isOn ? 1 : 0, filter: 'blur(4px)' }}
              />
            </motion.div>
            
            {/* Lamp Stand */}
            <div className="relative w-full flex justify-center">
              {/* The Central Pole */}
              <div className="w-5 h-56 bg-[#D8D8D2] relative z-10 shadow-[inset_2px_0_4px_rgba(0,0,0,0.1)]" />
              
              {/* Pull Cord */}
              <motion.div 
                className="absolute left-[65%] top-0 w-[2px] bg-zinc-500 origin-top cursor-grab active:cursor-grabbing z-0"
                style={{ height: 140 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 60 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                animate={!isOn ? { y: [0, 8, 0] } : { y: 0 }}
                transition={!isOn ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" } : { type: "spring", bounce: 0.5 }}
              >
                {/* Pull Bead/Handle */}
                <div className="absolute -left-2 -bottom-2 w-4 h-4 rounded-full bg-[#E6C875] shadow-md border border-[#C5A059]" />
              </motion.div>
            </div>
            
            {/* Lamp Base */}
            <div className="w-40 h-5 bg-[#D8D8D2] rounded-full shadow-lg relative z-10" />
          </div>

          {/* Helper Text */}
          {!isOn && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute bottom-10 text-zinc-500 text-xs font-bold tracking-[0.3em] uppercase pointer-events-none"
            >
              Pull to Login
            </motion.p>
          )}
        </div>

        {/* Right Side: Glassmorphism Login Card */}
        <div className="w-full md:w-1/2 flex justify-center items-center h-[500px]">
          <AnimatePresence>
            {isOn && (
              <motion.div
                initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                className="w-full max-w-sm p-10 rounded-[2rem] relative overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Subtle light reflection on the card itself */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center mb-10 relative z-10">
                  <h1 className="text-2xl font-semibold tracking-wide text-white mb-2">Welcome</h1>
                  <p className="text-zinc-400 text-[10px] tracking-widest uppercase">Admin Access</p>
                </div>
                
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center rounded-xl relative z-10">
                    {error}
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10 mt-8">
                  <div className="relative">
                    <input 
                      id="email"
                      type="email" 
                      required 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="peer w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none transition-colors duration-300 focus:border-[#D4AF37]" 
                      placeholder=" "
                    />
                    <label 
                      htmlFor="email"
                      className="absolute left-4 top-4 px-2 text-zinc-500 text-xs font-medium tracking-[0.2em] uppercase pointer-events-none transition-all duration-300
                                 peer-focus:-top-2 peer-focus:text-[9px] peer-focus:text-[#D4AF37] peer-focus:bg-[#1a1a1a] peer-focus:rounded-full
                                 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-[#D4AF37] peer-[:not(:placeholder-shown)]:bg-[#1a1a1a] peer-[:not(:placeholder-shown)]:rounded-full"
                    >
                      Username
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input 
                      id="password"
                      type="password" 
                      required 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="peer w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none transition-colors duration-300 focus:border-[#D4AF37]" 
                      placeholder=" "
                    />
                    <label 
                      htmlFor="password"
                      className="absolute left-4 top-4 px-2 text-zinc-500 text-xs font-medium tracking-[0.2em] uppercase pointer-events-none transition-all duration-300
                                 peer-focus:-top-2 peer-focus:text-[9px] peer-focus:text-[#D4AF37] peer-focus:bg-[#1a1a1a] peer-focus:rounded-full
                                 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-[#D4AF37] peer-[:not(:placeholder-shown)]:bg-[#1a1a1a] peer-[:not(:placeholder-shown)]:rounded-full"
                    >
                      Password
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full mt-10 py-4 rounded-xl text-black text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                    style={{
                      background: 'linear-gradient(135deg, #F9DF9F 0%, #D4AF37 50%, #B5851F 100%)',
                      boxShadow: '0 8px 25px -5px rgba(212, 175, 55, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)'
                    }}
                  >
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
