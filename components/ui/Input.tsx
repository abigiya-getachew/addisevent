// components/ui/Input.tsx
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "w-full rounded-md border bg-surface-raised px-3 text-foreground placeholder:text-text-muted focus:outline-none focus-visible:shadow-(--shadow-focus)",
  {
    variants: {
      size: { sm: "h-8 text-sm", md: "h-10", lg: "h-12 text-lg" },
      error: {
        true: "border-error focus-visible:border-error",
        false: "border-border focus-visible:border-border-strong",
      },
    },
    defaultVariants: { size: "md", error: false },
  }
);

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputVariants>;

export default function Input({ className, size, error, ...props }: Props) {
  return (
    <input
      className={[inputVariants({ size, error }), className].filter(Boolean).join(" ")}
      aria-invalid={error || undefined}
      {...props}
    />
  )
}