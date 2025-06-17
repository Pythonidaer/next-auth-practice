// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { configFile: './babel.jest.config.js' },
    ],
  },
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,ts,jsx,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  // ADD THIS SECTION to ignore files from coverage reports
  coveragePathIgnorePatterns: [
    '<rootDir>/babel.config.js',
    '<rootDir>/jest.config.js',
    '<rootDir>/next.config.mjs', // Assuming your Next.js config is at the root
    '<rootDir>/.eslintrc.js', // Your ESLint config
    '<rootDir>/.prettierrc.js',
    // ADD THESE PATTERNS to ignore generated report files/folders from coverage
    '<rootDir>/coverage/', // Ignores the entire coverage output directory
    '<rootDir>/jest-stare/', // Ignores the entire jest-stare output directory
    // If for some reason these specific JS files are appearing outside
    // the /coverage/ or /jest-stare/ folders and are *not* your app code,
    // you would add their specific paths here, e.g.:
    '<rootDir>/babel.jest.config.js',
    // '<rootDir>/path/to/block-navigation.js',
  ],
  reporters: [
    'default',
    [
      'jest-stare',
      {
        resultDir: 'jest-stare',
        reportTitle: 'Test Report',
        additionalResultsProcessors: [],
        coverageLink: '../coverage/lcov-report/index.html',
        jestStareConfigJson: 'jest-stare.json',
        jestGlobalConfigJson: 'globalStuff.json',
      },
    ],
  ],
};
