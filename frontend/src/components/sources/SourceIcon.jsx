import { FileText, Globe, PlayCircle } from 'lucide-react'

export default function SourceIcon({ type, size = 18 }) {
  const icons = {
    pdf: <FileText size={size} className="text-red-400" />,
    website: <Globe size={size} className="text-blue-400" />,
    youtube: <PlayCircle size={size} className="text-rose-400" />,
  }
  return icons[type] || <FileText size={size} className="text-gray-400" />
}