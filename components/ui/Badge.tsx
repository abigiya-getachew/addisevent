// components/ui/Badge.tsx
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-surface text-text-secondary",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        danger: "bg-error-soft text-error",
        info: "bg-brand-secondary-soft text-brand-secondary",
        outline: "border border-border text-text-secondary",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

type Props = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export default function Badge({ children, className, variant, ...props }: Props) {
  return (
    <span className={[badgeVariants({ variant }), className].filter(Boolean).join(" ")} {...props}>
      {children}
    </span>
  )
}