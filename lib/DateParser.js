import "dayjs/locale/it";
import dayjs from "dayjs";

export const dateParser = (val) => {
  const date = dayjs(val, ["DD/MM/YYYY", "DDMMYYYY", "DDMMYY"], "it").toDate();
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
  );
};
