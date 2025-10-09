module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass|svg|png|jpg)$": "identity-obj-proxy",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/components/**/*.{ts,tsx}",
    "src/hooks/**/*.{ts,tsx}"
  ],
  coverageDirectory: '../test/coverage',
  coverageReporters: ["text", "lcov", "html"],

  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@reduxjs/toolkit))'
  ],
};
