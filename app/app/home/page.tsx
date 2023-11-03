import Homepage from "@/components/home/homePage";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import React from "react";

async function HomePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user.id;
  const soggetti = await prisma.soggetto.findMany({
    where: {
      profileId: userId,
    },
    orderBy: {
      dataNascita: "desc",
    },
  });

  return (
    <>
      <Homepage soggetti={soggetti}></Homepage>
    </>
  );
}

export default HomePage;
