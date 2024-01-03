import {
  Combobox,
  Input,
  InputBase,
  Loader,
  ScrollArea,
  useCombobox,
} from "@mantine/core";
import React, { useState } from "react";
import ComboboxGenitoriItem from "./comboboxGenitoriItem";
import { Soggetto } from "@prisma/client";

export interface GenitoriItem {
  soggetto: Soggetto;
  parentela: {
    nome: string;
    colore: string;
    percentuale: number;
  } | null;
}

interface ComboboxGenitoriProps {
  genitori: GenitoriItem[];
  onComboboxChange: (val: string) => void;
  selected: string;
  label: string;
  loading: boolean;
}

function ComboboxGenitori({
  genitori,
  onComboboxChange,
  selected,
  label,
  loading
}: ComboboxGenitoriProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const options = genitori.map((g) => (
    <Combobox.Option value={g.soggetto.id} key={g.soggetto.id}>
      <ComboboxGenitoriItem
        soggetto={g.soggetto}
        parentela={g.parentela}
      />
    </Combobox.Option>
  ));

  const genitore: GenitoriItem | undefined = genitori.find(
    (g) => g.soggetto.id == selected
  );
  return (
    <Combobox
      shadow="sm"
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        onComboboxChange(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          label={label}
          component="button"
          type="button"
          pointer
          rightSection={loading ? <Loader size={18}/> : <Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          multiline
        >
          {genitore ? (
            genitore.soggetto.rna + "-" + genitore.soggetto.numero
          ) : (
            <Input.Placeholder>Scegli un Soggetto</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize type="scroll" mah={200}>
            {options}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default ComboboxGenitori;
