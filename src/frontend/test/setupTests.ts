import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import { cleanup } from "@testing-library/react";

// Habilita el mock global de fetch
fetchMock.enableMocks();

(global as any).importMeta = { env: { VITE_API_URL: "http://localhost:4000" } };
(global as any).import = { meta: (global as any).importMeta };

// Mock global de import.meta.env para Jest (simula entorno Vite)
if (!(global as any).import) (global as any).import = {};
if (!(global as any).import.meta) (global as any).import.meta = {};
if (!(global as any).import.meta.env) (global as any).import.meta.env = {};

// Variables de entorno simuladas
;(global as any).import.meta.env.VITE_API_URL = "http://localhost:4000";
;(global as any).import.meta.env.NODE_ENV = "test";

// 🔹 Mock de window.matchMedia usado por Ant Design
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// 🔹 Limpieza de mocks y localStorage antes de cada test
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});
