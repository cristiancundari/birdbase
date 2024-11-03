import { screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import PayPalButton from "@/components/PayPalButton";
import { render } from "@/setup-test";

// Mock per PayPalButtons
vi.mock("@paypal/react-paypal-js", () => ({
  PayPalButtons: ({ createOrder, onApprove, disabled = false }: any) => {
    const handleClick = async () => {
      const orderId = await createOrder(); // Simula la creazione di un ordine
      // Simula l'approvazione, chiamando onApprove con un oggetto che ha orderID
      await onApprove({ orderID: orderId });
    };

    return (
      <button onClick={handleClick} disabled={disabled}>
        PayPal Button
      </button>
    );
  },
}));

describe("PayPalButton", () => {
  it("chiama createOrder e captureOrder quando il bottone viene cliccato", async () => {
    const createOrderMock = vi.fn().mockResolvedValue("order-id-123");
    const captureOrderMock = vi.fn();

    render(
      <PayPalButton
        createOrder={createOrderMock}
        captureOrder={captureOrderMock}
      />
    );

    // Clicca sul bottone di PayPal
    fireEvent.click(screen.getByText("PayPal Button"));

    // Verifica che createOrder sia stata chiamata
    expect(createOrderMock).toHaveBeenCalled();

    // Verifica che captureOrder sia stata chiamata con l'orderId corretto
    expect(captureOrderMock).toHaveBeenCalledWith("order-id-123");
  });

  it("disabilita il bottone se 'disabled' è true", () => {
    render(
      <PayPalButton
        createOrder={vi.fn()}
        captureOrder={vi.fn()}
        disabled={true}
      />
    );

    // Controlla che il bottone sia disabilitato
    expect(screen.getByText("PayPal Button")).toBeDisabled();
  });
});
