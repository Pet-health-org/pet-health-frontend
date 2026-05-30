import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LowStockAlerts } from "@/features/inventory/components/LowStockAlerts";
import { findBajoStock } from "@/services/inventario.service";

// Mock de la dependencia de notificación
const mockNotify = vi.fn();
vi.mock("@/context/NotificationContext", () => ({
  useNotify: () => ({
    notify: mockNotify,
  }),
}));

// Mock del servicio
vi.mock("@/services/inventario.service", () => ({
  findBajoStock: vi.fn(),
}));

describe("LowStockAlerts Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no debe renderizar nada si no hay alertas", async () => {
    // Simular que no hay items
    vi.mocked(findBajoStock).mockResolvedValueOnce({ data: [] } as any);

    const { container } = render(<LowStockAlerts />);

    // Esperar a que pase el loading
    await waitFor(() => {
      expect(findBajoStock).toHaveBeenCalled();
    });

    // El componente retorna null si el array está vacío
    expect(container.firstChild).toBeNull();
  });

  it("debe renderizar la lista de productos críticos", async () => {
    const mockData = [
      {
        id: "1",
        nombreProducto: "Vacuna A",
        stockActual: 0,
        stockMinimo: 10,
        proveedor: { nombre: "Prov 1" },
      },
      {
        id: "2",
        nombreProducto: "Jeringas",
        stockActual: 5,
        stockMinimo: 20,
        proveedor: { nombre: "Prov 2" },
      },
    ];

    vi.mocked(findBajoStock).mockResolvedValueOnce({ data: mockData } as any);

    render(<LowStockAlerts />);

    // Verificar que carga
    await waitFor(() => {
      expect(screen.getByText("Alertas de Inventario")).toBeInTheDocument();
    });

    // Verificar contenido de Vacuna A (stock cero)
    expect(screen.getByText("Vacuna A")).toBeInTheDocument();
    const vacunaStatus = screen.getByText("0").closest("div")?.parentElement;
    expect(vacunaStatus).toHaveClass("bg-red-50");

    // Verificar contenido de Jeringas (bajo mínimo)
    expect(screen.getByText("Jeringas")).toBeInTheDocument();
    const jeringasStatus = screen.getByText("5").closest("div")?.parentElement;
    expect(jeringasStatus).toHaveClass("bg-amber-50");
  });

  it("debe llamar a notify al hacer clic en Generar Orden", async () => {
    const mockData = [
      {
        id: "1",
        nombreProducto: "Ibuprofeno",
        stockActual: 2,
        stockMinimo: 10,
      },
    ];

    vi.mocked(findBajoStock).mockResolvedValueOnce({ data: mockData } as any);

    render(<LowStockAlerts />);

    await waitFor(() => {
      expect(screen.getByText("Ibuprofeno")).toBeInTheDocument();
    });

    const btn = screen.getByRole("button", { name: /Generar Orden/i });
    fireEvent.click(btn);

    expect(mockNotify).toHaveBeenCalledWith(
      "success",
      "Orden Generada",
      "Se ha generado una orden de compra para: Ibuprofeno",
    );
  });
});
