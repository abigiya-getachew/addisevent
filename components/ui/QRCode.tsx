// components/ui/QRCode.tsx
interface Props {
  children: React.ReactNode
  className?: string
}

export default function QRCode({ children, className }: Props) {
  return (
    <div className={`rounded-lg border border-border bg-surface-raised p-4 shadow-(--shadow-1) ${className ?? ""}`}>
      {children}
    </div>
  )
}