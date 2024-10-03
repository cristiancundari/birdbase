import React from "react";
import { cookies } from "next/headers";
import { getServerUserProfile } from "@/lib/supabase/helper";
import assert from "assert";
import { Box, Button, Card, Title } from "@mantine/core";
import Link from "next/link";

async function ImpostazioniPage() {
  const userProfile = await getServerUserProfile(cookies());
  assert(userProfile, "Non autorizzato");

  return (
    <Card shadow="sm" withBorder>
      <Title order={2}>Impostazioni</Title>
      <Box mt="lg">
        <Button component={Link} href="/api/google/action" disabled={!!userProfile.googleRefreshToken}>Link Google Calendar</Button>
      </Box>
    </Card>
  );
}

export default ImpostazioniPage;
