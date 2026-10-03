// components/ui/Card.tsx
interface Props {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className }: Props) {
  return (
    <div className={`rounded-lg border border-border bg-surface-raised p-4 text-foreground shadow-(--shadow-1) ${className ?? ""}`}>
      {children}
    </div>
  )
}