import type { HTMLAttributes, ReactNode } from "react";
import type { SpacingToken } from "../../tokens/spacing";
import { getSpacingClass } from "../../tokens/spacing";
import type { SpacingProps } from "./spacing-props";
import { getSpacingClasses } from "./spacing-props";

export type AlignItems = "start" | "center" | "end" | "stretch" | "baseline";
export type JustifyContent =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export interface HStackProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "className">,
    SpacingProps {
  /**
   * Spacing between child elements (gap)
   */
  spacing?: SpacingToken;

  /**
   * Vertical alignment of items
   * @default "stretch"
   */
  align?: AlignItems;

  /**
   * Horizontal distribution of items
   * @default "start"
   */
  justify?: JustifyContent;

  /**
   * Children elements
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

const ALIGN_CLASSES: Record<AlignItems, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const JUSTIFY_CLASSES: Record<JustifyContent, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

/**
 * HStack component - Horizontal stack layout
 *
 * A flex container that arranges children horizontally with customizable
 * spacing, alignment, and padding/margin via design tokens.
 *
 * @example
 * ```tsx
 * <HStack spacing={4} p={6} align="center">
 *   <Button>Button 1</Button>
 *   <Button>Button 2</Button>
 * </HStack>
 * ```
 */
export function HStack({
  spacing,
  align = "stretch",
  justify = "start",
  children,
  className = "",
  m,
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  p,
  pt,
  pr,
  pb,
  pl,
  px,
  py,
  ...props
}: HStackProps) {
  const spacingProps = { m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py };

  const classes = [
    "flex",
    "flex-row",
    spacing !== undefined ? getSpacingClass("gap", spacing) : "",
    ALIGN_CLASSES[align],
    JUSTIFY_CLASSES[justify],
    ...getSpacingClasses(spacingProps),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
