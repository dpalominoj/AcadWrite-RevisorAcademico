// jest.integracion.config.mjs - Exclusivo para Pruebas de Integración

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: false, 
  setupFilesAfterEnv: ['./setup.js'],
  
  testMatch: [
    "**/*.integracion.test.js"
  ],

  moduleNameMapper: {
    '../../supabaseClient.js': '<rootDir>/__mocks__/supabaseClient.js',
  },

  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};

