"use client";
import React, { useState } from "react";
import Covata from "./covata";
import { Box, Button, Group, SimpleGrid } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ModalCovata from "./modalCovata";

function CovatePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(false);

  function annulla() {
    setIsOpen(false);
  }

  function btnAggiungiCovata() {
    setIsOpen(true);
  }
  return (
    <>
      <Box mb="md">
        <Group justify={"flex-end"}>
          <Button
            onClick={btnAggiungiCovata}
            variant="light"
            leftSection={<IconPlus size={14} />}
          >
            Aggiungi
          </Button>
        </Group>
      </Box>
      <SimpleGrid cols={4}>
        {Array(10)
          .fill(0)
          .map((item, index) => (
            <Covata key={index} />
          ))}
      </SimpleGrid>

      <ModalCovata isOpen={isOpen} annulla={annulla} modalData={modalData} />
    </>
  );
}

export default CovatePage;
