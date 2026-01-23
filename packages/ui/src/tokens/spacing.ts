/**
 * Spacing design tokens based on Tailwind's spacing scale
 */
export type SpacingToken =
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 14
  | 16
  | 20
  | 24
  | 28
  | 32
  | 36
  | 40
  | 44
  | 48
  | 52
  | 56
  | 60
  | 64
  | 72
  | 80
  | 96;

/**
 * Convert spacing token to Tailwind class
 */
export function getSpacingClass(
  prefix: string,
  value: SpacingToken | undefined,
): string {
  if (value === undefined) {
    return "";
  }
  return `${prefix}-${value.toString().replace(".", "\\.")}`;
}
