import FunzioneValutazione from "@/components/impostazioni/FunzioneValutazione";
import GoogleCalendarLink from "@/components/impostazioni/GoogleCalendarLink";
import SliderParentela from "@/components/impostazioni/SliderParentela";
import { checkGoogleToken } from "@/lib/googleapis";
import { getServerUserProfile } from "@/lib/supabase/helper";
import { Box, Card, Divider, Title } from "@mantine/core";
import assert from "assert";
import { cookies } from "next/headers";

async function ImpostazioniPage() {
  const userProfile = await getServerUserProfile(cookies());
  assert(userProfile, "Non autorizzato");
  const isGoogleTokenValid = await checkGoogleToken(userProfile.googleRefreshToken);

  return (
    <Card shadow="sm" withBorder>
      <Title order={2}>Impostazioni</Title>
      <Box mt="lg">
        <GoogleCalendarLink disabled={isGoogleTokenValid} />
      </Box>
      <Divider my="lg" />
      <Box>
        <SliderParentela limiteLivelliParentela={userProfile.limiteLivelliParentela} />
      </Box>
      <Divider my="lg" />
      <Box>
        <FunzioneValutazione user={userProfile} />
      </Box>
    </Card>
  );
}

export default ImpostazioniPage;
