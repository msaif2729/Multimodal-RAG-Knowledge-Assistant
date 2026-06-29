export default function Badge({ type }) {
  const styles = {
    pdf: 'bg-red-500/15 text-red-300 border border-red-500/30',
    website: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    youtube: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
  }

  const labels = {
    pdf: 'PDF',
    website: 'Website',
    youtube: 'YouTube',
  }

  return (
    <span
      className={`
        inline-flex items-center
        rounded-full
        px-3 py-1
        text-[11px] font-semibold tracking-wide
        shadow-sm
        transition-all duration-200
        hover:scale-105
        select-none
        ${styles[type] || styles.pdf}
      `}
    >
      {labels[type] || (
        <span className="capitalize">{type}</span>
      )}
    </span>
  )
}