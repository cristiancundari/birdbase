"use client";
import { formatValuta, showNotification } from "@/lib/helper";
import { ApiResponse } from "@/types/types";
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

function Budget() {
  const [isEdit, setIsEdit] = useState(false);
  const [newBudget, setNewBudget] = useState(0);
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function getBudget() {
    const response = await fetch("/api/budget");
    const result: ApiResponse = await response.json();
    if (result.error) {
      showNotification({
        message: "Non è stato possibile ottenere il budget",
      });
      setBudget(null);
    } else {
      setBudget(result.result.budget);
    }
  }

  async function onSave() {
    if (newBudget == budget) {
      return setIsEdit(false);
    }

    setIsLoading(true);
    const response = await fetch("/api/budget", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBudget),
    });
    const result: ApiResponse = await response.json();
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
  }, []);

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
                {budget ? (
                  <Text>{formatValuta(budget)}</Text>
                ) : (
                  <Skeleton w={100} h={14} />
                )}
              </Group>
              <Tooltip label="Modifica">
                <ActionIcon
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
            <Text c="red">-254,42 €</Text>
          </Group>
          <Text c="dimmed" fz="xs">
            Il bilancio è calcolato come: Budget - Tot. spese
          </Text>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default Budget;
