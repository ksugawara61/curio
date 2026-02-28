module.exports = function (api) {
  api.cache(true);

  // Storybook (Vite) uses its own JSX transform; skip NativeWind preset there
  const isStorybook = process.env.IS_STORYBOOK === "true";

  return {
    presets: [
      [
        "babel-preset-expo",
        // Storybook/ネイティブ共通で nativewind の JSX ランタイムを使用する
        // これにより className prop が react-native-web で正しく処理される
        { jsxImportSource: "nativewind" },
      ],
      // nativewind/babel はネイティブ専用の追加変換（reanimated 等）を含むため
      // Storybook では不要
      ...(isStorybook ? [] : ["nativewind/babel"]),
    ],
  };
};
