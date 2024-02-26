"use client";
import { Alert, Box, Group, Paper, Text, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  IconCheck,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

function AmazonLink({ isLinked }: { isLinked: boolean }) {
  return (
    <>
      <Text size="lg">Amazon</Text>
      <Text c="dimmed" size="xs">
        Collega il tuo account amazon per ricevere i promemoria sui tuoi
        dispositivi Alexa
      </Text>
      <Paper withBorder p="md" mt="sm">
        {isLinked ? (
          <Group justify="space-between">
            <Group gap="xs">
              <Group c="teal">
                <IconCircleCheck size={18} />
              </Group>
              <Text size="sm">Account Amazon collegato</Text>
            </Group>
            <Box>
              <Text
                component={Link}
                href="/api/amazon?state=unlink"
                c="dimmed"
                size="sm"
              >
                Scollega
              </Text>
            </Box>
          </Group>
        ) : (
          <Box>
            <Link href="/api/amazon?state=init">
              <Image
                alt="Login with Amazon"
                src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
                width="156"
                height="32"
              />
            </Link>
          </Box>
        )}
      </Paper>
      <Box my="md">
        <AmazonResultAlert />
      </Box>
    </>
  );
}

function AmazonResultAlert() {
  const searchParams = useSearchParams();
  const unlinked = searchParams.get("unlinked");
  const linked = searchParams.get("linked");
  const error = searchParams.get("error");

  const [isOpen, setIsOpen] = useState(
    linked === "true" || unlinked === "true" || error != null
  );

  if (!isOpen) {
    return null;
  }

  if (linked === "true" || unlinked === "true") {
    return (
      <Alert
        variant="filled"
        color="teal"
        title="Eseguito"
        withCloseButton
        closeButtonLabel="Chiudi"
        onClose={() => setIsOpen(false)}
        icon={<IconCheck />}
      >
        {linked === "true"
          ? "Il collegamento con Amazon è stato effettuato con successo"
          : "L'account Amazon è stato scollegato con successo"}
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert
        variant="filled"
        color="red"
        title="Si è verificato un errore"
        withCloseButton
        closeButtonLabel="Chiudi"
        onClose={() => setIsOpen(false)}
        icon={<IconInfoCircle />}
      >
        {error}
      </Alert>
    );
  }
}

export default AmazonLink;
