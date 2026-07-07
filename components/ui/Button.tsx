import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "kakao" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "bar";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "border-primary bg-primary text-white hover:bg-primary-dark active:bg-primary-dark",
  secondary: "border-line bg-surface text-ink hover:bg-page active:bg-line",
  outline: "border-primary bg-transparent text-primary hover:bg-primary-soft active:bg-primary-soft",
  danger: "border-danger bg-danger text-white hover:bg-red-600 active:bg-red-700",
  kakao: "border-[#FEE500] bg-[#FEE500] text-[#191919] hover:bg-[#f4dc00] active:bg-[#e8d000]",
  ghost: "border-transparent bg-transparent text-muted hover:bg-page hover:text-ink active:bg-line",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  bar: "h-[52px] px-5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border font-semibold transition duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
        sizeClass[size],
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}

