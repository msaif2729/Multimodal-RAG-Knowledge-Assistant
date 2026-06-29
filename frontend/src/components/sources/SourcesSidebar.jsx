import { useState } from 'react'
import { Plus, Database, Sparkles } from 'lucide-react'
import SourceCard from './SourceCard'
import AddSourceModal from './AddSourceModal'
import SummarizeModal from './SummarizeModal'
import QuizModal from './QuizModal'
import Spinner from '../ui/Spinner'

export default function SourcesSidebar({ sources, loading, onSourceAdded, onSourceDeleted }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [summarizeSource, setSummarizeSource] = useState(null)
  const [quizSource, setQuizSource] = useState(null)

  return (
    <aside style={{
      width: '280px',
      minWidth: '280px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0f0f17',
      borderRight: '1px solid #1e1e2e',
    }}>
      {/* Logo / Branding */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1e1e2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>RAG Assistant</div>
            <div style={{ fontSize: '11px', color: '#6366f1' }}>Knowledge Base</div>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', fontSize: '13px', fontWeight: '600',
            padding: '10px', borderRadius: '10px', border: 'none',
            cursor: 'pointer', transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          <Plus size={15} />
          Add Source
        </button>
      </div>

      {/* Sources count */}
      <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Database size={13} color="#475569" />
        <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {sources.length} Source{sources.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Sources List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 10px 12px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}>
            <Spinner />
          </div>
        ) : sources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <Database size={28} color="#1e293b" style={{ margin: '0 auto 10px' }} />
            <p style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>No sources yet</p>
            <p style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
              Add PDFs, websites, or YouTube videos
            </p>
          </div>
        ) : (
          sources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              onDelete={onSourceDeleted}
              onSummarize={setSummarizeSource}
              onQuiz={setQuizSource}
            />
          ))
        )}
      </div>

      <AddSourceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSourceAdded={onSourceAdded}
      />
      <SummarizeModal source={summarizeSource} onClose={() => setSummarizeSource(null)} />
      <QuizModal source={quizSource} onClose={() => setQuizSource(null)} />
    </aside>
  )
}