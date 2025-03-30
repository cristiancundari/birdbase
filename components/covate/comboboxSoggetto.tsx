import { Combobox, Input, InputBase, Loader, ScrollArea, useCombobox } from "@mantine/core";
import React, { useState } from "react";
import ComboboxSoggettoItem from "./comboboxSoggettoItem";
import { Soggetto } from "@prisma/client";
import { formatAnelletto } from "@/lib/helper";
import { SoggettoWithVenditeWithParentela } from "@/types/types";

interface ISoggetti extends SoggettoWithVenditeWithParentela {
  valutazione?: number;
}

interface ComboboxSoggettoProps {
  soggetti: ISoggetti[];
  onComboboxChange: (val: string) => void;
  selected?: string;
  label: string;
  loading: boolean;
  description?: string;
}

function ComboboxSoggetto({ soggetti, onComboboxChange, selected, label, loading, description }: ComboboxSoggettoProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const options = soggetti
    .filter((s) => (s.soggetto.inserzioniVendita?.length || 0) == 0)
    .map((s) => (
      <Combobox.Option value={s.soggetto.id} key={s.soggetto.id}>
        <ComboboxSoggettoItem soggetto={s.soggetto} parentela={s.parentela} valutazione={s.valutazione} />
      </Combobox.Option>
    ));

  const soggettoSelezionato: SoggettoWithVenditeWithParentela | undefined = soggetti.find((s) => s.soggetto.id == selected);
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
          rightSection={loading ? <Loader size={18} data-testid="Loader" /> : <Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          multiline
        >
          {soggettoSelezionato ? (
            formatAnelletto(soggettoSelezionato.soggetto.rna, soggettoSelezionato.soggetto.numero, soggettoSelezionato.soggetto.anno)
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
