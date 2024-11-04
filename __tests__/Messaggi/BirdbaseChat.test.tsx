import { screen, fireEvent } from "@testing-library/react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Mock, vi } from "vitest";
import { render } from "@/setup-test";
import BirdbaseChat from "@/components/messaggi/BirdbaseChat";
import { useStreamChatStore } from "@/store/StreamChatStore";

// Mock dei moduli e delle funzioni
vi.mock("@/store/StreamChatStore", () => ({
  useStreamChatStore: vi.fn(),
}));

vi.mock("@/providers/SupabaseProvider", () => ({
  useSupabase: vi.fn(),
}));

vi.mock("stream-chat-react", () => ({
  ...vi.importActual("stream-chat-react"),
  Chat: vi.fn(({ children }) => <div>{children}</div>),
}));

describe("Componente BirdbaseChat", () => {
  const mockClient = {
    queryUsers: vi.fn(),
  };

  const mockUser = { id: "user123" };

  beforeEach(() => {
    (useStreamChatStore as unknown as Mock).mockReturnValue({
      chatClient: mockClient,
    });
    (useSupabase as Mock).mockReturnValue({ user: mockUser });
  });

  it("dovrebbe mostrare un indicatore di caricamento se il client non è disponibile", () => {
    (useStreamChatStore as unknown as Mock).mockReturnValue({
      chatClient: null,
    });

    render(<BirdbaseChat />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument(); // Controlla l'indicatore di caricamento
  });

  it("dovrebbe renderizzare il componente Chat con la lista dei canali", () => {
    render(<BirdbaseChat />);

    expect(screen.getByText("Cerca canali")).toBeInTheDocument(); // Controlla se il campo di ricerca è presente
  });

  it("dovrebbe chiamare la funzione di ricerca utenti quando si digita nella barra di ricerca", async () => {
    render(<BirdbaseChat />);

    const searchInput = screen.getByPlaceholderText("Cerca utenti"); // Assicurati di avere il testo corretto per il placeholder
    fireEvent.change(searchInput, { target: { value: "test" } });

    expect(mockClient.queryUsers).toHaveBeenCalled(); // Controlla se queryUsers è stata chiamata
  });

  it("dovrebbe aprire il modal per creare un nuovo canale quando si clicca su crea canale", () => {
    render(<BirdbaseChat />);

    const createChannelButton = screen.getByText("Crea canale"); // Assicurati di avere il testo corretto
    fireEvent.click(createChannelButton);

    expect(screen.getByText("Crea un nuovo canale")).toBeInTheDocument(); // Controlla se il modal è visibile
  });
});
