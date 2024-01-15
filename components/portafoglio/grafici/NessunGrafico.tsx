import { Box, Center, CenterProps, CenterFactory, Group, Text, MantineStyleProps } from '@mantine/core';
import { IconFileX } from '@tabler/icons-react';
import React from 'react'

function NessunGrafico(
  props: MantineStyleProps
) {
  return (
    <Center {...props}>
      <Group gap="xs" c="dimmed">
        <IconFileX size={24} />
        <Text>Nessun dato da visualizzare</Text>
      </Group>
    </Center>
  );
}

export default NessunGrafico