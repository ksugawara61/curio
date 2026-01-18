import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Button variants based on daisyUI button styles
 */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "ghost"
  | "link";

/**
 * Button sizes based on daisyUI button sizes
 */
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant (color scheme)
   * @default undefined (neutral/default style)
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default "md"
   */
  size?: ButtonSize;

  /**
   * Whether button should take full width
   * @default false
   */
  block?: boolean;

  /**
   * Button content
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  neutral: "btn-neutral",
  ghost: "btn-ghost",
  link: "btn-link",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  xl: "btn-xl",
};

/**
 * Button component - Anti-Corruption Layer for daisyUI buttons
 *
 * This component wraps daisyUI's button classes to provide a consistent API
 * and prevent direct usage of underlying utility classes.
 *
 * @example
 * ```tsx
 * <Button>Default Button</Button>
 * <Button variant="primary">Primary Button</Button>
 * <Button variant="secondary" size="lg">Large Secondary</Button>
 * <Button variant="primary" block>Full Width Button</Button>
 * ```
 */
export const Button = ({
  variant,
  size = "md",
  block = false,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const classes = [
    "btn",
    variant ? VARIANT_CLASSES[variant] : "",
    SIZE_CLASSES[size],
    block ? "btn-block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
};
