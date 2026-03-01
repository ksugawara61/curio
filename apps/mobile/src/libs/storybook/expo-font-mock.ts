// expo-font のモック（Storybook 用）
// expo-font → expo-modules-core → TurboModuleRegistry の依存チェーンが
// react-native-web に存在しないため、最小限のスタブで差し替える
// isLoaded: true を返すことで @expo/vector-icons がグリフ文字をレンダリングする
export const isLoaded = () => true;
export const loadAsync = () => Promise.resolve();
