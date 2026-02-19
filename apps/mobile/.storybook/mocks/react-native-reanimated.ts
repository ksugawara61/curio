// Mock for react-native-reanimated in Storybook (Vite/browser context).
// Replaces native worklet/animation APIs with no-op stubs.

const createAnimatedComponent = (Component: unknown) => Component;

// biome-ignore lint/suspicious/noExplicitAny: mock stub
export default { createAnimatedComponent } as any;

export { createAnimatedComponent };
export const useSharedValue = (value: unknown) => ({ value });
export const useAnimatedStyle = () => ({});
export const withTiming = (value: unknown) => value;
export const withSpring = (value: unknown) => value;
export const withDelay = (_delay: number, animation: unknown) => animation;
export const withSequence = (...animations: unknown[]) => animations[0];
export const withRepeat = (animation: unknown) => animation;
export const Easing = {
  bezier: () => (t: number) => t,
  linear: (t: number) => t,
  inOut: (easing: (t: number) => number) => easing,
};
export const cancelAnimation = () => {};
export const runOnJS = <T extends (...args: unknown[]) => unknown>(fn: T) => fn;
export const makeMutable = (value: unknown) => ({ value });
export const FadeIn = { duration: () => FadeIn };
export const FadeOut = { duration: () => FadeOut };
