import { useState } from 'react'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth, googleProvider } from '../../firebase'
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleGoogle = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      toast.success('Welcome!')
    } catch (err) {
      toast.error(err.message || 'Google sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailAuth = async () => {
    if (!email || !password) return toast.error('Please fill in all fields')
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!')
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email already in use',
        'auth/invalid-email': 'Invalid email address',
      }
      toast.error(messages[err.code] || err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', backgroundColor: '#13131f',
    border: '1px solid #1e1e2e', borderRadius: '10px',
    padding: '11px 14px 11px 40px', color: '#e2e8f0',
    fontSize: '14px', outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box', transition: 'border-color 0.15s',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', backgroundColor: '#0a0a0f',
      padding: '20px',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, #3730a320 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '420px',
        backgroundColor: '#0f0f17',
        border: '1px solid #1e1e2e',
        borderRadius: '20px',
        padding: '36px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 6px' }}>
            RAG Knowledge Assistant
          </h1>
          <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
            {mode === 'login' ? 'Sign in to your knowledge base' : 'Create your knowledge base'}
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '10px',
            backgroundColor: '#13131f', border: '1px solid #1e1e2e',
            borderRadius: '10px', padding: '12px',
            fontSize: '14px', fontWeight: '500', color: '#e2e8f0',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s', marginBottom: '20px',
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#3730a3'
            e.currentTarget.style.backgroundColor = '#1e1b4b20'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#1e1e2e'
            e.currentTarget.style.backgroundColor = '#13131f'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#1e1e2e' }} />
          <span style={{ fontSize: '12px', color: '#475569' }}>or continue with email</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#1e1e2e' }} />
        </div>

        {/* Email Input */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Mail size={15} color="#475569" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#3730a3'}
            onBlur={e => e.target.style.borderColor = '#1e1e2e'}
          />
        </div>

        {/* Password Input */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Lock size={15} color="#475569" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{ ...inputStyle, paddingRight: '44px' }}
            onFocus={e => e.target.style.borderColor = '#3730a3'}
            onBlur={e => e.target.style.borderColor = '#1e1e2e'}
            onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute', right: '14px', top: '50%',
              transform: 'translateY(-50%)', background: 'none',
              border: 'none', cursor: 'pointer', color: '#475569',
              padding: 0,
            }}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleEmailAuth}
          disabled={loading}
          style={{
            width: '100%', padding: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '10px',
            fontSize: '14px', fontWeight: '600', color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s',
            marginBottom: '16px',
          }}
          onMouseEnter={e => !loading && (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => !loading && (e.currentTarget.style.opacity = '1')}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        {/* Toggle Mode */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569', margin: 0 }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#6366f1', fontWeight: '600', fontSize: '13px',
              padding: 0,
            }}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}