import PortafoglioPage from "@/components/portafoglio/portafoglioPage";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/supabase/helper";
import { createClient } from "@/lib/supabase/server";
import assert from "assert";
import { cookies } from "next/headers";
import React from "react";

async function Portafoglio() {
  const user = await getServerUser(cookies());
  assert(user, "L'utente non risulta loggato");
  return <PortafoglioPage />;
}

export default Portafoglio;
