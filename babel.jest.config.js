// babel.config.js
module.exports = {
  presets: [
    // This preset compiles modern JavaScript down to a
    // version compatible with your target environment.
    // 'node: "current"' ensures compatibility with
    // the Node.js version Jest runs on.
    ['@babel/preset-env', { targets: { node: 'current' } }],
    // This is the crucial preset for React:
    // It enables Babel to understand and transpile JSX syntax.
    '@babel/preset-react',
  ],
};
