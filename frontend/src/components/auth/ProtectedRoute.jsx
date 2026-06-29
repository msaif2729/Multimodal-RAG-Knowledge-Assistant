import { useAuth } from '../../context/AuthContext'
import LoginPage from './LoginPage'
import Spinner from '../ui/Spinner'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#0a0a0f', gap: '16px',
      }}>
        <Spinner size="lg" />
        <p style={{ fontSize: '14px', color: '#475569' }}>Loading...</p>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return children
}