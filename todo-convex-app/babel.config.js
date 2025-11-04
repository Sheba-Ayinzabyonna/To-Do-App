// babel.config.js

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      // 🎯 ADD THIS PRESET 🎯
      "@babel/preset-flow",
    ],
    // The plugins section may also be necessary if you are using Reanimated
    // or other plugins, but adding the preset should fix the Flow issue.
    plugins: [
      // Example plugin for Reanimated:
      "react-native-reanimated/plugin",
    ],
  };
};
