import errorNotificationClasses from "@/styles/errorNotification.module.scss";
import successNotificationClasses from "@/styles/successNotification.module.scss";
import { MantineColor } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { $Enums } from "@prisma/client";
import { IconBarrel, IconBat, IconLayoutGrid, IconToolsKitchen2, IconTrophy, IconVaccine, TablerIconsProps } from "@tabler/icons-react";
import { format } from "date-fns";
import React from "react";

export const MIN_LVL_PARENTELA: number = 2;
export const MAX_LVL_PARENTELA: number = 50;

interface ShowNotificationType {
  message: string;
  success?: boolean;
  title?: string;
}
export function showNotification({ title, message, success }: ShowNotificationType) {
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

export const getBucketImgPath = (bucket: string, path: string) => {
  return `https://yhpgtvnrcgqnqdkdbnqo.supabase.co/storage/v1/object/public/${bucket}/${path}`;
};

export function formatValuta(value: number) {
  return (
    value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }) + " €"
  );
}

export function formatData(value: Date | string | undefined) {
  if (value === undefined) {
    return "";
  }
  if (typeof value == "string") {
    value = new Date(value);
  }

  return format(value, "dd/MM/yyyy");
}

export function formatDataOra(value: Date | string | undefined) {
  if (value === undefined) {
    return "";
  }
  if (typeof value == "string") {
    value = new Date(value);
  }

  return format(value, "dd/MM/yyyy HH:mm");
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
  Gare: { icon: IconTrophy, color: "cyan" },
};

export const formatAnelletto = (rna: string, numero: string, anno: string) => {
  return `${rna}-${anno}-${numero}`;
};

export const getRangeYears = (transazioni: { anno: number }[]) => {
  const currentAnno = new Date().getFullYear();
  const minAnno = Math.min(...transazioni.map((transazione) => transazione.anno), currentAnno);
  return Array.from({ length: currentAnno - minAnno + 1 }, (_, index) => currentAnno - index);
};

export const coloriPriorita: { [key in $Enums.Priorita]: MantineColor } = {
  BASSA: "green",
  MEDIA: "yellow",
  ALTA: "red",
};

export const initialOptions: ReactPayPalScriptOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
  currency: "EUR",
  intent: "capture",
};
