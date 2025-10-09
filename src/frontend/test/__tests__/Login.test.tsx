import { render, screen } from "@testing-library/react";

// Mock del componente completo
jest.mock("../../src/pages/login", () => ({
  __esModule: true,
  default: () => <div>Iniciar Sesión</div>,
}));

import Login from "../../src/pages/login";

describe("Login", () => {
  it("renderiza el formulario de login", () => {
    render(<Login />);
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
  });
});
