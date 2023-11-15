import { notifications } from "@mantine/notifications";
import errorNotificationClasses from "@/styles/errorNotification.module.css";
import successNotificationClasses from "@/styles/successNotification.module.css";

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
