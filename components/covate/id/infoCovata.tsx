"use client";
import Breadcrumb from "@/components/breadcrumb";
import ModalSoggetto from "@/components/home/modalSoggetto";
import { CovataWithGenitoriAndFigli } from "@/types/types";
import { Box, Button, Group, SimpleGrid, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import InfoCovataHeader from "./infoCovataHeader";
import SoggettoComp from "@/components/soggetto";

interface InfoCovataProps {
  covata: CovataWithGenitoriAndFigli;
}

const breadcrumbsItems = [
  { title: "Covate", href: "/app/covate" },
  { title: "Info covata", href: "#" },
];

function InfoCovata({ covata }: InfoCovataProps) {
  const [isModalSoggettoOpen, setIsModalSoggettoOpen] = useState(false);
  return (
    <>
      <Breadcrumb items={breadcrumbsItems} />
      <InfoCovataHeader covata={covata} />
      <Box mt="md">
        <Box mb="md">
          <Group justify="space-between">
            <Text fw={500} fz="lg">
              Figli
            </Text>
            <Button
              onClick={() => {
                setIsModalSoggettoOpen(true);
              }}
              variant="light"
              leftSection={<IconPlus size={14} />}
            >
              Aggiungi
            </Button>
          </Group>
        </Box>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          {covata.figli.length > 0 ? (
            covata.figli.map((soggetto) => (
              <SoggettoComp
                key={soggetto.id}
                sogg={soggetto}
                handlerPreferito={async () => {
                  return null;
                }}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))
          ) : (
            <div>Ancora nessun figlio aggiunto a questa covata</div>
          )}
        </SimpleGrid>
      </Box>
      <ModalSoggetto
        isOpen={isModalSoggettoOpen}
        annulla={() => {}}
        submit={async () => {}}
        modalData={null}
      />
    </>
  );
}

export default InfoCovata;
