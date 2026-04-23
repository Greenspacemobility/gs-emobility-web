interface Props {
  children: React.ReactNode
  className?: string
}

export default function Badge({ children, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-green-500/10 text-green-400 border border-green-500/20 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      {children}
    </span>
  )
}
