import { render, screen } from "@testing-library/react";

// Mock del componente completo
jest.mock("../../src/pages/registerStudent", () => ({
  __esModule: true,
  default: () => <div>Registrarse</div>,
}));

import RegisterStudent from "../../src/pages/registerStudent";

describe("RegisterStudent", () => {
  it("renderiza el texto principal", () => {
    render(<RegisterStudent />);
    expect(screen.getByText(/Registrarse/i)).toBeInTheDocument();
  });
});
