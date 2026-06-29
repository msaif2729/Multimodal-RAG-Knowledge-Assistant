import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Link, PlayCircle, FileText, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../ui/Modal'
import * as api from '../../services/api'

const TABS = [
  { id: 'pdf', label: 'PDF', icon: FileText, color: '#f87171' },
  { id: 'website', label: 'Website', icon: Link, color: '#60a5fa' },
  { id: 'youtube', label: 'YouTube', icon: PlayCircle, color: '#f472b6' },
]

const inputStyle = {
  width: '100%',
  backgroundColor: '#13131f',
  border: '1px solid #1e1e2e',
  borderRadius: '10px',
  padding: '11px 14px',
  color: '#e2e8f0',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.15s',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

export default function AddSourceModal({ isOpen, onClose, onSourceAdded }) {
  const [activeTab, setActiveTab] = useState('pdf')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const reset = () => { setUrl(''); setTitle(''); setProgress(0) }

  const handleClose = () => { reset(); onClose() }

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    setLoading(true)
    try {
      const res = await api.uploadPDF(file, setProgress)
      onSourceAdded(res.data)
      toast.success(`"${res.data.title}" added!`)
      handleClose()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to upload PDF')
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: loading,
  })

  const handleURLSubmit = async () => {
    if (!url.trim()) return toast.error('Please enter a URL')
    setLoading(true)
    try {
      const res = activeTab === 'website'
        ? await api.ingestURL(url, title || undefined)
        : await api.ingestYouTube(url)
      onSourceAdded(res.data)
      toast.success(`"${res.data.title}" added!`)
      handleClose()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to process URL')
    } finally {
      setLoading(false)
    }
  }

  const activeConfig = TABS.find(t => t.id === activeTab)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Knowledge Source" maxWidth="480px">
      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '6px',
        backgroundColor: '#13131f',
        padding: '5px', borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid #1e1e2e',
      }}>
        {TABS.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); reset() }}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '6px', padding: '8px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '500', border: 'none', cursor: 'pointer',
              transition: 'all 0.15s',
              backgroundColor: activeTab === id ? '#1e1e2e' : 'transparent',
              color: activeTab === id ? color : '#475569',
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* PDF Tab */}
      {activeTab === 'pdf' && (
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? '#6366f1' : '#1e1e2e'}`,
            borderRadius: '12px',
            padding: '36px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#1e1b4b20' : '#13131f',
            transition: 'all 0.15s',
          }}
        >
          <input {...getInputProps()} />
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Loader2 size={28} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>Processing... {progress}%</p>
              <div style={{ width: '100%', backgroundColor: '#1e1e2e', borderRadius: '999px', height: '4px' }}>
                <div style={{
                  width: `${progress}%`, height: '4px',
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  borderRadius: '999px', transition: 'width 0.3s',
                }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                backgroundColor: '#2d1515', display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: '4px',
              }}>
                <Upload size={22} color="#f87171" />
              </div>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#e2e8f0', margin: 0 }}>
                {isDragActive ? 'Drop your PDF here' : 'Drag & drop a PDF'}
              </p>
              <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                or click to browse • Max 50MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* Website Tab */}
      {activeTab === 'website' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Website URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#3730a3'}
              onBlur={e => e.target.style.borderColor = '#1e1e2e'}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Title <span style={{ color: '#334155', fontWeight: '400', textTransform: 'none' }}>(optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Custom name for this source"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#3730a3'}
              onBlur={e => e.target.style.borderColor = '#1e1e2e'}
            />
          </div>
          <button
            onClick={handleURLSubmit}
            disabled={loading || !url.trim()}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '11px',
              background: loading || !url.trim() ? '#1e1e2e' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              color: loading || !url.trim() ? '#475569' : 'white',
              border: 'none', borderRadius: '10px', fontSize: '14px',
              fontWeight: '600', cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s', marginTop: '4px',
            }}
          >
            {loading
              ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
              : <><Link size={15} /> Add Website</>
            }
          </button>
        </div>
      )}

      {/* YouTube Tab */}
      {activeTab === 'youtube' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              YouTube URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#3730a3'}
              onBlur={e => e.target.style.borderColor = '#1e1e2e'}
            />
          </div>
          <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.6' }}>
            The video must have captions or subtitles enabled. Auto-generated captions are supported.
          </p>
          <button
            onClick={handleURLSubmit}
            disabled={loading || !url.trim()}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '11px',
              background: loading || !url.trim() ? '#1e1e2e' : 'linear-gradient(135deg, #9d174d, #ec4899)',
              color: loading || !url.trim() ? '#475569' : 'white',
              border: 'none', borderRadius: '10px', fontSize: '14px',
              fontWeight: '600', cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s', marginTop: '4px',
            }}
          >
            {loading
              ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
              : <><PlayCircle size={15} /> Add YouTube Video</>
            }
          </button>
        </div>
      )}
    </Modal>
  )
}