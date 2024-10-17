import {
  Combobox,
  Input,
  InputBase,
  Loader,
  ScrollArea,
  useCombobox,
} from "@mantine/core";
import React, { useState } from "react";
import ComboboxSoggettoItem from "./comboboxSoggettoItem";
import { Soggetto } from "@prisma/client";
import { formatAnelletto } from "@/lib/helper";
import { SoggettoWithParentela } from "@/types/types";

interface ComboboxSoggettoProps {
  genitori: SoggettoWithParentela[];
  onComboboxChange: (val: string) => void;
  selected?: string;
  label: string;
  loading: boolean;
  description?: string;
}

function ComboboxSoggetto({
  genitori,
  onComboboxChange,
  selected,
  label,
  loading,
  description,
}: ComboboxSoggettoProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const options = genitori.map((g) => (
    <Combobox.Option value={g.soggetto.id} key={g.soggetto.id}>
      <ComboboxSoggettoItem soggetto={g.soggetto} parentela={g.parentela} />
    </Combobox.Option>
  ));

  const genitore: SoggettoWithParentela | undefined = genitori.find(
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
          description={description}
          label={label}
          component="button"
          type="button"
          pointer
          rightSection={
            loading ? (
              <Loader size={18} data-testid="Loader" />
            ) : (
              <Combobox.Chevron />
            )
          }
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          multiline
        >
          {genitore ? (
            formatAnelletto(
              genitore.soggetto.rna,
              genitore.soggetto.numero,
              genitore.soggetto.anno
            )
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

export default ComboboxSoggetto;
