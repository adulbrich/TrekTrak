// metro.config.js
// Learn more: https://docs.expo.dev/guides/customizing-metro

const { getDefaultConfig } = require('expo/metro-config');   // ✅ OK for SDK ≥ 50
const { withTamagui } = require('@tamagui/metro-plugin');

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname, { isCSSEnabled: true });

config = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
  outputCSS: './tamagui.css',
});

config.t

config.resolver.unstable_enablePackageExports = false;

module.exports = config