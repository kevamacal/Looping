import { differenceInDays, differenceInHours, format } from "date-fns";

export default function formatPostDate(createdAt) {
  const date = new Date();

  const dayDiff = differenceInDays(date, createdAt);

  if (dayDiff > 7) {
    return format(createdAt, "dd/MM/yyyy");
  }

  if (dayDiff >= 1) {
    return `Hace ${dayDiff} día${dayDiff > 1 ? "s" : ""}`;
  }

  const hourDiff = differenceInHours(date, createdAt);
  return `Hace ${hourDiff} hora${hourDiff > 1 ? "s" : ""}`;
}
