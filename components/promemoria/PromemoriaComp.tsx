import { coloriPriorita, formatData } from "@/lib/helper";
import {
  ActionIcon,
  Box,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Stack,
  Text,
} from "@mantine/core";
import { Promemoria } from "@prisma/client";
import {
  IconCircleCheck,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

interface PromemoriaCompProps {
  value: Promemoria;
  modalElimina: (id: number) => void;
  modalModifica: (promemoria: Promemoria) => void;
}

function PromemoriaComp({
  value,
  modalElimina,
  modalModifica,
}: PromemoriaCompProps) {
  const printTime = () => {
    const ora = value?.ora?.getHours();
    const minuti = value?.ora?.getMinutes();
    const orario = pad(ora) + ":" + pad(minuti);
    return orario;

    function pad(num: any) {
      return num < 10 ? "0" + num : num;
    }
  };
  return (
    <>
      <Group align="center">
        <Text c={"blue"} fw={700}>
          {printTime()}
        </Text>
      </Group>

      <Box
        style={{ alignSelf: "stretch" }}
        w={"4px"}
        bg={coloriPriorita[value.priorita]}
      ></Box>

      <Stack gap={0}>
        <Text c="dimmed" fw={700}>
          {value?.titolo}
        </Text>
        <Text>{value?.descrizione}</Text>
      </Stack>

      <Group justify="space-between">
        {value?.completato ? (
          <ActionIcon variant="transparent" aria-label="Settings">
            <IconCircleCheckFilled />
          </ActionIcon>
        ) : (
          <ActionIcon variant="transparent" aria-label="Settings">
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
