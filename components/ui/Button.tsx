// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Spinner({
  size = "sm",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        size === "sm" ? "h-4 w-4" : "h-5 w-5",
        className
      )}
    />
  );
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary text-white hover:brightness-95",
        secondary: "bg-brand-secondary-soft text-brand-secondary hover:brightness-95",
        outline: "border border-border text-foreground hover:bg-surface",
        ghost: "text-foreground hover:bg-surface",
        danger: "bg-error text-white hover:brightness-95",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({ variant, size, loading, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-visible:outline-none focus-visible:shadow-(--shadow-focus) disabled:cursor-not-allowed disabled:opacity-60",
        buttonVariants({ variant, size }),
        className
      )}
      {...props}
      disabled={loading || props.disabled}
      aria-busy={loading || undefined}
    >
      {loading && <Spinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
}

export default Button;