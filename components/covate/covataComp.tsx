"use client";
import { formatAnelletto, formatData } from "@/lib/helper";
import {
  CovataWithGenitoriAndCountFigli,
  CovataWithGenitoriAndFigli,
} from "@/types/types";
import {
  ActionIcon,
  Anchor,
  Card,
  Divider,
  Group,
  Menu,
  Text,
} from "@mantine/core";
import {
  IconBarrel,
  IconDotsVertical,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { IconSessoFemale, IconSessoMale } from "../IconsSesso";
import Completata from "./completata";
import InfoUova from "./infoUova";
import InfoGabbia from "../InfoGabbia";

interface CovataCompProps {
  covata: CovataWithGenitoriAndCountFigli;
  modalElimina: (id: number) => void;
  modalModifica: (covata: CovataWithGenitoriAndCountFigli) => void;
}

function CovataComp({ covata, modalElimina, modalModifica }: CovataCompProps) {
  return (
    <Card shadow="sm" withBorder>
      <Group gap="xs" justify="space-between">
        <Group gap="xs">
          {covata.completata && <Completata />}
          <Text>
            <Anchor href={`/app/covate/${covata.id}`} c="dark">
              {formatData(covata.data)}
            </Anchor>
          </Text>
        </Group>
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDotsVertical size="14" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconPencil size="14" />}
              onClick={() => {
                modalModifica(covata);
              }}
            >
              Modifica
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size="14" />}
              color="red"
              onClick={() => {
                modalElimina(covata.id);
              }}
            >
              Elimina
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Divider my="sm" />

      <Group justify="space-between">
        <Group gap="xs">
          <IconSessoMale size="18" />
          <Text>
            {formatAnelletto(
              covata.padre.rna,
              covata.padre.numero,
              covata.padre.anno
            )}
          </Text>
        </Group>
        <InfoGabbia gabbia={covata.gabbia} hideNull />
      </Group>

      <Group justify="space-between">
        <Group gap="xs">
          <IconSessoFemale size="18" />
          <Text>
            {formatAnelletto(
              covata.madre.rna,
              covata.madre.numero,
              covata.madre.anno
            )}
          </Text>
        </Group>
        <InfoUova deposte={covata.uovaDeposte} schiuse={covata._count.figli} />
      </Group>
    </Card>
  );
}

export default CovataComp;
