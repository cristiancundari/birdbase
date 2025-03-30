"use client";
import { apiFetch } from "@/lib/apiFetch";
import { MAX_LVL_PARENTELA, MIN_LVL_PARENTELA, showNotification } from "@/lib/helper";
import { Button, Grid, Group, Slider, Space, Text, Title } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useState } from "react";

const TICK_INTERVAL: number = 5;

const sliderMarks = Array(Math.floor((MAX_LVL_PARENTELA - MIN_LVL_PARENTELA) / TICK_INTERVAL) + 1)
  .fill(0)
  .map((_, i) => ({
    value: MIN_LVL_PARENTELA + TICK_INTERVAL * i,
    label: (MIN_LVL_PARENTELA + TICK_INTERVAL * i).toString(),
  }));

function SliderParentela({ limiteLivelliParentela }: { limiteLivelliParentela: number }) {
  const [value, setValue] = useDebouncedState(limiteLivelliParentela, 500);
  const [isLoading, setIsLoading] = useState(false);

  async function salva() {
    setIsLoading(true);
    const result = await apiFetch.put("/api/impostazioni", {
      limiteLivelliParentela: value,
    });
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({ message: "Impostazione salvata correttamente.", success: true });
    }
    setIsLoading(false);
  }

  return (
    <>
      <Title order={5}>Limite grado di parentela</Title>
      <Text size="sm">Seleziona con lo slider il livello massimo di parentela che si vuole calcolare</Text>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Slider min={MIN_LVL_PARENTELA} max={MAX_LVL_PARENTELA} mt="md" marks={sliderMarks} flex={1} onChange={setValue} defaultValue={value} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }} offset={{ base: 0, lg: 4 }}>
          <Group justify="end" mt={{ base: "md", md: 0 }}>
            <Button color={"teal"} leftSection={<IconDeviceFloppy />} onClick={salva} loading={isLoading}>
              Salva
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
      <Space h="md" />
    </>
  );
}

export default SliderParentela;
