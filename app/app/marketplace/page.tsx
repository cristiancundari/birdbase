import Marketplace from "@/components/marketplace/Marketplace";
import { prisma } from "@/lib/prisma";

async function MarketplacePage() {
  const inserzioni = await prisma.inserzione.findMany({
    where: { soggettoCopiaId: null },
    include: { soggetto: true, profilo: true },
  });
  return <Marketplace inserzioni={inserzioni} />;
}

export default MarketplacePage;
