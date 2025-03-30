import { coloriPriorita, formatData } from "@/lib/helper";
import { ActionIcon, Box, Group, Menu, MenuDropdown, MenuItem, MenuTarget, Stack, Text } from "@mantine/core";
import { Promemoria } from "@prisma/client";
import { IconCircleCheck, IconCircleCheckFilled, IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { format } from "date-fns";

interface PromemoriaCompProps {
  value: Promemoria;
  modalElimina: (id: number) => void;
  modalModifica: (promemoria: Promemoria) => void;
}

function PromemoriaComp({ value, modalElimina, modalModifica }: PromemoriaCompProps) {
  return (
    <>
      <Group align="center">
        <Text c={"blue"} fw={700}>
          {format(value.ora, "HH:mm")}
        </Text>
      </Group>

      <Box style={{ alignSelf: "stretch" }} w={"4px"} bg={coloriPriorita[value.priorita]}></Box>

      <Stack gap={0}>
        <Text c="dimmed" fw={700}>
          {value?.titolo}
        </Text>
        <Text>{value?.descrizione}</Text>
      </Stack>

      <Group justify="space-between">
        {value?.completato ? (
          <ActionIcon variant="transparent" aria-label="Settings" data-testid="completato-test">
            <IconCircleCheckFilled />
          </ActionIcon>
        ) : (
          <ActionIcon variant="transparent" aria-label="Settings" data-testid="non-completato-test">
            <IconCircleCheck />
          </ActionIcon>
        )}

        <Menu>
          <MenuTarget>
            <ActionIcon variant="subtle" color="gray" data-testid="MenuButton">
              <IconDotsVertical size={14} />
            </ActionIcon>
          </MenuTarget>
          <MenuDropdown>
            <MenuItem
              data-testid="ModificaButton"
              leftSection={<IconEdit size={14} />}
              onClick={() => {
                modalModifica(value);
              }}
            >
              Modifica
            </MenuItem>
            <MenuItem
              data-testid="EliminaButton"
              leftSection={<IconTrash size={14} />}
              color="red"
              onClick={() => {
                modalElimina(value.id);
              }}
            >
              Elimina
            </MenuItem>
          </MenuDropdown>
        </Menu>
      </Group>
    </>
  );
}

export default PromemoriaComp;
