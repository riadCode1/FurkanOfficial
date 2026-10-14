// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
<<<<<<< HEAD
const { withNativeWind } = require('nativewind/metro');
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

const {
    wrapWithReanimatedMetroConfig,
  } = require('react-native-reanimated/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

<<<<<<< HEAD
module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, { input: './global.css' })
);
=======
module.exports = wrapWithReanimatedMetroConfig(config);
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
