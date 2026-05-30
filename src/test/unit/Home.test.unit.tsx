import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Home } from "@/pages/Home";
import { BrowserRouter } from "react-router-dom";

// Mocks de hooks y dependencias
const mockLogin = vi.fn();
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

const mockNotify = vi.fn();
vi.mock("@/context/NotificationContext", () => ({
  useNotify: () => ({
    notify: mockNotify,
  }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    useNavigate: () => mockNavigate,
  };
});

// Mock del servicio de autenticación
import { login as authLogin } from "@/services/auth.service";
vi.mock("@/services/auth.service", () => ({
  login: vi.fn(),
}));

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHome = () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
  };

  it("debe renderizar el landing page sin el modal abierto", () => {
    renderHome();

    // Verificar que existe el logo o texto de bienvenida
    expect(
      screen.getByText(/Gestión veterinaria moderna y eficiente/i),
    ).toBeInTheDocument();

    // El modal de login no debe estar en el DOM (el título es "Acceso Personal")
    expect(screen.queryByText("Acceso Personal")).not.toBeInTheDocument();
  });

  it("debe abrir el modal de login al hacer clic en Entrar al Sistema", () => {
    renderHome();

    const btnEntrar = screen.getByRole("button", {
      name: /Entrar al Sistema/i,
    });
    fireEvent.click(btnEntrar);

    // Ahora el modal debe estar en el DOM
    expect(screen.getByText("Acceso Personal")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Nombre de usuario"),
    ).toBeInTheDocument();
  });

  it("debe iniciar sesión exitosamente, notificar y redirigir", async () => {
    renderHome();

    // Abrir modal
    fireEvent.click(screen.getByRole("button", { name: /Entrar al Sistema/i }));

    // Configurar el mock de authLogin para que sea exitoso
    vi.mocked(authLogin).mockResolvedValueOnce({
      data: { access_token: "fake-token" },
    } as any);

    // Encontrar y enviar el form
    const btnSubmit = screen.getAllByRole("button", {
      name: /Entrar al Sistema/i,
    })[1];
    fireEvent.click(btnSubmit);

    await waitFor(() => {
      // Verificar que authLogin fue llamado con admin/Admin123! (valores por defecto del state)
      expect(authLogin).toHaveBeenCalledWith({
        username: "admin",
        password: "Admin123!",
      });

      // Verificar que useAuth.login fue llamado
      expect(mockLogin).toHaveBeenCalledWith("fake-token");

      // Verificar notificación de éxito
      expect(mockNotify).toHaveBeenCalledWith(
        "success",
        "Bienvenido",
        "Has iniciado sesión correctamente.",
      );

      // Verificar redirección
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("debe bloquearse después de 3 intentos fallidos", async () => {
    renderHome();
    fireEvent.click(screen.getByRole("button", { name: /Entrar al Sistema/i }));

    // Rechazar 3 veces
    vi.mocked(authLogin).mockRejectedValue(new Error("Credenciales inválidas"));

    const btnSubmit = screen.getAllByRole("button", {
      name: /Entrar al Sistema/i,
    })[1];

    // Intento 1
    fireEvent.click(btnSubmit);
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        "error",
        "Error de acceso",
        "Credenciales incorrectas. Intento 1/3",
      ),
    );

    // Intento 2
    fireEvent.click(btnSubmit);
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        "error",
        "Error de acceso",
        "Credenciales incorrectas. Intento 2/3",
      ),
    );

    // Intento 3
    fireEvent.click(btnSubmit);
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        "error",
        "Acceso Bloqueado",
        "Por seguridad, el acceso ha sido bloqueado tras 3 intentos fallidos.",
      ),
    );

    // Verificar que el formulario se bloqueó
    expect(
      screen.getByText(
        "Acceso bloqueado por seguridad tras 3 intentos fallidos.",
      ),
    ).toBeInTheDocument();

    const usernameInput = screen.getByPlaceholderText("Nombre de usuario");
    expect(usernameInput).toBeDisabled();

    const disabledBtn = screen.getByRole("button", {
      name: /Cuenta Bloqueada/i,
    });
    expect(disabledBtn).toBeDisabled();
  });
});
