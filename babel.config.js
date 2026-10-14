module.exports = function (api) {
  api.cache(true);
  return {
<<<<<<< HEAD
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
=======
    presets: ['babel-preset-expo'],
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
    plugins: [ 'react-native-reanimated/plugin',
       [
    'module-resolver',
    {
      root: ['.'],
      alias: {
        'react-native-device-info': './react-native-device-info.js'
      }
    }
  ],
     ],
  };
<<<<<<< HEAD
};
=======
};
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
