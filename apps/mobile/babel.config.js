module.exports = function (api) {
  api.cache(true);

  // Storybook (Vite) uses its own JSX transform; skip NativeWind preset there
  const isStorybook = process.env.IS_STORYBOOK === "true";

  return {
    presets: [
      [
        "babel-preset-expo",
        isStorybook ? {} : { jsxImportSource: "nativewind" },
      ],
      ...(isStorybook ? [] : ["nativewind/babel"]),
    ],
  };
};
