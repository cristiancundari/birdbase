import { notifications } from "@mantine/notifications";
import errorNotificationClasses from "@/styles/errorNotification.module.css";
import successNotificationClasses from "@/styles/successNotification.module.css";
import { format } from "date-fns";
import {
  IconBarrel,
  IconBat,
  IconLayoutGrid,
  IconToolsKitchen2,
  IconTrophy,
  IconVaccine,
  TablerIconsProps,
} from "@tabler/icons-react";
import React from "react";
import { getServerUserProfile } from "./supabase/helper";
import {
  User,
  alexaSkillLinked,
  deactivateSkill,
} from "@/lib/amazon/alexaService";
import { ProfiloWithAllevatoreAndAmazonAccount } from "@/types/types";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

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

export function formatData(value: Date | string | undefined) {
  if (value === undefined) {
    return "";
  }
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
  Gare: { icon: IconTrophy, color: "cyan" },
};

export const formatAnelletto = (rna: string, numero: string, anno: string) => {
  return `${rna}-${anno}-${numero}`;
};

export const getRangeYears = (transazioni: { anno: number }[]) => {
  const currentAnno = new Date().getFullYear();
  const minAnno = Math.min(
    ...transazioni.map((transazione) => transazione.anno),
    currentAnno
  );
  return Array.from(
    { length: currentAnno - minAnno + 1 },
    (_, index) => currentAnno - index
  );
};

export const isAmazonAccountLinked = async (
  userProfile: ProfiloWithAllevatoreAndAmazonAccount
) => {
  if (userProfile && userProfile.amazonAccount) {
    const user: User = {
      amazonAccessToken: userProfile.amazonAccount.accessToken,
      amazonRefreshDate: userProfile.amazonAccount.refreshDate.toISOString(),
      amazonRefreshToken: userProfile.amazonAccount.refreshToken,
    };
    const isLinked = await alexaSkillLinked(user);
    if (!isLinked) {
      await prisma.profilo.update({
        where: { id: userProfile.id },
        data: { amazonAccount: { delete: true } },
      });
    }
    return isLinked;
  }
  return false;
};

export const deactivateAlexaSkill = async (
  userProfile: ProfiloWithAllevatoreAndAmazonAccount
) => {
  if (userProfile && userProfile.amazonAccount) {
    const user: User = {
      amazonAccessToken: userProfile.amazonAccount.accessToken,
      amazonRefreshDate: userProfile.amazonAccount.refreshDate.toISOString(),
      amazonRefreshToken: userProfile.amazonAccount.refreshToken,
    };
    const isLinked = await alexaSkillLinked(user);
    if (!isLinked) {
      await prisma.profilo.update({
        where: { id: userProfile.id },
        data: { amazonAccount: { delete: true } },
      });
    } else {
      const res = await deactivateSkill(user);
      if (res) {
        await prisma.profilo.update({
          where: { id: userProfile.id },
          data: { amazonAccount: { delete: true } },
        });
        return true;
      }
    }
  }
  return false;
};
