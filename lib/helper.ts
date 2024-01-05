import { notifications } from "@mantine/notifications";
import errorNotificationClasses from "@/styles/errorNotification.module.css";
import successNotificationClasses from "@/styles/successNotification.module.css";
import { format } from "date-fns";
import {
  IconBarrel,
  IconBat,
  IconGenderAgender,
  IconGenderFemale,
  IconGenderMale,
  IconLayoutGrid,
  IconToolsKitchen2,
  IconVaccine,
  TablerIconsProps,
} from "@tabler/icons-react";
import React from "react";

interface ShowNotificationType {
  message: string;
  success?: boolean;
  title?: string;
}
export function showNotification({
  title,
  message,
  success,
}: ShowNotificationType) {
  if (success) {
    notifications.show({
      message: message,
      title: title || "Eseguito",
      withBorder: true,
      classNames: successNotificationClasses,
    });
  } else {
    notifications.show({
      message: message,
      title: title || "Errore",
      withBorder: true,
      classNames: errorNotificationClasses,
    });
  }
}

export const imgPath =
  "https://yhpgtvnrcgqnqdkdbnqo.supabase.co/storage/v1/object/public/img/";

export function formatValuta(value: number) {
  return (
    value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }) + " €"
  );
}

export function formatData(value: Date | string) {
  if (typeof value == "string") {
    value = new Date(value);
  }

  return format(value, "dd/MM/yyyy");
}

export const transazioniIconColor: {
  [key: string]: {
    icon: React.FunctionComponent<TablerIconsProps>;
    color: string;
  };
} = {
  Gabbie: { icon: IconBarrel, color: "pink" },
  Alimenti: { icon: IconToolsKitchen2, color: "violet" },
  Medicine: { icon: IconVaccine, color: "yellow" },
  Soggetti: { icon: IconBat, color: "blue" },
  Altro: { icon: IconLayoutGrid, color: "gray" },
};

export const IconsSesso = {
  Male: (props: TablerIconsProps) =>
    IconGenderMale({ color: "#256ceb", ...props }),
  Female: (props: TablerIconsProps) =>
    IconGenderFemale({ color: "#f92f8e", ...props }),
  Agender: (props: TablerIconsProps) =>
    IconGenderAgender({ color: "#d6d6d6", ...props }),
};
