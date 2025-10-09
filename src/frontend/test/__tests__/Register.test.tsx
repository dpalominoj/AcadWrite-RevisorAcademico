
import { render, screen } from "@testing-library/react";

// Mock RTK Query hooks que use tu componente
jest.mock("../../src/redux/slices/authSlice", () => ({
  useSignupMutation: () => [jest.fn(), { isLoading: false }],
}));

// Mock de react-router-dom si tu componente lo usa
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

// Mock de import.meta.env
Object.defineProperty(global, "import", {
  value: { meta: { env: { VITE_API_URL: "http://localhost:5000" } } },
});

import Register from "../../src/pages/register";

describe("Register", () => {
  test("renderiza su contenido principal", () => {
    render(<Register />);
    // Busca cualquier texto típico del formulario
    expect(
      screen.getByText(/crear cuenta|registrarse|registro/i)
    ).toBeInTheDocument();
  });
});
