"use client";
import { formatValuta, showNotification } from "@/lib/helper";
import { ApiResponse, BudgetRequest } from "@/types/types";
import {
  ActionIcon,
  Group,
  NumberInput,
  Paper,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconCurrencyEuro,
  IconDeviceFloppy,
  IconEdit,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { usePortafoglioContext } from "./portafoglioPage";
import { apiFetch } from "@/lib/apiFetch";

function Budget() {
  const { state: forceRender } = usePortafoglioContext();
  const [isEdit, setIsEdit] = useState(false);
  const [newBudget, setNewBudget] = useState(0);
  const [budget, setBudget] = useState<number | null>(null);
  const [bilancio, setBilancio] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function getBudget() {
    const result = await apiFetch.get<BudgetRequest>("/api/budget");
    if (result.error) {
      showNotification({
        message: "Non è stato possibile ottenere il budget",
      });
      setBudget(null);
    } else {
      const budget = result.data.budget.budget;
      const spesa = result.data.spese._sum.prezzo || 0;
      const bilancio = budget + spesa; //Le spese sono registrate in negativo (somma algebrica con segno)
      setBudget(budget);
      setBilancio(bilancio);
    }
  }

  async function onSave() {
    if (newBudget == budget) {
      return setIsEdit(false);
    }

    setIsLoading(true);
    const result = await apiFetch.patch("/api/budget", { budget: newBudget });
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({
        message: "Budget modificato correttamente",
        success: true,
      });
      setIsEdit(false);
      getBudget();
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getBudget();
  }, [forceRender]);

  return (
    <Paper p="md" shadow="xs">
      <Stack>
        <Text fw={500} fz="lg">
          Budget
        </Text>
        <Group>
          {!isEdit && (
            <>
              <Group>
                <Text>Il tuo budget mensile: </Text>
                {budget !== null ? (
                  <Text>{formatValuta(budget)}</Text>
                ) : (
                  <Skeleton w={100} h={14} data-testid="SkeletonBudget" />
                )}
              </Group>
              <Tooltip label="Modifica">
                <ActionIcon
                  data-testid="ButtonModificaBudget"
                  variant="light"
                  color="gray"
                  size="sm"
                  onClick={() => {
                    setNewBudget(budget || 0);
                    setIsEdit(true);
                  }}
                >
                  <IconEdit size={14} />
                </ActionIcon>
              </Tooltip>
            </>
          )}
          {isEdit && (
            <>
              <Group>
                <Text>Il tuo budget mensile: </Text>
                <NumberInput
                  data-testid="InputBudget"
                  value={newBudget}
                  onChange={(value) => {
                    setNewBudget(value as number);
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  hideControls
                  leftSection={<IconCurrencyEuro size={16} />}
                />
                <Tooltip label="Salva">
                  <ActionIcon
                    data-testid="ButtonSalva"
                    loading={isLoading}
                    variant="filled"
                    size="lg"
                    color="green"
                    onClick={onSave}
                  >
                    <IconDeviceFloppy size={14} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </>
          )}
        </Group>

        <Stack gap={0}>
          <Group>
            <Text>Bilancio: </Text>
            {bilancio !== null ? (
              <Text c={bilancio >= 0 ? "green" : "red"}>
                {formatValuta(bilancio)}
              </Text>
            ) : (
              <Skeleton w={100} h={14} />
            )}
          </Group>
          <Text c="dimmed" fz="xs">
            Il bilancio è calcolato come: Budget - Spese
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default Budget;
