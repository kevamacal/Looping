import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isToday,
  isYesterday,
  format,
} from "date-fns";
import { es } from "date-fns/locale";

export default function formatPostDate(createdAt) {
  const now = new Date();
  const date = new Date(createdAt);

  if (differenceInSeconds(now, date) < 60) {
    return "Justo ahora";
  }

  const minDiff = differenceInMinutes(now, date);
  if (minDiff < 60) {
    return `Hace ${minDiff} min`;
  }

  const hourDiff = differenceInHours(now, date);
  if (isToday(date)) {
    return format(date, "'Hoy a las' HH:mm", { locale: es });
  }

  if (isYesterday(date)) {
    return format(date, "'Ayer a las' HH:mm", { locale: es });
  }

  if (differenceInDays(now, date) < 7) {
    return format(date, "EEEE 'a las' HH:mm", { locale: es }); // ej: lunes a las 14:30
  }

  return format(date, "dd MMM 'a las' HH:mm", { locale: es }); // ej: 27 jul a las 18:10
}
