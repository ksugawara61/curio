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

export interface VStackProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "className">,
    SpacingProps {
  /**
   * Spacing between child elements (gap)
   */
  spacing?: SpacingToken;

  /**
   * Horizontal alignment of items
   * @default "stretch"
   */
  align?: AlignItems;

  /**
   * Vertical distribution of items
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
 * VStack component - Vertical stack layout
 *
 * A flex container that arranges children vertically with customizable
 * spacing, alignment, and padding/margin via design tokens.
 *
 * @example
 * ```tsx
 * <VStack spacing={4} p={6} align="center">
 *   <Typography>Item 1</Typography>
 *   <Typography>Item 2</Typography>
 * </VStack>
 * ```
 */
export const VStack = ({
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
}: VStackProps) => {
  const spacingProps = { m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py };

  const classes = [
    "flex",
    "flex-col",
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
};
