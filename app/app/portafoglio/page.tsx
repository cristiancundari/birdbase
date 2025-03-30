import PortafoglioPage from "@/components/portafoglio/portafoglioPage";
import { getServerUser } from "@/lib/supabase/helper";
import assert from "assert";
import { cookies } from "next/headers";

async function Portafoglio() {
  return <PortafoglioPage />;
}

export default Portafoglio;
