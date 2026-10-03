// components/ui/Spinner.tsx
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" },
    },
    defaultVariants: { size: "md" },
  }
);

type Props = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> &
  VariantProps<typeof spinnerVariants>;

export default function Spinner({ className, size, ...props }: Props) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[spinnerVariants({ size }), className].filter(Boolean).join(" ")}
      {...props}
    />
  )
}