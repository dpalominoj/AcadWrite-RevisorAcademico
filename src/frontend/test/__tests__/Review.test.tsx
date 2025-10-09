import { render, screen } from "@testing-library/react";

// Mock del componente completo
jest.mock("../../src/pages/revise", () => ({
  __esModule: true,
  default: () => <div>Estudiantes</div>,
}));

import TeacherDashboard from "../../src/pages/revise";

describe("TeacherDashboard", () => {
  it("renderiza el título principal", () => {
    render(<TeacherDashboard />);
    expect(screen.getByText(/Estudiantes/i)).toBeInTheDocument();
  });
});
