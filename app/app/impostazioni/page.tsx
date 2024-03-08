import { isAmazonAccountLinked, showNotification } from "@/lib/helper";
import React from "react";
import AmazonLink from "../../../components/amazon/AmazonLink";
import { cookies } from "next/headers";
import { getServerUserProfile } from "@/lib/supabase/helper";
import assert from "assert";
import { Box, Button, Card, Paper, Title } from "@mantine/core";

async function ImpostazioniPage() {
  const userProfile = await getServerUserProfile(cookies());
  assert(userProfile, "Non autorizzato");

  const isLinked = await isAmazonAccountLinked(userProfile);
  return (
    <Card shadow="sm" withBorder>
      <Title order={2}>Impostazioni</Title>
      <Box mt="lg">
        <AmazonLink isLinked={isLinked} />
      </Box>
    </Card>
  );
}

export default ImpostazioniPage;
