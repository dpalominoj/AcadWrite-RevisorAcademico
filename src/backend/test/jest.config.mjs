// jest.config.mjs
export default {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: '../test/coverage',
  coverageReporters: ['text', 'lcov', 'json'],
  setupFilesAfterEnv: ['./setup.js'], // si tienes setup.js
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // 👇 Agregamos esta línea
    "^../../supabaseClient.js$": "<rootDir>/test/__mocks__/supabaseClient.js",
    "^../supabaseClient.js$": "<rootDir>/test/__mocks__/supabaseClient.js",
    "^../../supabaseClient$": "<rootDir>/test/__mocks__/supabaseClient.js",
  },
};
