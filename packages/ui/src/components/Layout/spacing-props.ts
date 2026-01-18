import type { SpacingToken } from "../../tokens/spacing";
import { getSpacingClass } from "../../tokens/spacing";

/**
 * Spacing props interface for margin and padding
 */
export type SpacingProps = {
  /** Margin - all sides */
  m?: SpacingToken;
  /** Margin top */
  mt?: SpacingToken;
  /** Margin right */
  mr?: SpacingToken;
  /** Margin bottom */
  mb?: SpacingToken;
  /** Margin left */
  ml?: SpacingToken;
  /** Margin horizontal (left and right) */
  mx?: SpacingToken;
  /** Margin vertical (top and bottom) */
  my?: SpacingToken;

  /** Padding - all sides */
  p?: SpacingToken;
  /** Padding top */
  pt?: SpacingToken;
  /** Padding right */
  pr?: SpacingToken;
  /** Padding bottom */
  pb?: SpacingToken;
  /** Padding left */
  pl?: SpacingToken;
  /** Padding horizontal (left and right) */
  px?: SpacingToken;
  /** Padding vertical (top and bottom) */
  py?: SpacingToken;
};

/**
 * Get Tailwind classes from spacing props
 */
export function getSpacingClasses(props: SpacingProps): string[] {
  const classes: string[] = [];

  // Margin
  if (props.m !== undefined) {
    classes.push(getSpacingClass("m", props.m));
  }
  if (props.mt !== undefined) {
    classes.push(getSpacingClass("mt", props.mt));
  }
  if (props.mr !== undefined) {
    classes.push(getSpacingClass("mr", props.mr));
  }
  if (props.mb !== undefined) {
    classes.push(getSpacingClass("mb", props.mb));
  }
  if (props.ml !== undefined) {
    classes.push(getSpacingClass("ml", props.ml));
  }
  if (props.mx !== undefined) {
    classes.push(getSpacingClass("mx", props.mx));
  }
  if (props.my !== undefined) {
    classes.push(getSpacingClass("my", props.my));
  }

  // Padding
  if (props.p !== undefined) {
    classes.push(getSpacingClass("p", props.p));
  }
  if (props.pt !== undefined) {
    classes.push(getSpacingClass("pt", props.pt));
  }
  if (props.pr !== undefined) {
    classes.push(getSpacingClass("pr", props.pr));
  }
  if (props.pb !== undefined) {
    classes.push(getSpacingClass("pb", props.pb));
  }
  if (props.pl !== undefined) {
    classes.push(getSpacingClass("pl", props.pl));
  }
  if (props.px !== undefined) {
    classes.push(getSpacingClass("px", props.px));
  }
  if (props.py !== undefined) {
    classes.push(getSpacingClass("py", props.py));
  }

  return classes;
}
