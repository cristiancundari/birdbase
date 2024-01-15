import React from 'react'
import { Table } from '@mantine/core';
import { TransazioneWithCategoria } from '@/types/types';
import { formatData, formatValuta } from '@/lib/helper';

function ItemPdf({item}:{item:TransazioneWithCategoria}) {
  return (
    <Table.Tr key={item.id}>
      <Table.Td>{formatData(item.data)}</Table.Td>
      <Table.Td>{item.categoria.nome}</Table.Td>
      <Table.Td>{item.descrizione}</Table.Td>
      <Table.Td>{formatValuta(item.prezzo)}</Table.Td>
    </Table.Tr>
  )
}

export default ItemPdf