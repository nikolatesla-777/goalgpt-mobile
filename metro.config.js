const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Production build optimizations
if (process.env.NODE_ENV === 'production') {
  // Configure terser for aggressive minification
  config.transformer = {
    ...config.transformer,
    minifierPath: 'metro-minify-terser',
    minifierConfig: {
      compress: {
        // Remove all console statements in production
        drop_console: true,
        drop_debugger: true,

        // Dead code elimination
        dead_code: true,
        unused: true,

        // Boolean optimizations
        booleans: true,
        conditionals: true,

        // Function inlining
        inline: 2,

        // Evaluate constant expressions
        evaluate: true,

        // Join consecutive var statements
        join_vars: true,

        // Optimize loops
        loops: true,

        // Reduce variable names
        reduce_vars: true,

        // Remove unreachable code
        dead_code: true,

        // Collapse single-use vars
        collapse_vars: true,

        // Global definitions
        global_defs: {
          __DEV__: false,
          'process.env.NODE_ENV': JSON.stringify('production'),
        },

        // Drop unused code
        pure_funcs: [
          'console.log',
          'console.info',
          'console.debug',
          'console.warn',
        ],
      },
      mangle: {
        // Mangle variable names for smaller bundle
        toplevel: true,
        keep_fnames: false,
        reserved: [], // Add any names that must not be mangled
      },
      output: {
        comments: false,
        ascii_only: true,
        beautify: false,
      },
      // Compression passes for better results
      passes: 2,
    },
  };
}

// Enable tree-shaking and module resolution optimizations
config.resolver = {
  ...config.resolver,
  // Source extensions for better tree-shaking
  sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs', 'mjs'],
};

module.exports = config;
