import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/**
 * Typography variant sizes based on @tailwindcss/typography plugin
 */
export type TypographySize = "sm" | "base" | "lg" | "xl" | "2xl";

/**
 * Typography component types
 */
export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div";

export type TypographyProps<T extends ElementType = "p"> = {
  /**
   * The HTML element to render
   * @default "p"
   */
  as?: T;

  /**
   * Typography size
   * @default "base"
   */
  size?: TypographySize;

  /**
   * Content to render
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
};

const SIZE_CLASSES: Record<TypographySize, string> = {
  sm: "prose-sm",
  base: "prose",
  lg: "prose-lg",
  xl: "prose-xl",
  "2xl": "prose-2xl",
};

/**
 * Typography component - Anti-Corruption Layer for @tailwindcss/typography
 *
 * This component wraps Tailwind's typography plugin (prose classes) to provide
 * a consistent API and prevent direct usage of underlying utility classes.
 *
 * @example
 * ```tsx
 * <Typography>Default paragraph text</Typography>
 * <Typography as="h1" size="2xl">Large heading</Typography>
 * <Typography as="div" size="lg" className="custom-class">Custom div</Typography>
 * ```
 */
export function Typography<T extends ElementType = "p">({
  as,
  size = "base",
  children,
  className = "",
  ...props
}: TypographyProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TypographyProps<T>>) {
  const Component = as || "p";
  const sizeClass = SIZE_CLASSES[size];
  const classes = [sizeClass, className].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
