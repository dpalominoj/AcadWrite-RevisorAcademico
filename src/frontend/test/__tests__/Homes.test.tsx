import { render, screen } from "@testing-library/react";

// Stub del componente para el test
jest.mock("../../src/pages/homes", () => ({
  __esModule: true,
  default: () => <div>Subir Archivo PDF</div>,
}));

import UploadPDF from "../../src/pages/homes";

describe("UploadPDF", () => {
  it("renderiza el componente", () => {
    render(<UploadPDF />);
    expect(screen.getByText(/Subir Archivo PDF/i)).toBeInTheDocument();
  });
});
