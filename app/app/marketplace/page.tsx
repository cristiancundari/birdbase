import { getInserzioni } from "@/app/api/inserzioni/route";
import Marketplace from "@/components/marketplace/Marketplace";

async function MarketplacePage() {
  const inserzioni = await getInserzioni();

  return <Marketplace inserzioni={inserzioni} />;
}

export default MarketplacePage;
