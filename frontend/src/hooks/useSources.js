import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import * as api from '../services/api'

export function useSources() {
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchSources = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.listSources()
      setSources(res.data.sources || [])
    } catch (err) {
      console.error('Failed to fetch sources:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
      fetchSources()
      // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  const addSource = (source) => {
    setSources((prev) => [source, ...prev])
  }

  const removeSource = async (id) => {
    try {
      await api.deleteSource(id)
      setSources((prev) => prev.filter((s) => s.id !== id))
      toast.success('Source removed')
    } catch {
      toast.error('Failed to delete source')
    }
  }

  return { sources, loading, fetchSources, addSource, removeSource }
}