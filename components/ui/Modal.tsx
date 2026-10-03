// components/ui/Modal.tsx
interface Props {
  children: React.ReactNode
  className?: string
}

export default function Modal({ children, className }: Props) {
  return (
    <div className={`rounded-lg border border-border bg-surface-raised p-4 shadow-(--shadow-3) ${className ?? ""}`}>
      {children}
    </div>
  )
}