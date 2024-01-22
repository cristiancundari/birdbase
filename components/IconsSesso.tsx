import { Tooltip } from "@mantine/core";
import {
  IconGenderAgender,
  IconGenderFemale,
  IconGenderMale,
  TablerIconsProps,
} from "@tabler/icons-react";
import React from "react";

export function IconSessoMale(props: TablerIconsProps) {
  return (
    <Tooltip label="Maschio">
      <IconGenderMale color="#256ceb" {...props} data-testid="IconSessoMale" />
    </Tooltip>
  );
}

export function IconSessoFemale(props: TablerIconsProps) {
  return (
    <Tooltip label="Femmina">
      <IconGenderFemale
        color="#f92f8e"
        {...props}
        data-testid="IconSessoFemale"
      />
    </Tooltip>
  );
}

export function IconSessoAgender(props: TablerIconsProps) {
  return (
    <Tooltip label="In attesa">
      <IconGenderAgender
        color="#d6d6d6"
        {...props}
        data-testid="IconSessoAgender"
      />
    </Tooltip>
  );
}
