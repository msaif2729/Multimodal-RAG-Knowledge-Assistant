import { useState } from 'react'
import SourcesSidebar from '../components/sources/SourcesSidebar'
import ChatWindow from '../components/chat/ChatWindow'
import DashboardPage from './DashboardPage'
import { useSources } from '../hooks/useSources'
import { useChat } from '../hooks/useChat'
import { LayoutDashboard, MessageSquare } from 'lucide-react'

export default function ChatPage() {
  const { sources, loading, addSource, removeSource } = useSources()
  const { messages, loading: chatLoading, sendMessage, clearChat } = useChat()
  const [activePage, setActivePage] = useState('chat')

  return (
    <div style={{
      display: 'flex', height: '100vh',
      width: '100vw', overflow: 'hidden',
      backgroundColor: '#0a0a0f',
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: '280px', minWidth: '280px',
        height: '100vh', display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0f0f17',
        borderRight: '1px solid #1e1e2e',
      }}>
        {/* Sidebar content — always visible */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <SourcesSidebar
            sources={sources}
            loading={loading}
            onSourceAdded={addSource}
            onSourceDeleted={removeSource}
          />
        </div>

        {/* Dashboard button at bottom */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid #1e1e2e',
        }}>
          <button
            onClick={() => setActivePage(activePage === 'dashboard' ? 'chat' : 'dashboard')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: '10px', padding: '11px 14px', borderRadius: '10px',
              fontSize: '13px', fontWeight: '500', border: 'none',
              cursor: 'pointer', transition: 'all 0.15s',
              backgroundColor: activePage === 'dashboard' ? '#1e1b4b' : '#13131f',
              color: activePage === 'dashboard' ? '#818cf8' : '#64748b',
              boxShadow: activePage === 'dashboard' ? '0 0 0 1px #3730a3' : '0 0 0 1px #1e1e2e',
            }}
            onMouseEnter={e => {
              if (activePage !== 'dashboard') {
                e.currentTarget.style.backgroundColor = '#13131f'
                e.currentTarget.style.color = '#a5b4fc'
                e.currentTarget.style.boxShadow = '0 0 0 1px #3730a3'
              }
            }}
            onMouseLeave={e => {
              if (activePage !== 'dashboard') {
                e.currentTarget.style.backgroundColor = '#13131f'
                e.currentTarget.style.color = '#64748b'
                e.currentTarget.style.boxShadow = '0 0 0 1px #1e1e2e'
              }
            }}
          >
            <LayoutDashboard size={15} />
            {activePage === 'dashboard' ? 'Back to Chat' : 'View Dashboard'}
          </button>
        </div>
      </div>

      {/* Main Content — full screen */}
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activePage === 'chat' ? (
          <ChatWindow
            messages={messages}
            loading={chatLoading}
            onSend={sendMessage}
            onClear={clearChat}
          />
        ) : (
          <DashboardPage onNavigate={setActivePage} />
        )}
      </main>
    </div>
  )
}