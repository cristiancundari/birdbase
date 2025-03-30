import { Button, Text, Title } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

function GoogleCalendarLink({ disabled }: { disabled: boolean }) {
  return (
    <>
      <Title order={5}>Collega il tuo account google calendar</Title>
      <Text size="sm">Effettuando l&apos;accesso potrai sincronizzare i promemoria creati in-app sul tuo calendario google</Text>
      <Button component={Link} href="/api/google/action" disabled={disabled} mt="md" leftSection={<IconBrandGoogle />}>
        Collega Google Calendar
      </Button>
    </>
  );
}

export default GoogleCalendarLink;
