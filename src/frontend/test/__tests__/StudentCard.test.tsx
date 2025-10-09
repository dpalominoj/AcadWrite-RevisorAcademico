import { render, screen, fireEvent } from "@testing-library/react";
import StudentCard from "../../src/components/dashboard/StudentCard";

describe("StudentCard component", () => {
  const mockStudent = {
    _id: "1",
    username: "Luis Deudor",
    email: "luis@example.com",
    lastUpload: new Date().toISOString(),
    hasNewDocs: true,
  };

  const onSelectMock = jest.fn();

  test("renderiza el nombre y correo del estudiante", () => {
    render(<StudentCard student={mockStudent} onSelect={onSelectMock} />);
    expect(screen.getByText("Luis Deudor")).toBeInTheDocument();
    expect(screen.getByText("luis@example.com")).toBeInTheDocument();
  });

  test("muestra la etiqueta 'Nuevo' si tiene nuevos documentos", () => {
    render(<StudentCard student={mockStudent} onSelect={onSelectMock} />);
    expect(screen.getByText("Nuevo")).toBeInTheDocument();
  });

  test("ejecuta onSelect al hacer clic", () => {
    render(<StudentCard student={mockStudent} onSelect={onSelectMock} />);
    fireEvent.click(screen.getByText("Luis Deudor"));
    expect(onSelectMock).toHaveBeenCalledWith("1");
  });
});
