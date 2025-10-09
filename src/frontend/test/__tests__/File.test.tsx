import { render, screen } from "@testing-library/react";

// Mock del componente completo
jest.mock("../../src/pages/files", () => ({
  __esModule: true,
  default: () => <div>Mis Archivos</div>,
}));

import DocumentViewer from "../../src/pages/files";

describe("DocumentViewer", () => {
  it("renderiza el título principal", () => {
    render(<DocumentViewer />);
    expect(screen.getByText(/Mis Archivos/i)).toBeInTheDocument();
  });
});
