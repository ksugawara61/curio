import type { HTMLAttributes, ReactNode } from "react";
import type { SpacingToken } from "../../tokens/spacing";
import { getSpacingClass } from "../../tokens/spacing";
import type { SpacingProps } from "./spacing-props";
import { getSpacingClasses } from "./spacing-props";

export type FlexDirection = "row" | "row-reverse" | "col" | "col-reverse";
export type FlexWrap = "wrap" | "wrap-reverse" | "nowrap";
export type AlignItems = "start" | "center" | "end" | "stretch" | "baseline";
export type JustifyContent =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export interface FlexProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "className">,
    SpacingProps {
  /**
   * Flex direction
   * @default "row"
   */
  direction?: FlexDirection;

  /**
   * Flex wrap behavior
   * @default "nowrap"
   */
  wrap?: FlexWrap;

  /**
   * Spacing between child elements (gap)
   */
  spacing?: SpacingToken;

  /**
   * Alignment along cross axis
   * @default "stretch"
   */
  align?: AlignItems;

  /**
   * Distribution along main axis
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

const DIRECTION_CLASSES: Record<FlexDirection, string> = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  col: "flex-col",
  "col-reverse": "flex-col-reverse",
};

const WRAP_CLASSES: Record<FlexWrap, string> = {
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
  nowrap: "flex-nowrap",
};

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
 * Flex component - Flexible box layout
 *
 * A general-purpose flex container with full control over direction, wrapping,
 * spacing, alignment, and padding/margin via design tokens.
 *
 * @example
 * ```tsx
 * <Flex direction="row" spacing={4} p={6} align="center" justify="between">
 *   <Typography>Left</Typography>
 *   <Typography>Right</Typography>
 * </Flex>
 * ```
 */
export const Flex = ({
  direction = "row",
  wrap = "nowrap",
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
}: FlexProps) => {
  const spacingProps = { m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py };

  const classes = [
    "flex",
    DIRECTION_CLASSES[direction],
    WRAP_CLASSES[wrap],
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
