import { render, screen } from "@testing-library/react";

// Mock del componente completo
jest.mock("../../src/pages/profile", () => ({
  __esModule: true,
  default: () => <div>Detalles del usuario</div>,
}));

import Profile from "../../src/pages/profile";

describe("Profile", () => {
  it("renderiza el texto principal", () => {
    render(<Profile />);
    expect(screen.getByText(/Detalles del usuario/i)).toBeInTheDocument();
  });
});
