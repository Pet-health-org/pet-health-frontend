import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const proveedorServiceMock = vi.hoisted(() => ({
  getProveedores: vi.fn(),
}));

vi.mock("../../services/proveedor.service", () => proveedorServiceMock);

import { InventoryForm } from "../../features/inventory/components/InventoryForm";

describe("Integración frontend - formulario de inventario", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    proveedorServiceMock.getProveedores.mockResolvedValue({
      data: [{ id: "provider-1", nombreEmpresa: "Vet Supplies SAS" }],
    });
  });

  it("envía todos los campos requeridos por el backend al registrar un producto", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<InventoryForm items={[]} onClose={vi.fn()} onSubmit={onSubmit} />);

    await waitFor(() =>
      expect(proveedorServiceMock.getProveedores).toHaveBeenCalled(),
    );

    await user.type(screen.getByLabelText(/Código/i), "VAC-001");
    await user.type(
      screen.getByLabelText(/Nombre del Producto/i),
      "Vacuna antirrábica",
    );
    await user.selectOptions(screen.getByLabelText(/Categoría/i), "Vacuna");
    await user.type(screen.getByLabelText(/Presentación/i), "Frasco 10 dosis");
    await user.type(
      screen.getByLabelText(/Descripción/i),
      "Vacuna para prevención de rabia canina",
    );
    await user.selectOptions(screen.getByLabelText(/Unidad de Medida/i), "ml");
    await user.clear(screen.getByLabelText(/Stock Inicial/i));
    await user.type(screen.getByLabelText(/Stock Inicial/i), "100");
    await user.clear(screen.getByLabelText(/Stock Mínimo/i));
    await user.type(screen.getByLabelText(/Stock Mínimo/i), "20");
    await user.type(
      screen.getByLabelText(/Fecha de Vencimiento/i),
      "2027-04-24",
    );
    await user.clear(screen.getByLabelText(/Precio Unitario/i));
    await user.type(screen.getByLabelText(/Precio Unitario/i), "25.5");
    await user.selectOptions(screen.getByLabelText(/Proveedor/i), "provider-1");

    await user.click(
      screen.getByRole("button", { name: /Guardar en Inventario/i }),
    );

    expect(onSubmit).toHaveBeenCalledWith({
      proveedorId: "provider-1",
      codigo: "VAC-001",
      nombreProducto: "Vacuna antirrábica",
      descripcion: "Vacuna para prevención de rabia canina",
      presentacion: "Frasco 10 dosis",
      unidadMedida: "ml",
      tipo: "Vacuna",
      stockActual: 100,
      stockMinimo: 20,
      fechaVencimiento: "2027-04-24",
      precioUnitario: 25.5,
    });
  });

  it("muestra validación por campo cuando el código ya existe", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <InventoryForm
        items={[{ code: "VAC-001" }]}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/Proveedor/i)).not.toBeDisabled(),
    );

    await user.type(screen.getByLabelText(/Código/i), "VAC-001");
    await user.type(
      screen.getByLabelText(/Nombre del Producto/i),
      "Otra vacuna",
    );
    await user.type(
      screen.getByLabelText(/Fecha de Vencimiento/i),
      "2027-05-01",
    );
    await user.clear(screen.getByLabelText(/Precio Unitario/i));
    await user.type(screen.getByLabelText(/Precio Unitario/i), "10");
    await user.selectOptions(screen.getByLabelText(/Proveedor/i), "provider-1");

    await user.click(
      screen.getByRole("button", { name: /Guardar en Inventario/i }),
    );

    expect(
      await screen.findByText("Ya existe un producto con este código"),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
