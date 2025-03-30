"use client";
import { apiFetch } from "@/lib/apiFetch";
import { showNotification } from "@/lib/helper";
import { evaluate } from "@/lib/parser/evaluator";
import { ProfiloWithAllevatore } from "@/types/types";
import { LineChart } from "@mantine/charts";
import { Alert, Badge, Box, Button, Grid, Group, List, Text, TextInput, Title } from "@mantine/core";
import { useDebouncedState, useSetState } from "@mantine/hooks";
import { IconDeviceFloppy, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Slider from "../Slider";

interface IPuntiGrafico {
  label: string;
  coeff: number;
}

function FunzioneValutazione({ user }: { user: ProfiloWithAllevatore }) {
  const [puntiData, setPuntiData] = useState<IPuntiGrafico[]>([]);
  const [puntiParentela, setPuntiParentela] = useState<IPuntiGrafico[]>([]);

  const [valueData, setValueData] = useDebouncedState(user.formulaData || "", 500);
  const [valueParentela, setValueParentela] = useDebouncedState(user.formulaParentela || "", 500);

  const [errors, setErrors] = useSetState({
    data: "",
    parentela: "",
  });

  const [sliderValue, setSliderValue] = useState(user.percentualeFormulaData / 100);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit() {
    setIsLoading(true);
    const result = await apiFetch.patch("/api/impostazioni", {
      formulaData: valueData,
      formulaParentela: valueParentela,
      percentualeFormulaData: Math.round(sliderValue * 100),
    });
    if (result.error) {
      showNotification({ message: result.message });
    } else {
      showNotification({ message: "Impostazioni salvate correttamente.", success: true });
    }
    setIsLoading(false);
  }

  useEffect(() => {
    // Esegue la formula, verifica se è valida, calcola i punti del grafico
    try {
      const results = [];
      for (let i = 0; i <= 5; i = Math.round(i * 10 + 1) / 10) {
        const res = evaluate(valueData, i);
        if (res == undefined) {
          throw new Error("Errore di calcolo");
        }
        results.push({ label: i.toString(), coeff: Math.round(res * 100) / 100 });
      }
      setPuntiData(results);
      setErrors({ data: "" });
    } catch (error: any) {
      setErrors({ data: error.message });
      setPuntiData([]);
    }
  }, [valueData]);

  useEffect(() => {
    // Esegue la formula, verifica se è valida, calcola i punti del grafico
    try {
      const results = [];
      for (let i = 0; i <= 5; i = Math.round(i * 10 + 1) / 10) {
        const res = evaluate(valueParentela, i);
        if (res == undefined) {
          throw new Error("Errore di calcolo");
        }
        results.push({ label: i.toString(), coeff: Math.round(res * 100) / 100 });
      }
      setPuntiParentela(results);
      setErrors({ parentela: "" });
    } catch (error: any) {
      setErrors({ parentela: error.message });
      setPuntiParentela([]);
    }
  }, [valueParentela]);

  return (
    <>
      <Alert variant="light" color="indigo" radius="md" title="Scegli la formula di valutazione" icon={<IconInfoCircle />}>
        <Text size="sm">
          Nella sezione seguente puoi decidere quale formula utilizzare per calcolare la valutazione di un soggetto.
          <br />
          La valutazione è calcolata utilizzando i punteggi ottenuti alle gare/mostre dal soggetto in esame e dai suoi parenti.
        </Text>
        <Text mt="sm" size="sm">
          Il calcolo può essere influenzato da due fattori inserendo la variabile{" "}
          <Text fw="bold" size="md" span>
            x
          </Text>{" "}
          nella formula:
        </Text>
        <List ms="sm">
          <List.Item>
            <Text size="sm">La quantità in anni trascorsi tra la data odierna e la data in cui si è svolta la gara</Text>
          </List.Item>
          <List.Item>
            <Text size="sm">Il grado di parentela tra il soggetto in esame e i suoi parenti</Text>
          </List.Item>
        </List>

        <Group align="center" mt="lg">
          <Title order={6}>Funzioni disponibili</Title>
          <Group>
            <Badge variant="outline">log</Badge>
            <Badge variant="outline">ln</Badge>
            <Badge variant="outline">sqrt</Badge>
            <Badge variant="outline">sin</Badge>
            <Badge variant="outline">cos</Badge>
            <Badge variant="outline">tan</Badge>
          </Group>
        </Group>
      </Alert>

      <Grid mt="lg">
        <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 1 }}>
          <TextInput
            label="Formula per data"
            description="x = anni trascorsi tra data corrente e data gara"
            onChange={(e) => setValueData(e.currentTarget.value)}
            defaultValue={valueData}
            error={errors.data}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 3 }}>
          <LineChart h={300} data={puntiData} dataKey="label" series={[{ name: "coeff", color: "cyan" }]} curveType="monotone" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 3, md: 2 }}>
          <TextInput
            label="Formula per parentela"
            description="x = grado di parentela"
            onChange={(e) => setValueParentela(e.currentTarget.value)}
            defaultValue={valueParentela}
            error={errors.parentela}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 4, md: 4 }}>
          <LineChart h={300} data={puntiParentela} dataKey="label" series={[{ name: "coeff", color: "grape" }]} curveType="monotone" />
        </Grid.Col>
      </Grid>

      <Box hidden={errors.data != "" || errors.parentela != ""}>
        <Text mt="xl">Decidi quanto le due formule incidano sul calcolo della valutazione dei soggetti</Text>
        <Box mt="sm">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Formula per data
            </Text>
            <Text size="sm" c="dimmed">
              Formula per parentela
            </Text>
          </Group>
          <Slider value={sliderValue} onChange={(v) => setSliderValue(v)} />
        </Box>
      </Box>

      <Group my={"md"} justify="end">
        <Button color={"teal"} leftSection={<IconDeviceFloppy />} onClick={onSubmit} loading={isLoading}>
          Salva
        </Button>
      </Group>
    </>
  );
}

export default FunzioneValutazione;
