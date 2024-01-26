import { formatData, formatValuta, transazioniIconColor } from "@/lib/helper";
import { TransazioneWithCategoria } from "@/types/types";
import {
  ActionIcon,
  Box,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useRef } from "react";

interface TransazioneCompProps {
  transazione: TransazioneWithCategoria;
  printLabel: boolean;
  elimina: (transazione: TransazioneWithCategoria) => void;
  modifica: (transazione: TransazioneWithCategoria) => void;
}
function TransazioneComp({
  transazione,
  printLabel,
  elimina,
  modifica,
}: TransazioneCompProps) {
  const MyIcon = transazioniIconColor[transazione.categoria.nome].icon;
  const myColor = transazioniIconColor[transazione.categoria.nome].color;

  return (
    <Box data-testid="TransazioneComp">
      {printLabel && (
        <Text c="dimmed" fw={500}>
          {formatData(transazione.data)}
        </Text>
      )}
      <Box p="xs">
        <Group justify="space-between" wrap="nowrap">
          <Group wrap="nowrap">
            <ThemeIcon radius="xl" size="lg" color={myColor}>
              <MyIcon size={20} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={500} c={myColor}>
                {transazione.categoria.nome}
              </Text>
              <Text size="xs" c="dimmed" lineClamp={2}>
                {transazione.descrizione}
              </Text>
            </Stack>
          </Group>

          <Group style={{ flexShrink: 0 }} gap="xs">
            <Text c={transazione.prezzo > 0 ? "green" : "red"}>
              {formatValuta(transazione.prezzo)}
            </Text>
            <Menu disabled={!transazione.modificabile}>
              <MenuTarget>
                {transazione.modificabile ? (
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    data-testid="MenuButton"
                  >
                    <IconDotsVertical size={14} />
                  </ActionIcon>
                ) : (
                  <ActionIcon
                    variant="transparent"
                    color="gray"
                    style={{ cursor: "default" }}
                  >
                    <Box w={14}></Box>
                  </ActionIcon>
                )}
              </MenuTarget>
              <MenuDropdown>
                <MenuItem
                  data-testid="ModificaButton"
                  leftSection={<IconEdit size={14} />}
                  onClick={() => {
                    modifica(transazione);
                  }}
                >
                  Modifica
                </MenuItem>
                <MenuItem
                  data-testid="EliminaButton"
                  leftSection={<IconTrash size={14} />}
                  color="red"
                  onClick={() => {
                    elimina(transazione);
                  }}
                >
                  Elimina
                </MenuItem>
              </MenuDropdown>
            </Menu>
          </Group>
        </Group>
      </Box>
    </Box>
  );
}

export default TransazioneComp;

export function TransazioneCompSkeleton() {
  return (
    <>
      <Group justify="space-between" p="xs">
        <Group style={{ flexGrow: "1" }}>
          <Skeleton height={50} circle />
          <Stack style={{ flexGrow: "1" }}>
            <Skeleton height={15} width="40%" />
            <Skeleton height={10} width="25%" />
          </Stack>
        </Group>
        <Skeleton height={15} width={80} />
      </Group>
    </>
  );
}
