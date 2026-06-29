import { useState, useEffect } from 'react'
import { Database, FileText, Hash, LayoutDashboard, Loader2, Globe } from 'lucide-react'
import StatsCard from '../components/dashboard/StatsCard'
import SourcesChart from '../components/dashboard/SourcesChart'
import RecentSources from '../components/dashboard/RecentSources'
import KnowledgeHealth from '../components/dashboard/KnowledgeHealth'
import { useAuth } from '../context/AuthContext'
import * as api from '../services/api'
import toast from 'react-hot-toast'

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await api.getStats()
      setStats(res.data)
    } catch {
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div style={{
      width: '100%', height: '100vh',
      overflowY: 'auto', backgroundColor: '#0a0a0f',
      padding: '32px 40px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '32px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)',
              border: '1px solid #3730a3',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LayoutDashboard size={18} color="#818cf8" />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>
              Dashboard
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: '#475569', margin: 0, paddingLeft: '46px' }}>
            Welcome back, {user?.name || user?.email} 👋
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchStats}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: '#475569',
            backgroundColor: '#13131f', border: '1px solid #1e1e2e',
            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#818cf8'
            e.currentTarget.style.borderColor = '#3730a3'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#475569'
            e.currentTarget.style.borderColor = '#1e1e2e'
          }}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', height: '60vh', gap: '12px',
        }}>
          <Loader2 size={24} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ color: '#475569', fontSize: '14px' }}>Loading dashboard...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Stats Row */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <StatsCard
              icon={Database}
              label="Total Sources"
              value={stats?.total_sources || 0}
              color="#818cf8"
              bg="#1e1b4b"
            />
            <StatsCard
              icon={FileText}
              label="PDF Sources"
              value={stats?.by_type?.pdf || 0}
              color="#f87171"
              bg="#2d1515"
            />
            <StatsCard
              icon={Globe}
              label="Websites"
              value={stats?.by_type?.website || 0}
              color="#60a5fa"
              bg="#0f1f35"
            />
            <StatsCard
              icon={Hash}
              label="Total Chunks"
              value={stats?.total_chunks || 0}
              color="#34d399"
              bg="#064e3b"
            />
          </div>

          {/* Middle Row */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: '0 0 55%' }}>
              <SourcesChart
                byType={stats?.by_type || { pdf: 0, website: 0, youtube: 0 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              {/* <QuickActions
                onGoToChat={() => onNavigate('chat')}
                onAddSource={() => onNavigate('chat')}
                onRefresh={fetchStats}
              /> */}
               <KnowledgeHealth sources={stats?.sources || []} />
            </div>
          </div>

          {/* Recent Sources — full width */}
          <RecentSources sources={stats?.sources || []} />

        </div>
      )}
    </div>
  )
}