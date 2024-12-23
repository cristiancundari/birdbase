import { prisma } from "@/lib/prisma";

export async function getInserzioni() {
  return await prisma.inserzione.findMany({
    where: {
      soggettoCopiaId: null, // Filtra solo le inserzioni che non sono state ancora acquistate
    },
    include: {
      soggetto: {
        include: {
          iscrizioni: {
            select: {
              gara: {
                select: {
                  titolo: true,
                  data: true,
                },
              },
              posizione: true,
            },
          },
        },
      },
      profilo: { select: { allevatore: true } },
    },
  });
}
