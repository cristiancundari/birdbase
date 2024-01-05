import {
  IconGenderAgender,
  IconGenderFemale,
  IconGenderMale,
  TablerIconsProps,
} from "@tabler/icons-react";
import React from "react";

export function IconSessoMale(props: TablerIconsProps) {
  return <IconGenderMale color="#256ceb" {...props} />;
}

export function IconSessoFemale(props: TablerIconsProps) {
  return <IconGenderFemale color="#f92f8e" {...props} />;
}

export function IconSessoAgender(props: TablerIconsProps) {
  return <IconGenderAgender color="#d6d6d6" {...props} />;
}
