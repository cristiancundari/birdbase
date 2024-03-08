import { apiFetch } from "@/lib/apiFetch";
import { formatValuta, showNotification } from "@/lib/helper";
import { useModalInit } from "@/lib/hooks";
import { useSupabase } from "@/providers/SupabaseProvider";
import { GaraWithNazioneAndCountIscrizioni } from "@/types/types";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { Soggetto } from "@prisma/client";
import {
  IconArrowNarrowRight,
  IconPlus,
  IconShoppingCart,
} from "@tabler/icons-react";
import assert from "assert";
import { useEffect, useMemo, useState, useTransition } from "react";
import ModalSelezionaSoggetto from "../../../ModalSelezionaSoggetto";
import CarrelloItem from "./CarrelloItem";
import PayPalButton from "@/components/PayPalButton";
import { usePathname, useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

function Carrello({ gara }: { gara: GaraWithNazioneAndCountIscrizioni }) {
  const [soggettiNelCarrello, setSoggettiNelCarrello] = useState<Soggetto[]>(
    []
  );
  const [soggettiDaIscrivere, setSoggettiDaIscrivere] = useState<Soggetto[]>(
    []
  );
  const [totale, setTotale] = useState(
    soggettiNelCarrello.length * gara.prezzo
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = useSupabase();
  const router = useRouter();

  function onDelete(id: string) {
    const newListaSoggetti = soggettiNelCarrello.filter((s) => s.id !== id);
    const soggettoCancellato = soggettiNelCarrello.find((s) => s.id == id);
    assert(soggettoCancellato);
    setSoggettiNelCarrello(newListaSoggetti);
    setSoggettiDaIscrivere([...soggettiDaIscrivere, soggettoCancellato]);
  }

  function iscriviSoggettoModal() {
    setIsOpen(true);
  }

  function annulla() {
    setIsOpen(false);
  }

  async function submit(soggetto: Soggetto) {
    setSoggettiNelCarrello([...soggettiNelCarrello, soggetto]);
    setSoggettiDaIscrivere(
      soggettiDaIscrivere.filter((s) => s.id != soggetto.id)
    );
  }

  async function getSoggettiDaIscrivere() {
    setIsLoading(true);
    const res = await apiFetch.get<Soggetto[]>(
      `/api/soggetti?rna=${supabase.user?.rna}&isMorto=false&garaId=${gara.id}`
    );
    if (res.error) {
      showNotification({ message: res.message });
    } else {
      setSoggettiDaIscrivere(res.data);
    }
    setIsLoading(false);
  }

  useModalInit(() => {
    getSoggettiDaIscrivere();
  }, isOpen);

  useEffect(() => {
    setTotale(soggettiNelCarrello.length * gara.prezzo);
  }, [soggettiNelCarrello, gara.prezzo]);

  const paypalCreateOrder = async () => {
    const result = await apiFetch.post("/api/paypal/createorder", {
      descrizione: `Iscrizione N.${soggettiNelCarrello.length} soggetti a "${gara.titolo}"`,
      soggetti: soggettiNelCarrello.map((s) => s.id),
      garaId: gara.id,
    });
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      return result.data.id;
    }
    return "";
  };

  const completed = () => {
    setSoggettiNelCarrello([]);
    router.refresh();
  };

  return (
    <Stack>
      <Card p={0} shadow="xs">
        <Stack gap={0}>
          <Group justify="flex-end" p="md">
            <Button
              onClick={() => {
                iscriviSoggettoModal();
              }}
              variant="light"
              leftSection={<IconPlus size={14} />}
            >
              Iscrivi
            </Button>
          </Group>

          <ScrollArea h="300" px="md">
            <Stack>
              {soggettiNelCarrello.length == 0 && (
                <>
                  <Box c="dimmed">
                    <Text>
                      Aggiungi nel carrello i soggetti che vuoi iscrivere
                    </Text>
                  </Box>
                </>
              )}
              {soggettiNelCarrello.map((soggetto) => (
                <Box py="sm" key={soggetto.id}>
                  <CarrelloItem
                    soggetto={soggetto}
                    gara={gara}
                    onDelete={onDelete}
                  />
                </Box>
              ))}
            </Stack>
          </ScrollArea>

          <Group
            justify="space-between"
            w="100%"
            style={{
              background: "linear-gradient(to right, #46b83d, #111e0b)",
              color: "white",
            }}
            p="md"
          >
            <IconShoppingCart />
            <Text fw={600} size="lg">
              {formatValuta(totale)}
            </Text>
          </Group>
        </Stack>

        <ModalSelezionaSoggetto
          isOpen={isOpen}
          annulla={() => annulla()}
          submit={submit}
          soggetti={soggettiDaIscrivere}
          isLoading={isLoading}
        />
      </Card>
      <PayPalButton
        createOrder={paypalCreateOrder}
        disabled={soggettiNelCarrello.length == 0}
        forceReRender={[totale]}
        completed={completed}
      />
    </Stack>
  );
}

export default Carrello;
