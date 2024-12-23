import React from "react";
import { cookies } from "next/headers";
import { getServerUserProfile } from "@/lib/supabase/helper";
import assert from "assert";
import { Box, Button, Card, Title } from "@mantine/core";
import Link from "next/link";
import { checkGoogleToken } from "@/lib/googleapis";

async function ImpostazioniPage() {
  const userProfile = await getServerUserProfile(cookies());
  assert(userProfile, "Non autorizzato");
  const isGoogleTokenValid = await checkGoogleToken(
    userProfile.googleRefreshToken
  );

  return (
    <Card shadow="sm" withBorder>
      <Title order={2}>Impostazioni</Title>
      <Box mt="lg">
        <Button
          component={Link}
          href="/api/google/action"
          disabled={isGoogleTokenValid}
        >
          Link Google Calendar
        </Button>
      </Box>
    </Card>
  );
}

export default ImpostazioniPage;
