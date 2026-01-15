const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Production build optimizations
if (process.env.NODE_ENV === 'production') {
  // Configure terser to remove console.log statements in production
  config.transformer = {
    ...config.transformer,
    minifierPath: 'metro-minify-terser',
    minifierConfig: {
      compress: {
        // Remove all console statements in production
        drop_console: true,

        // Additional optimizations
        dead_code: true,
        drop_debugger: true,
        global_defs: {
          __DEV__: false,
        },
      },
      mangle: {
        // Mangle all properties except React-related ones
        keep_fnames: false,
      },
      output: {
        comments: false,
        ascii_only: true,
      },
    },
  };
}

module.exports = config;
